/**
 * On this page, the user can edit their profile and account settings
 */

import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utility/AuthContext'

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

    return (
        <div className="ProfileSettingsPage">
            <h1>Edit Profile</h1>
            <p>User ID: {id}</p>
            <button onClick={logout} className="btn btn-secondary">
                Log out
            </button>
        </div>
    )
}

export default ProfileSettingsPage