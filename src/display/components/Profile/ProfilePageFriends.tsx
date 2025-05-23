/**
 * This is the friends list in the profile view
 */

import React, { useEffect, useState } from 'react'
import SynodImage from "../../../utility/SynodImage";

interface ProfilePageFriendsProps {
    userId: number
}

const ProfilePageFriends: React.FC<ProfilePageFriendsProps> = ({ userId }) => {

    // @TODO: Replace with Synod Data
    const friends = [
        {
            id: 1,
            username: 'Crimson Knight',
            status: 'supporter'
        },
        {
            id: 2,
            username: 'Iron Warden',
            status: 'member'
        },
        {
            id: 3,
            username: 'Ghost Fox Killer Elite XXXX',
            status: 'supporter'
        },
        {
            id: 4,
            username: 'Learchus',
            status: 'member'
        },
        {
            id: 5,
            username: 'Bob',
            status: 'Lunatic Supporter'
        }
    ]


    return (
        <div className="ProfilePageFriends">
            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Friends'}
                </div>

                <div className={'profile-card-content'}>
                    <ul className={'friends-list'}>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfilePageFriends