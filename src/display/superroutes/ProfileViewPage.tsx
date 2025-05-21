/**
 * On this page, any user can see a profile
 */


import React from 'react'
import { useParams } from 'react-router-dom'

const ProfileViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    return (
        <div className="ProfileViewPage">
            <h1>Viewing Profile: {id}</h1>
        </div>
    )
}

export default ProfileViewPage