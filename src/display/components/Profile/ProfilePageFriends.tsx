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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal} from "react-bootstrap";
import {SYNOD} from "../../../resources/api-constants";
import LoadingOverlay from "../generics/Loading-Overlay";

interface ProfilePageFriendsProps {
    userData: SiteUser | SiteUserPublic | null;
    onAddFriend: (friendId: number) => void;
    isLoading: boolean;
    reload: () => void;
}

// For search results in the find friends modal
export interface SiteUserSearchResult {
    id: number;
    nickname: string;
    profile_picture_url: string;
    status: string;
    request_sent: boolean;
    is_friend: boolean;
}

function isSiteUser(user: SiteUser | SiteUserPublic): user is SiteUser {
    return 'Requests' in user;
}

const ProfilePageFriends: React.FC<ProfilePageFriendsProps> = ({
                                                                   userData,
                                                                   onAddFriend,
                                                                   isLoading,
                                                                   reload
}) => {


    const [friends, setfriends] = useState<SiteUserPublic[] | null>(null)
    const [friendRequests, setfriendRequests] = useState<SiteUserPublic[] | null>(null)
    const [alertvar, setalertvar] = useState(0)

    useEffect(() => {
        async function RunFriendsGet() {
            if (userData != null) {
                await userData.BuildFriends();
                setfriends(userData.BuiltFriends)
                if (userData instanceof SiteUser) {
                    await userData.BuildRequests();
                    setfriendRequests(userData.BuiltRequests)
                }
            }

        }
        RunFriendsGet()
    }, [userData])

    useEffect(() => {
        async function RunFriendsGetNew() {
            if (userData != null) {
                await userData.ReBuildFriends();
                setfriends(userData.BuiltFriends)
                if (userData instanceof SiteUser) {
                    await userData.ReBuildRequests();
                    setfriendRequests(userData.BuiltRequests)
                }
            }

        }
        RunFriendsGetNew()
    }, [alertvar])

    /**
     * Accept a friend request
     * @param user_id
     */
    const handleAccept = async (user_id: number) => {
        if (userData != null) {
            if( isSiteUser(userData) ) {
                await userData.acceptFriendRequest(user_id); // accept the request
                setalertvar(alertvar + 1)
                toast.success('Friend request accepted')
            }
        }

        console.log('handleAccept finished');
        reload();
    }

    /**
     * Decline a friend request
     * @param user_id
     */
    const handleDecline = async (user_id: number) => {
        if (userData != null) {
            if( isSiteUser(userData) ) {
                await userData.declineFriendRequest(user_id);
                setalertvar(alertvar + 1)
                toast.success('Friend request declined')
            }
        }

        console.log('handleDecline finished');

        reload();
    }

    const handleRemoveFriend = async ( user_id: number) => {
        if (userData != null) {
            if( userData instanceof SiteUser ) {
                await userData.removeFriend(user_id);
                setalertvar(alertvar + 1)
                toast.success('Friend removed')
            }
        }

        reload();
    }

    /**
     * Search friends functionality
     */
    // open modal state
    const [showAddFriendsModal, setShowAddFriendsModal] = useState<boolean>(false);

    // Friend search
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SiteUserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setIsSearching(true);
        setError(null);

        if( searchTerm == '' ) {
            setError('Please enter a name');
            setSearchResults([]);
            setIsSearching(false);

            return;
        }


        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch(`${SYNOD.URL}/wp-json/synod/v1/user-search?query=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!res.ok) throw new Error('Search failed');
            const data = await res.json();

            setSearchResults(data); // Assuming API returns SiteUserPublic[]
        } catch (e) {
            setError('Could not find any users for your query.');
            setSearchResults([]);
        }

        setIsSearching(false);
    };



    /**
     * Loading state
     */
    if (isLoading || !userData ) {
        return (
            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Friends'}
                </div>

                <div className={'profile-card-content'}>
                    <div className={'profile-card-loading'}>

                        <LoadingOverlay
                            message={'Loading friends'}
                        />
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="ProfilePageFriends">


            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Friends'}

                    <div
                        className={'profile-card-head-action'}
                        onClick={() => setShowAddFriendsModal(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} className=""/>
                    </div>
                </div>

                <div className={'profile-card-content'}>
                    {/* Friend Requests*/}
                    {friendRequests != null &&
                        <>
                        {friendRequests.length > 0 && (
                            <>
                                <div className={'friend-requests-headline'}>
                                    {'New friend requests:'}
                                </div>

                                <ul className={'friends-list friends-list_requests'}>
                                    {friendRequests.map((friend) => (
                                        <li key={friend.ID} className={'friend'}>
                                            <UserListEntry
                                                friend_obj={friend}
                                                is_request={true}
                                                onAccept={handleAccept}
                                                onDecline={handleDecline}
                                            />
                                        </li>
                                    ))}
                                </ul>

                                <hr />
                            </>
                        )}</>
                    }

                    {/* Friends */}
                    {friends != null &&
                        <>
                    {friends.length > 0 ? (
                        <ul className={'friends-list'}>

                            {friends.map((friend) => (
                                <li key={friend.ID} className={'friend'}>
                                    <UserListEntry
                                        friend_obj={friend}
                                        onRemoveFriend={handleRemoveFriend}
                                        canremove={userData instanceof SiteUser}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="friends-list-empty">
                            {'No friends connected'}
                        </div>
                    )}</>}

                    {friends == null &&
                        
                    <div className={'profile-card-content'}>
                        <div className={'profile-card-loading'}>

                            <LoadingOverlay
                                message={'Loading friends'}
                            />
                        </div>
                    </div>
                    }


                </div>
            </div>

            {/* Add friends Modal*/}
            <Modal show={showAddFriendsModal} onHide={() => setShowAddFriendsModal(false)} className="ProfileAddFriendsModal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{'Add Friends'}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setShowAddFriendsModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <form className={'mb-3'}
                          onSubmit={(e) => {
                              e.preventDefault();
                              handleSearch();
                          }}
                    >
                        <label htmlFor={'modal_search_friends'} className={'mb-1'}>
                            {'Username'}
                        </label>

                        <input
                            id={'modal_search_friends'}
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button className="btn btn-primary" type={'submit'} disabled={isSearching}>
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </form>


                    {error && <div className="alert alert-warning">{error}</div>}

                    {(searchResults.length > 0) ? (
                        <ul className="friends-list">
                            {searchResults.map(user => (
                                <li key={user.id} className={'friend'}>
                                    <UserListEntry
                                        friend_obj={user}
                                        is_search={true}
                                        request_sent={user.request_sent}
                                        is_friend={user.is_friend}
                                        onAddFriend={() => onAddFriend(user.id)}
                                    />

                                </li>
                            ))}
                        </ul>
                    ): (
                        <>
                            {(!error && !isSearching) &&
                                <div className="alert alert-info">{'Enter the name of your friend above'}</div>
                            }
                        </>
                    )}


                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ProfilePageFriends