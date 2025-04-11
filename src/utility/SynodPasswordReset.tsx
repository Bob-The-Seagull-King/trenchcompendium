import React, { useState } from 'react';
import axios from 'axios';

const SynodPasswordReset: React.FC = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [resetKey, setResetKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [login, setLogin] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // const synodUrl = 'http://synod.trench-companion.test/';  // this is for local dev
    const synodUrl = 'https://synod.trench-companion.com/'; // this is for prod

    const handleSendResetLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${synodUrl}wp-json/wp/v2/users/lostpassword`, {
                user_login: emailOrUsername,
            });

            setMessage('Password reset email sent. Check your inbox.');
            console.log(response);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${synodUrl}wp-json/wp/v2/users/reset_password`, {
                login,
                key: resetKey,
                password: newPassword,
            });

            setMessage('Password reset successful!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Password reset failed');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>

            <div className={'alert'}>
                <form onSubmit={handleSendResetLink}>
                    <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="Email or Username"
                    />
                    <button type="submit">Send Reset Email</button>
                </form>
            </div>

            <h3>Reset Password</h3>
            <form onSubmit={handleResetPassword}>
                <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="text"
                    value={resetKey}
                    onChange={(e) => setResetKey(e.target.value)}
                    placeholder="Reset Code from Email"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                />
                <button type="submit">Reset Password</button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SynodPasswordReset;