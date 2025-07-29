/**
 * On this page, any user can see a profile
 * - logged in users can change his profile here
 */


import React, {useCallback, useEffect, useRef, useState} from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../utility/AuthContext'
import SynodImage from "../../utility/SynodImage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCog, faDownload, faPen, faPlus, faQrcode} from "@fortawesome/free-solid-svg-icons";
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
import { SynodDataCache } from '../../classes/_high_level_controllers/SynodDataCache';
import SynodImageWithCredit from "../../utility/SynodImageWithCredits";

/**
 * On this page, any user can see a profile.
 * If it's their own profile, they get additional options.
 */

const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id?: string }>()
    const { isLoggedIn, userId, reloadIsLoggedIn } = useAuth()

    const { state } = useLocation();
    const fetchRequestId = useRef(0);
    
    /**
     * Handle Profile picture change
     */
    const navigate = useNavigate()

    if (Number.isNaN(Number(id))) {
        navigate('/', {state: Date.now().toString()})
    }

    /** Loading state when adding a friend via main button on stangers profiles */
    const [loadingAddFriend, setLoadingAddFriend] = useState(false)


    /** Share Drawer */
    const [showShareDrawer, setShowShareDrawer] = useState(false)
    const handleOpenShareDrawer = () => setShowShareDrawer(true)
    const handleCloseShareDrawer = () => setShowShareDrawer(false)

    /** Share Drawer */
    const [showPfPDrawer, setShowPfPDrawer] = useState(false)
    const handleOpenPfPDrawer = () => setShowPfPDrawer(true)
    const handleClosePfPDrawer = () => {
        setShowPfPDrawer(false)
        
        if (userId != null) {
            const userdatacache : SynodDataCache = SynodDataCache.getInstance();

            delete userdatacache.userObjectCache[userId]
            delete userdatacache.userDataCache[userId]
            delete userdatacache.callUserDataCache[userId]
        }
        navigate('', {state: Date.now().toString()})
    }


    /**
     * Get public user Data
     */
    const [userData, setUserData] = React.useState<SiteUser | SiteUserPublic | null>(null)
    const [keyvar, setkeyvar] = useState(0);

    const [isOwnProfile, setisOwnProfile] = useState(userData instanceof SiteUser)
    
    /** Get user Data function */
    async function fetchUserData() {
        reloadIsLoggedIn();
        if (!id) return;

        if (userId != null) {
            const userdatacache : SynodDataCache = SynodDataCache.getInstance();
            delete userdatacache.userObjectCache[userId];
            delete userdatacache.userDataCache[userId];
            delete userdatacache.callUserDataCache[userId];
        }

        setLoadingAddFriend(true);
        setIsLoadingFriendslist(true);

        const requestId = ++fetchRequestId.current;
        if (requestId !== fetchRequestId.current) return;
        let data: SiteUser | SiteUserPublic | null = null;

        if (isLoggedIn && Number(userId) === Number(id)) {
            const privateData = await UserFactory.CreatePrivateUserByID(Number(id));
            if (requestId !== fetchRequestId.current) return; // Abort if a newer request started
            if (privateData) {
            data = privateData;
            }
        }

        if (!data) {
            const publicData = await UserFactory.CreatePublicUserByID(Number(id));
            if (requestId !== fetchRequestId.current) return;
            if (publicData) {
            data = publicData;
            }
        }

        if (requestId === fetchRequestId.current) {
            setUserData(data);
            setisOwnProfile(data instanceof SiteUser)
            setkeyvar(prev => prev + 1); // Only once, after setting data
        }

        setLoadingAddFriend(false);
        setIsLoadingFriendslist(false);
    }

    useEffect(() => {
        fetchUserData();
    }, [userId, id, state]);

    useEffect(() => {
        if (isLoggedIn == true) {
            ++fetchRequestId.current;
            fetchUserData();
        }
    }, [isLoggedIn]);

    /** Is current profile user friend of current user */
    const [isFriend, setIsFriend] = useState<boolean | null>(null);
    useEffect(() => {
        async function checkFriendship() {
            if (userData && userId && 'IsUserFriend' in userData) {
                const result = await userData.IsUserFriend(userId);
                setIsFriend(result);
            }
        }

        checkFriendship();
    }, [userData, userId]);

    /** Does the current user have sent a friend request to this user? */
    const [hasReceivedRequest, setHasReceivedRequest] = useState<boolean | null>(null);
    useEffect(() => {
        async function checkFriendshipStatus() {
            if (userData && userId && ( userData.ID !== userId )) {

                if ('IsUserFriend' in userData && typeof userData.IsUserFriend === 'function') {
                    const isFriend = await userData.IsUserFriend(userId);
                    setIsFriend(isFriend);
                }

                if ('HasUserFriendRequestReceived' in userData && typeof userData.HasUserFriendRequestReceived === 'function') {
                    const hasRequest = await userData.HasUserFriendRequestReceived(userId);
                    setHasReceivedRequest(hasRequest);
                }
            }
        }

        checkFriendshipStatus();
    }, [userData, userId]);

    /**
     * Handle add friend via any button
     * - either via click on main button (no arg)
     * - or click in add Friends Modal (user id as arg)
     */
    const handleAddFriend =  async ( targetUserId?: number) => {

        if( !targetUserId ) {
            targetUserId = userData?.GetUserId();
        }

        try {
            setLoadingAddFriend(true);
            setIsLoadingFriendslist(true);

            const token = localStorage.getItem('jwtToken'); // You can refactor this to use a better auth system
            if (!token) throw new Error('User is not authenticated');

            const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/friends/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "target_user_id": targetUserId
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();

                toast.error('Friend request already sent.')

                setLoadingAddFriend(false);
                setIsLoadingFriendslist(false);
                setHasReceivedRequest(true);

                await fetchUserData();

                throw new Error(`Failed to request friend: ${errorText}`);
            }

            setLoadingAddFriend(false);
            setIsLoadingFriendslist(false);
            setHasReceivedRequest(true);
            toast.success('Friend request sent.')

            await fetchUserData();

        } catch (e) {
            //
        }
    }

    /** Loading state of friends list */
    const [isLoadingFriendslist, setIsLoadingFriendslist] = useState(false);

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
                                {(isOwnProfile) ? (
                                    <div
                                        className={'profile-image-wrap editable'}
                                        onClick={handleOpenPfPDrawer}
                                    >
                                        <SynodImageWithCredit
                                            imageId={userData?.GetProfilePictureImageId() || 0}
                                            size="large"
                                            className="profile-image"
                                        />

                                        <div className={'edit-indicator'}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </div>
                                    </div>
                                ):(
                                    <>
                                        {((userData instanceof SiteUserPublic) ) ? (
                                            <div className={'profile-image-wrap'}>
                                                <SynodImage
                                                    imageId={userData?.GetProfilePictureImageId() || 0}
                                                    size="large"
                                                    className="profile-image"
                                                />
                                            </div>
                                        ):(
                                            <div className={'profile-image-wrap'}>
                                                <SynodImage
                                                    imageId={0}
                                                    size="large"
                                                    className="profile-image"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            


                            <div className={'profile-intro-text'}>
                                <h1 className={'profile-name'}>
                                    {userData?.GetNickname() || 'Loading...'}
                                </h1>

                                <h2 className={'profile-sub'}>
                                    {userData?.GetUserStatus() || 'Loading...'}
                                </h2>

                                <div className={'user-interaction'}>
                                    {/* Is current users own profile */}
                                    {(isOwnProfile) ? (
                                        <>
                                            <CustomNavLink
                                                classes={'btn btn-primary btn-settings'}
                                                link={ '/profile/' + userData?.GetUserId() + '/settings' || `/profile/${id}/settings`}
                                                runfunc={() => {
                                                    navigate( '/profile/' + userData?.GetUserId() + '/settings' || `/profile/${id}/settings`)
                                                }}>
                                                <FontAwesomeIcon icon={faCog} className="icon-inline-left"/>
                                                {'Settings'}
                                            </CustomNavLink>

                                            <div className={'btn btn-secondary btn-qr'} onClick={handleOpenShareDrawer}>
                                                <FontAwesomeIcon
                                                    icon={faQrcode}
                                                />
                                            </div>
                                        </>


                                    ) : (
                                        <>
                                        {/* Logged in user */}
                                        {isLoggedIn &&
                                            <>
                                            {(loadingAddFriend) ? (
                                                // Loading state
                                                <>
                                                    <div className={'friend-indicator'}>
                                                        {'Loading'}
                                                    </div>
                                                </>
                                            ): (
                                                <>
                                                    {(isFriend) ? (
                                                        // IS friend
                                                        <div className={'friend-indicator'}>
                                                            <FontAwesomeIcon icon={faCheck} className="icon-inline-left"/>
                                                            {'Friend accepted'}
                                                        </div>
                                                    ): (
                                                        // is NOT friend
                                                        <>
                                                            {( hasReceivedRequest ) ? (
                                                                /* Friend request sent already  */
                                                                <div className={'friend-indicator'}>
                                                                    <FontAwesomeIcon
                                                                        icon={faCheck}
                                                                        className="icon-inline-left"/>
                                                                    {'Friend request sent'}
                                                                </div>
                                                            ) : (
                                                                /* Friend request NOT sent yet */
                                                                <button
                                                                    className={'btn btn-primary btn-add-friend'}
                                                                    onClick={() => handleAddFriend()}
                                                                >
                                                                    <FontAwesomeIcon icon={faPlus} className="icon-inline-left"/>
                                                                    {'Add Friend'}
                                                                </button>
                                                            )}
                                                        </>

                                                    )}
                                                </>
                                            )}
                                            </>
                                        }
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={'hide-lg-up'}>
                            <ProfilePageAchievements
                                userData={userData}
                            />

                            <ProfilePageFriends
                                key={keyvar}
                                userData={userData}
                                onAddFriend={handleAddFriend}
                                isLoading={isLoadingFriendslist}
                                reload={fetchUserData}
                            />
                        </div>

                        <ProfilePageWarbands
                            userData={userData}
                        />

                        <ProfilePageCampaigns
                            userData={userData}
                        />

                    </div>

                    <div className={'col-12 col-lg-5'}>
                        <div className={'hide-lg-down'}>
                            <ProfilePageAchievements
                                userData={userData}
                            />

                            <ProfilePageFriends
                                key={keyvar}
                                userData={userData}
                                onAddFriend={handleAddFriend}
                                isLoading={isLoadingFriendslist}
                                reload={fetchUserData}
                            />
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