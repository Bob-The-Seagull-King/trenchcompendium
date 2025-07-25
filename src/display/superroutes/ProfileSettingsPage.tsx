import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utility/AuthContext';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import {SYNOD} from "../../resources/api-constants";
import LoadingOverlay from "../components/generics/Loading-Overlay";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faCircleNotch, faFloppyDisk} from "@fortawesome/free-solid-svg-icons";
import {ToastContainer, toast} from "react-toastify";
import { SynodDataCache } from '../../classes/_high_level_controllers/SynodDataCache';
import ProfileSubscriptionView from "../components/Profile/ProfileSubscriptionView";
import {SiteUser} from "../../classes/user_synod/site_user";
import {UserFactory} from "../../factories/synod/UserFactory";



const ProfileSettingsPage: React.FC = () => {
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');
    const { isLoggedIn, userId, authToken, logout } = useAuth();
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false)
    const [toastMsg, setToastMsg] = useState('')

    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [initialNickname, setInitialNickname] = useState('');
    const [initialEmail, setInitialEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [isLoadingSubmit, setisLoadingSubmit] = useState(false)


    useEffect(() => {
        if ( !userId || !isLoggedIn ) {
            navigate(`/profile/${userId}`);
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
    }, [userId, authToken, navigate]);

    const hasChanges =
        nickname !== initialNickname || email !== initialEmail || password.trim() !== '';

    const handleLogout = async () => {
        const id = userId
        logout();
        navigate(`/profile/${id}`);
        return;
    }
    const handleSave = async () => {
        setisLoadingSubmit(true);

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

            if (userId != null) {
                const userdatacache : SynodDataCache = SynodDataCache.getInstance();

                delete userdatacache.userObjectCache[userId]
                delete userdatacache.userDataCache[userId]
                delete userdatacache.callUserDataCache[userId]
            }

            setInitialNickname(nickname);
            setInitialEmail(email);
            setPassword('');

            toast.success('Settings saved successfully.')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update settings.');
            toast.error('Error: Settings could not be saved.')
        } finally {
            setisLoadingSubmit(false);
        }
    };

    if (!userId || loading ) return (
        <div className="ProfileSettingsPage">
            <LoadingOverlay
                message={'Loading your settings'}
            />
        </div>
    )


    return (
        <div className="ProfileSettingsPage">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1>
                            <a className={'headline-back-btn'} href={'/profile/' + userId}
                               onClick={() => (
                                navigate('/profile/' + userId)
                            )}>
                                <FontAwesomeIcon icon={faChevronLeft} className={''}/>
                            </a>
                            {'Account Settings'}
                        </h1>
                    </div>

                    <div className="col-12">
                        <div className={'profile-settings mb-3'}>
                            <h2>
                                {'Your Account'}
                            </h2>

                            <button onClick={handleLogout} className="btn btn-secondary btn-logout">
                                Log out
                            </button>

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

                            {hasChanges && (
                                <button className="btn btn-primary btn-save-setting"
                                        disabled={isLoadingSubmit}
                                        onClick={(e) => {
                                            if (!isLoadingSubmit) {
                                                handleSave();
                                            }
                                        }}>
                                    {isLoadingSubmit ? (
                                        <>
                                            <FontAwesomeIcon icon={faCircleNotch}
                                                             className={'icon-inline-left-l fa-spin'}/>
                                            {'Saving'}
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faFloppyDisk} className={'icon-inline-left-l'}/>
                                            {'Save Settings'}
                                        </>
                                    )}
                                </button>
                            )}

                            {error && <p style={{color: 'red'}}>{error}</p>}
                            {message && <p style={{color: 'green'}}>{message}</p>}
                        </div>
                    </div>

                    <div className={'col-12'}>
                        <ProfileSubscriptionView/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;