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
        <>
            <h1 className={'mt-3'}>Sign Up</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className={'mb-3'}>
                    <label htmlFor="synod-register-email" className="form-label">Email address</label>
                    <input
                        type="email" id={'synod-register-email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={'form-control'}
                    />
                </div>
                <div className={'mb-3'}>
                    <label htmlFor="synod-register-password" className="form-label">Password</label>
                    <input
                        type="password" id={'synod-register-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={'form-control'}
                    />
                </div>

                <div className={'mb-3'}>
                    <button type="submit" className={'btn btn-primary'}>Sign Up</button>
                </div>
            </form>
        </>
    );
};

export default SynodRegister;