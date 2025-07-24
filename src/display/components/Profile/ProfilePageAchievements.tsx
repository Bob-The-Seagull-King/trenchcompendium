/**
 * This component shows the card for the achievements of a user
 */

import React, { useEffect, useState } from 'react'
import SynodImage from "../../../utility/SynodImage";
import {SiteUser} from "../../../classes/user_synod/site_user";
import {SiteUserPublic} from "../../../classes/user_synod/user_public";
import LoadingOverlay from "../generics/Loading-Overlay";
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import {IAchievement} from "../../../classes/user_synod/user_achievements";
import {OverlayTrigger, Popover} from "react-bootstrap";

interface ProfilePageAchievementsProps {
    userData: SiteUser | SiteUserPublic | null;
}

const ProfilePageAchievements: React.FC<ProfilePageAchievementsProps> = ({ userData }) => {

    const [achievements, setAchievements] = useState<IAchievement[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const loadAchievements = async () => {

            if (!userData || typeof userData.GetAchievements !== 'function') return;

            try {
                setIsLoading(true);
                const achievementList = await userData.GetAchievements();
                setAchievements(achievementList);
            } catch (error) {
                console.error('Failed to load achievements:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAchievements();
    }, [userData]);


    if (isLoading) {
        return (
            <div className="ProfilePageAchievements">
                <div className={'profile-card'}>
                    <div className={'profile-card-head'}>
                        {'Achievements'}
                    </div>

                    <div className={'profile-card-content'}>
                        <div className={'profile-card-loading'}>
                            <LoadingOverlay
                                message={'Loading Achievements'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderPopover = (achievement: IAchievement) => (
        <Popover id={`popover-${achievement.id}`}>
            <div className="popover-headline">
                {achievement.name}
            </div>
            <div className="popover-content">
                {achievement.description || 'No description available.'}
            </div>
        </Popover>
    )

    return (
        <div className="ProfilePageAchievements">
            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Achievements'}
                </div>

                <div className={'profile-card-content'}>
                    { achievements.length > 0 ? (
                        <ul className={'achievement-list'}>


                            {achievements.map((achievement) => (
                                <OverlayTrigger
                                    key={achievement.id}
                                    trigger="click"
                                    placement="top"
                                    overlay={renderPopover(achievement)}
                                    rootClose // closes the popover when clicking outside
                                >
                                    <li className={'achievement'} style={{ cursor: 'pointer' }}>
                                        <img
                                            src={achievement.image_url}
                                            alt={achievement.name}
                                            className={'achievement-image'}
                                        />
                                    </li>
                                </OverlayTrigger>
                            ))}
                        </ul>
                    ):(
                        <div className={'px-4 py-4'}>
                            {'No Achievements collected'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePageAchievements