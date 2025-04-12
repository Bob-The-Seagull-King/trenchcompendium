import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
interface LoginProps {
    onLogin: (token: string, userId: number) => void;
}

interface JwtPayload {
    data: {
        user: {
            id: number;
        };
    };
}

const SynodLogin: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // const synodUrl = 'http://synod.trench-companion.test/';  // this is for local dev
    const synodUrl = 'https://synod.trench-companion.com/'; // This is for prod

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !password) {
            setError('Please fill out all fields');
            return;
        }

        try {
            const response = await axios.post(`${synodUrl}wp-json/jwt-auth/v1/token`, {
                username: email,
                password,
            });

            const token = response.data.token;
            const decoded = jwtDecode<JwtPayload>(token);
            const userId = decoded.data.user.id;

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('synodUserId', userId.toString());

            onLogin(token, userId);
            setMessage('Login successful!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default SynodLogin;