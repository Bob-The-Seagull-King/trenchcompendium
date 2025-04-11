import React, { useState } from 'react';
import axios from 'axios';

const SynodRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // const synodUrl = 'http://synod.trench-companion.test/'; // this is for local dev
    const synodUrl = 'https://synod.trench-companion.com/'; // this is for prod


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Simple validation
        if (!email || !password) {
            setError('Please fill out all fields');
            return;
        }

        try {
            const response = await axios.post(synodUrl+'wp-json/wp/v2/users/register', {
                username: email,
                email,
                password,
            });

            if (response.status === 201) {
                setMessage('User registered successfully. Please log in.');
            }
        } catch (err) {
            setError('An error occurred while registering.');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SynodRegister;