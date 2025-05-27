import React, { useState } from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {SYNOD} from "../resources/api-constants";

const SynodRegister = () => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple validation
        if (!email || !password) {
            setError('Please fill out all fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(SYNOD.URL+'/wp-json/wp/v2/users/register', {
                username: email,
                email,
                password,
                nickname
            });

            if (response.status === 201) {
                setMessage('User registered successfully. Please log in.');
            }
        } catch (err) {
            setError('An error occurred while registering.');
        } finally {
            setIsLoading(false);
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
                    <label htmlFor="synod-register-nickname" className="form-label">Nickname</label>
                    <input
                        type="email" id={'synod-register-nickname'}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Nickname"
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
                    <button type="submit" className={'btn btn-primary'}>
                        {isLoading ?
                            <>
                                {'Loading'}
                                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin icon-inline-right-l"/>
                            </>
                            :
                            <>
                                {'Sign up'}
                            </>
                        }
                    </button>
                </div>
            </form>
        </>
    );
};

export default SynodRegister;