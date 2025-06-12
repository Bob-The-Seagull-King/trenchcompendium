/**
 * This is the friends list in the profile view
 */

import React, { useEffect, useState } from 'react'
import SynodImage from "../../../utility/SynodImage";
import UserListEntry from "./UserListEntry";
import {SiteUserPublic} from "../../../classes/user_synod/user_public";
import {SiteUser} from "../../../classes/user_synod/site_user";
import {toast, ToastContainer} from "react-toastify";
import {UserFactory} from "../../../factories/synod/UserFactory";

interface ProfilePageFriendsProps {
    userData: SiteUser | SiteUserPublic;
}

function isSiteUser(user: SiteUser | SiteUserPublic): user is SiteUser {
    return 'Requests' in user;
}

const ProfilePageFriends: React.FC<ProfilePageFriendsProps> = ({ userData }) => {

    console.log('++ userData ++');
    console.log(userData);

    const friends = userData.Friends;
    const friendRequests = isSiteUser(userData) ? userData.Requests : [];

    /**
     * Accept a friend request
     * @param user_id
     */
    const handleAccept = async (user_id: number) => {
        if( isSiteUser(userData) ) {
            await userData.acceptFriendRequest(user_id); // accept the request
            toast.success('Friend request accepted')
        }
    }

    /**
     * Decline a friend request
     * @param user_id
     */
    const handleDecline = async (user_id: number) => {
        if( isSiteUser(userData) ) {
            await userData.declineFriendRequest(user_id);
            toast.success('Friend request declined')
        }
    }

    return (
        <div className="ProfilePageFriends">
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

            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Friends'}
                </div>

                <div className={'profile-card-content'}>
                    {friendRequests.length > 0 && (
                        <>
                            <div className={'friend-requests-headline'}>
                                {'New friend requests:'}
                            </div>

                            <ul className={'friends-list friends-list_requests'}>
                                {friendRequests.map((friend) => (
                                    <li key={friend.id} className={'friend'}>
                                        <UserListEntry
                                            id={friend.id}
                                            username={friend.nickname}
                                            status={friend.status}
                                            pfp_url={friend.profile_picture_url}
                                            is_request={true}
                                            onAccept={handleAccept}
                                            onDecline={handleDecline}
                                        />
                                    </li>
                                ))}
                            </ul>

                            <hr />
                        </>
                    )}

                    <ul className={'friends-list'}>
                        {friends.map((friend) => (
                            <li key={friend.id} className={'friend'}>
                                <UserListEntry
                                    id={friend.id}
                                    username={friend.nickname}
                                    status={friend.status}
                                    pfp_url={friend.profile_picture_url}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfilePageFriends