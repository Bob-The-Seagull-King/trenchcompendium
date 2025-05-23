/**
 * On this page, any user can see a profile
 * - logged in users can change his profile here
 */


import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utility/AuthContext'
import SynodImage from "../../utility/SynodImage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faDownload, faPlus} from "@fortawesome/free-solid-svg-icons";
import ProfilePageAchievements from "../components/Profile/ProfilePageAchievements";
import ProfilePageFriends from "../components/Profile/ProfilePageFriends";
import ProfilePageCampaigns from "../components/Profile/ProfilePageCampaigns";
import ProfilePageWarbands from "../components/Profile/ProfilePageWarbands";

/**
 * On this page, any user can see a profile.
 * If it's their own profile, they get additional options.
 */

const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id?: string }>()
    const { isLoggedIn, userId, logout } = useAuth()
    const navigate = useNavigate()

    const isOwnProfile = isLoggedIn && id && parseInt(id, 10) === userId

    if (!id) return null

    return (
        <div className="ProfilePage">

            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <div className={'profile-intro'}>
                            <div className={'profile-image-wrap'}>
                                <SynodImage
                                    imageId={113}
                                    size="large"
                                    className="profile-image"
                                />
                            </div>

                            <h1 className={'profile-name'}>
                                {'Super Trencher'}
                            </h1>

                            <h2 className={'profile-sub'}>
                                {'Supporter'}
                            </h2>

                            {isOwnProfile ? (
                                <button className={'btn btn-primary'}>
                                    <FontAwesomeIcon icon={faCog} className="icon-inline-left"/>
                                    {'Settings'}
                                </button>
                            ) : (
                                <button className={'btn btn-primary'}>
                                    <FontAwesomeIcon icon={faPlus} className="icon-inline-left"/>
                                    {'Add Friend'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={'col-12'}>
                        <ProfilePageAchievements userId={parseInt(id)} />
                    </div>

                    <div className={'col-12'}>
                        <ProfilePageFriends userId={parseInt(id)} />
                    </div>

                    <div className={'col-12'}>
                        <ProfilePageCampaigns userId={parseInt(id)} />
                    </div>

                    <div className={'col-12'}>
                        <ProfilePageWarbands userId={parseInt(id)} />
                    </div>
                </div>
            </div>

            <h1>Viewing Profile: {id}</h1>

            {isOwnProfile && (
                <div className="own-profile-actions mt-3">
                    <button onClick={logout} className="btn btn-secondary">
                        Log out
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePage