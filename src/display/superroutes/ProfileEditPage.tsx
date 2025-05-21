import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utility/AuthContext'

const ProfileEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { isLoggedIn, userId, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn || parseInt(id || '') !== userId) {
            navigate(`/profile/${id}`)
        }
    }, [isLoggedIn, userId, id, navigate])

    return (
        <div className="ProfileEditPage">
            <h1>Edit Profile</h1>
            <p>User ID: {id}</p>
            <button onClick={logout} className="btn btn-secondary">
                Log out
            </button>
        </div>
    )
}

export default ProfileEditPage