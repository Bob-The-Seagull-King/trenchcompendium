/**
 * On this page, any user can see a profile
 * - logged in users can change his profile here
 */


import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utility/AuthContext'
import SynodImage from "../../utility/SynodImage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faDownload, faPlus, faQrcode} from "@fortawesome/free-solid-svg-icons";
import ProfilePageAchievements from "../components/Profile/ProfilePageAchievements";
import ProfilePageFriends from "../components/Profile/ProfilePageFriends";
import ProfilePageCampaigns from "../components/Profile/ProfilePageCampaigns";
import ProfilePageWarbands from "../components/Profile/ProfilePageWarbands";
import CustomNavLink from "../components/subcomponents/interactables/CustomNavLink";
import { SiteUser } from '../../classes/user_synod/site_user';
import { UserFactory } from '../../factories/synod/UserFactory';
import ProfileShareDrawer from "../components/Profile/ProfileShareDrawer";
import ProfileChangeProfilePictureDrawer from "../components/Profile/ProfileChangeProfilePictureDrawer";
import { SiteUserPublic } from '../../classes/user_synod/user_public';
import {SYNOD} from "../../resources/api-constants";
import {toast, ToastContainer} from "react-toastify";

/**
 * On this page, any user can see a profile.
 * If it's their own profile, they get additional options.
 */

const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id?: string }>()
    const { isLoggedIn, userId, logout } = useAuth()

    /**
     * Handle Profile picture change
     */
    // @TODO: change profile picture on change



    const navigate = useNavigate()

    const isOwnProfile = isLoggedIn() && id && parseInt(id, 10) === userId

    /** Share Drawer */
    const [showShareDrawer, setShowShareDrawer] = useState(false)
    const handleOpenShareDrawer = () => setShowShareDrawer(true)
    const handleCloseShareDrawer = () => setShowShareDrawer(false)

    /** Share Drawer */
    const [showPfPDrawer, setShowPfPDrawer] = useState(false)
    const handleOpenPfPDrawer = () => setShowPfPDrawer(true)
    const handleClosePfPDrawer = () => setShowPfPDrawer(false)


    /**
     * Get public user Data
     */
    const [userData, setUserData] = React.useState<SiteUser | SiteUserPublic | null>(null)
    const [keyvar, setkeyvar] = useState(0);
    React.useEffect(() => {

        async function GetUserContent() {
            console.log(id)
            
            if (!id) return

            let UserData : SiteUserPublic | SiteUser | null = null;
            if (isLoggedIn() && (userId == Number(id))) {
                UserData = await UserFactory.CreatePrivateUserByID(Number(id));
            } else {
                UserData = await UserFactory.CreatePublicUserByID(Number(id));
            }

            if (UserData != null) {
                setUserData(UserData);
                setkeyvar(keyvar + 1)
            }
        }

        GetUserContent()
    }, [])

    /**
     * Handle add friend
     */
    const handleOpenAddFriend =  async () => {
        const token = localStorage.getItem('jwtToken'); // You can refactor this to use a better auth system
        if (!token) throw new Error('User is not authenticated');

        const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/friends/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "target_user_id": userData?.GetUserId()
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();

            toast.error('Friend request already sent.')

            throw new Error(`Failed to request friend: ${errorText}`);
        }

        toast.success('Friend request sent.')
    }

    if (!id) return null

    return (
        <div className="ProfilePage">
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

            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-12 col-lg-7'}>
                        <div className={'profile-intro'} key={keyvar}>
                                {((userData instanceof SiteUser) ) ? (
                                    <div
                                        className={'profile-image-wrap editable'}
                                        onClick={handleOpenPfPDrawer}
                                    >
                                        <SynodImage
                                            imageId={userData?.GetProfilePictureImageId() || 0}
                                            size="large"
                                            className="profile-image"
                                        />
                                    </div>
                                ):(
                                    <div className={'profile-image-wrap'}>
                                        <SynodImage
                                            imageId={userData?.GetProfilePictureImageId() || 0}
                                            size="large"
                                            className="profile-image"
                                        />
                                    </div>
                                )}
                            


                            <div className={'profile-intro-text'}>
                                <h1 className={'profile-name'}>
                                    {userData?.GetNickname() || 'Loading...'}
                                </h1>

                                <h2 className={'profile-sub'}>
                                    {'Supporter'}
                                </h2>



                            
                                    {((userData instanceof SiteUser) ) ? (
                                        <>
                                            <CustomNavLink
                                                classes={'btn btn-primary'}
                                                link={ '/profile/' + userData?.GetUserId() + '/settings' || `/profile/${id}/settings`}
                                                runfunc={() => {
                                                    navigate( '/profile/' + userData?.GetUserId() + '/settings' || `/profile/${id}/settings`)
                                                }}>
                                                <FontAwesomeIcon icon={faCog} className="icon-inline-left"/>
                                                {'Settings'}
                                            </CustomNavLink>

                                            <div className={'btn btn-secondary'} onClick={handleOpenShareDrawer}>
                                                <FontAwesomeIcon
                                                    icon={faQrcode}

                                                />
                                            </div>

                                            <div className={'btn btn-secondary'} onClick={logout}>
                                                Log out
                                            </div>
                                        </>


                                    ) : (
                                        <>
                                        {isLoggedIn() &&
                                            // @TODO: add friend action
                                            <button
                                                className={'btn btn-primary'}
                                                onClick={handleOpenAddFriend}
                                            >
                                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left"/>
                                                {'Add Friend'}
                                            </button>
                                        }
                                        </>
                                    )}
                                
                            </div>
                        </div>

                        <div className={'hide-lg-up'}>
                            <ProfilePageAchievements userId={parseInt(id)}/>

                            <ProfilePageFriends userId={parseInt(id)}/>
                        </div>

                        <ProfilePageCampaigns userId={parseInt(id)}/>

                        <ProfilePageWarbands userId={parseInt(id)}/>
                    </div>

                    <div className={'col-12 col-lg-5'}>
                        <div className={'hide-lg-down'}>
                            <ProfilePageAchievements userId={parseInt(id)}/>

                            <ProfilePageFriends userId={parseInt(id)}/>
                        </div>
                    </div>
                </div>
            </div>

            
                    {((userData instanceof SiteUser)) && (
                    <>
                        <ProfileShareDrawer
                            userId={parseInt(id)}
                            show={showShareDrawer}
                            onClose={handleCloseShareDrawer}
                        />

                        {userData &&
                            <ProfileChangeProfilePictureDrawer
                                userId={parseInt(id)}
                                show={showPfPDrawer}
                                onClose={handleClosePfPDrawer}
                            />
                        }
                    </>

                )}
            

        </div>

    )
}

export default ProfilePage