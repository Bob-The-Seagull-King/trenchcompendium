/**
 * On this page, any user can see a profile
 * - logged in users can change his profile here
 */


import React, {useState} from 'react'
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

/**
 * On this page, any user can see a profile.
 * If it's their own profile, they get additional options.
 */

const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id?: string }>()
    const { isLoggedIn, userId, logout } = useAuth()
    const navigate = useNavigate()

    const isOwnProfile = isLoggedIn && id && parseInt(id, 10) === userId

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
    const [userData, setUserData] = React.useState<SiteUser | null>(null)
    React.useEffect(() => {

        async function GetUserContent() {
            console.log(id)
            
            if (!id) return

            const UserData : SiteUser | null = await UserFactory.CreateUserByID(Number(id));

            if (UserData != null) {
                setUserData(UserData);
            }
        }

        GetUserContent()
    }, [])

    if (!id) return null

    if( userData ) {
        console.log(userData)
    }
    return (
        <div className="ProfilePage">
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-12 col-lg-7'}>
                        <div className={'profile-intro'}>

                            {isOwnProfile ? (
                                <div
                                    className={'profile-image-wrap editable'}
                                    onClick={handleOpenPfPDrawer}
                                >
                                    <SynodImage
                                        imageId={userData?.GetProfileImageId() || 0}
                                        size="large"
                                        className="profile-image"
                                    />
                                </div>
                            ):(
                                <div className={'profile-image-wrap'}>
                                    <SynodImage
                                        imageId={userData?.GetProfileImageId() || 0}
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




                                {isOwnProfile ? (
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
                                    </>


                                ) : (
                                    // @TODO: add friend action
                                    <button className={'btn btn-primary'}>
                                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left"/>
                                        {'Add Friend'}
                                    </button>
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

            <button onClick={logout} className="btn btn-secondary mt-3">
                Log out
            </button>

            {isOwnProfile && (
                <>
                    <ProfileShareDrawer
                        userId={parseInt(id)}
                        show={showShareDrawer}
                        onClose={handleCloseShareDrawer}
                    />

                    {userData &&
                        <ProfileChangeProfilePictureDrawer
                            userData={userData}
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