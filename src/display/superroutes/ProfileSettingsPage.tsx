/**
 * On this page, the user can edit their profile and account settings
 */

import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utility/AuthContext'
import {Form} from "react-bootstrap";
import {makestringpresentable} from "../../utility/functions";

/**
 * On this page, the user can edit their account / profile settings
 */

const ProfileSettingsPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>()
    const { isLoggedIn, userId, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        // Don't run redirect until we have an ID from the URL
        if (!id) return

        const numericId = parseInt(id, 10)

        if (!isLoggedIn || userId === null || numericId !== userId) {
            navigate(`/profile/${numericId}`)
        }
    }, [isLoggedIn, userId, id, navigate])

    if (!id) return null // Don't render anything until params are ready

    const initialUsername = 'Super Trencher';
    const initialEmail = 'lorem@ipsum.dolor';
    // State for fields
    const [username, setUsername] = useState(initialUsername)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState(initialEmail)

    const hasChanges =
        username !== initialUsername || password.trim() !== '' || email !== initialEmail

    return (
        <div className="ProfileSettingsPage">
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <h1>Profile Settings</h1>

                        {/* @TODO: add save action*/}
                        {hasChanges && (
                            <button className="btn btn-primary btn-save-setting">
                                {'Save Settings'}
                            </button>
                        )}

                    </div>

                    <div className={'col-12'}>
                        <Form.Group controlId={'user-settings-username'} className={'mb-3'}>
                            <Form.Label>{'Username'}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId={'user-settings-password'} className={'mb-3'}>
                            <Form.Label>{'New Password'}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter a new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId={'user-settings-email'} className={'mb-3'}>
                            <Form.Label>{'E-Mail Address'}</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your E-Mail Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                    </div>
                </div>

                <button onClick={logout} className="btn btn-secondary">
                    Log out
                </button>
            </div>
        </div>
    )
}

export default ProfileSettingsPage