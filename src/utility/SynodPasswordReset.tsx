import React, { useState } from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

const SynodPasswordReset: React.FC = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [resetKey, setResetKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [login, setLogin] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [isLoadingSendResetLink, setIsLoadingSendResetLink] = useState(false); // Loading state
    const [isLoadingResetPassword, setIsLoadingResetPassword] = useState(false); // Loading state

    // const synodUrl = 'http://synod.trench-companion.test/';  // this is for local dev
    const synodUrl = 'https://synod.trench-companion.com/'; // this is for prod

    const handleSendResetLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoadingSendResetLink(true);

        try {
            const response = await axios.post(`${synodUrl}wp-json/wp/v2/users/lostpassword`, {
                user_login: emailOrUsername,
            });

            setMessage('Password reset email sent. Check your inbox.');
            console.log(response);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoadingSendResetLink(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoadingResetPassword(true);

        try {
            const response = await axios.post(`${synodUrl}wp-json/wp/v2/users/reset_password`, {
                login,
                key: resetKey,
                password: newPassword,
            });

            setMessage('Password reset successful!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Password reset failed');
        } finally {
            setIsLoadingResetPassword(false);
        }
    };

    return (
        <div>
            <h1 className={'mt-3'}>Forgot Password</h1>

            <p>
                {'Have you forgotten your password or want to change it? Request a reset code below.'}
            </p>

            <h2 className={'mt-3'}>Get Reset Code</h2>

            <form onSubmit={handleSendResetLink}>
                <label htmlFor="synod-login-forgot-email" className="form-label">Email address</label>

                <div className={'mb-3'}>
                    <input
                        type="text" id={'synod-login-forgot-email'}
                        className={'form-control'}
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="Email or Username"
                    />

                </div>

                <div className={'mb-3'}>
                    <button type="submit" className={'btn btn-primary'}>
                        {isLoadingSendResetLink ?
                            <>
                                {'Loading'}
                                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin icon-inline-right-l"/>
                            </>
                            :
                            <>
                                {'Get Reset Code'}
                            </>
                        }
                    </button>
                </div>
            </form>

            <h2 className={'mt-3'}>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <div className={'mb-3'}>
                    <label htmlFor="synod-login-reset-email" className="form-label">Email address</label>
                    <input
                        type="text" id={'synod-login-reset-email'}
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Username" className={'form-control'}
                    />
                </div>
                <div className={'mb-3'}>
                    <label htmlFor="synod-login-reset-code" className="form-label">Reset Code</label>
                    <input
                        type="text"  id={'synod-login-reset-code'}
                        value={resetKey}
                        onChange={(e) => setResetKey(e.target.value)}
                        placeholder="Reset Code from Email" className={'form-control'}
                    />
                </div>
                <div className={'mb-3'}>
                    <label htmlFor="synod-login-reset-pw" className="form-label">New Password</label>
                    <input
                        type="password" id={'"synod-login-reset-pw'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password" className={'form-control'}
                    />
                </div>

                <div className={'mb-3'}>
                    <button type="submit" className={'btn btn-primary'}>
                        {isLoadingResetPassword ?
                            <>
                                {'Loading'}
                                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin icon-inline-right-l"/>
                            </>
                            :
                            <>
                                {'Reset Password'}
                            </>
                        }
                    </button>
                </div>
            </form>

            {message && <p style={{color: 'green'}}>{message}</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default SynodPasswordReset;