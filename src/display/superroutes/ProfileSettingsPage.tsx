import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utility/AuthContext';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import {SYNOD} from "../../resources/api-constants";
import LoadingOverlay from "../components/generics/Loading-Overlay";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";



const ProfileSettingsPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { isLoggedIn, userId, authToken, logout } = useAuth();
    const navigate = useNavigate();

    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [initialNickname, setInitialNickname] = useState('');
    const [initialEmail, setInitialEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id || !userId || !isLoggedIn || parseInt(id, 10) !== userId) {
            navigate(`/profile/${id}`);
            return;
        }

        if (!authToken) return;

        // Fetch current user info
        axios
            .get(SYNOD.URL + '/wp-json/wp/v2/users/me', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            .then((res) => {

                console.log(res);

                const { nickname, email } = res.data;
                setNickname(nickname || '');
                setEmail(email || '');
                setInitialNickname(nickname || '');
                setInitialEmail(email || '');
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load user info.');
                setLoading(false);
            });
    }, [id, userId, isLoggedIn, authToken, navigate]);

    const hasChanges =
        nickname !== initialNickname || email !== initialEmail || password.trim() !== '';

    const handleSave = async () => {
        if (!authToken) return;

        setError('');
        setMessage('');

        try {
            const payload: any = {};
            if (nickname !== initialNickname) payload.nickname = nickname;
            if (email !== initialEmail) payload.email = email;
            if (password.trim()) payload.password = password;

            await axios.post(
                SYNOD.URL + '/wp-json/wp/v2/users/me',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            setInitialNickname(nickname);
            setInitialEmail(email);
            setPassword('');
            setMessage('Settings saved successfully.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update settings.');
        }
    };

    if (!id || loading ) return (
        <div className="ProfileSettingsPage">
            <LoadingOverlay
                message={'Loading your settings'}
            />
        </div>
    )

    return (
        <div className="ProfileSettingsPage">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1>
                            <span className={'headline-back-btn'} onClick={() => (
                                navigate('/profile/' + id)
                            )}>
                                <FontAwesomeIcon icon={faChevronLeft} className={''}/>
                            </span>
                            {'Profile Settings'}
                        </h1>

                        <button onClick={logout} className="btn btn-secondary mb-3">
                            Log out
                        </button>

                        {error && <p style={{color: 'red'}}>{error}</p>}
                        {message && <p style={{color: 'green'}}>{message}</p>}

                        {hasChanges && (
                            <button className="btn btn-primary btn-save-setting" onClick={handleSave}>
                                Save Settings
                            </button>
                        )}
                    </div>

                    <div className="col-12">
                        <Form.Group controlId="user-settings-nickname" className="mb-3">
                        <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="user-settings-password" className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter a new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="user-settings-email" className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ProfileSettingsPage;