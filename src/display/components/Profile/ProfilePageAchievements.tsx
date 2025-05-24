/**
 * This component shows the card for the achievements of a user
 */

import React, { useEffect, useState } from 'react'
import SynodImage from "../../../utility/SynodImage";

interface ProfilePageAchievementsProps {
    userId?: number
}

const ProfilePageAchievements: React.FC<ProfilePageAchievementsProps> = ({ userId }) => {

    // @TODO: These are just test - replace with synod data
    const achievements = [
        {
            id: 1,
            name: 'First Blood',
            description: 'Has the first blood lorem ipsum dolor sit amet constetutor a 1000 times',
            image: 251
        },
        {
            id: 2,
            name: 'Veteran Fighter',
            description: 'Has the first blood lorem ipsum dolor sit amet constetutor a 1000 times',
            image: 252
        },
        {
            id: 3,
            name: 'Master Strategist',
            description: 'Has the first blood lorem ipsum dolor sit amet constetutor a 1000 times',
            image: 253
        },
        {
            id: 4,
            name: 'Warlord of the Wastes',
            description: 'Has the first blood lorem ipsum dolor sit amet constetutor a 1000 times',
            image: 254
        },
        {
            id: 5,
            name: 'Unbroken',
            description: 'Has the first blood lorem ipsum dolor sit amet constetutor a 1000 times',
            image: 255
        },
        {
            id: 6,
            name: 'Collector of Relics',
            description: 'Has the first blood lorem ipsum dolor sit amet constetutor a 1000 times',
            image: 254

        },
        {
            id: 7,
            name: 'Champion of the Synod',
            description: 'Has the first blood lorem ipsum dolor sit amet constetutor a 1000 times',
            image: 253
        }
    ]

    // @TODO: if no userData is set -> get achievements for user


    return (
        <div className="ProfilePageAchievements">
            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Achievements'}
                </div>

                <div className={'profile-card-content'}>
                    <ul className={'achievement-list'}>
                        {achievements.map((achievement) => (
                            <li key={achievement.id} className={'achievement'}>
                                <SynodImage imageId={achievement.image}
                                            className={'achievement-image'}
                                />
                                {/* @TODO: Add popover with Name and Description */}
                                {/*{achievement.name}*/}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfilePageAchievements