/**
 * This is the friends list in the profile view
 */

import React, { useEffect, useState } from 'react'
import SynodImage from "../../../utility/SynodImage";
import UserListEntry from "./UserListEntry";
import {SiteUserPublic} from "../../../classes/user_synod/user_public";
import {SiteUser} from "../../../classes/user_synod/site_user";

interface ProfilePageFriendsProps {
    userData: SiteUser | SiteUserPublic;
}

const ProfilePageFriends: React.FC<ProfilePageFriendsProps> = ({ userData }) => {

    // @TODO: Add friends list and friend request list

    console.log('++ userData ++');
    console.log(userData);

    const friends = userData.Friends;

    return (
        <div className="ProfilePageFriends">
            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Friends'}
                </div>

                <div className={'profile-card-content'}>
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