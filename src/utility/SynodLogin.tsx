import React, { useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from './AuthContext'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {SYNOD} from "../resources/api-constants";

interface JwtPayload {
    data: {
        user: {
            id: number;
        };
    };
}

interface SynodLoginProps {
    onLoginSuccess?: () => void;
}

const SynodLogin: React.FC<SynodLoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const { isLoggedIn, login } = useAuth()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setMessage('')

        if (!email || !password) {
            setError('Please fill out all fields')
            setIsLoading(false)
            return
        }

        try {
            const response = await axios.post(`${SYNOD.URL}/wp-json/jwt-auth/v1/token`, {
                username: email,
                password,
            })

            const token = response.data.token
            const decoded = jwtDecode<JwtPayload>(token)
            const userId = decoded.data.user.id

            login(token, userId)
            //setUserId(userId)

            // ✅ Trigger redirect after login
            if (onLoginSuccess) {
                onLoginSuccess()
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <h1 className={'mt-3'}>Login</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {!isLoggedIn && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="synod-login-email" className="form-label">Email address</label>
                        <input
                            type="email"
                            id="synod-login-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="synod-login-password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="synod-login-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">
                            {isLoading ? (
                                <>
                                    {'Loading'}
                                    <FontAwesomeIcon icon={faCircleNotch} className="fa-spin icon-inline-right-l" />
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>
            )}

            {isLoggedIn && (
                <div className="alert alert-success mt-3 mb-3">
                    {'You are logged in'}
                </div>
            )}
        </>
    )
}

export default SynodLogin