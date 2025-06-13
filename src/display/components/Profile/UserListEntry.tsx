/**
 * This is the entry for a user in user lists
 */

import React, {useState} from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {faCheck, faCircleNotch, faHourglassHalf, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface UserListEntryProps {
    id: number
    username: string
    status: string
    pfp_url: string
    is_request?: boolean
    onAccept?: (userId: number) => void;
    onDecline?: (userId: number) => void;
    is_search?: boolean;
    request_sent?: boolean;
    is_friend?: boolean;
    onAddFriend?: () => void;
}

const UserListEntry: React.FC<UserListEntryProps> = ({ id,
                                                         username,
                                                         status,
                                                         pfp_url,
                                                         is_request,
                                                         onAccept,
                                                         onDecline,
                                                         is_search,
                                                         request_sent,
                                                         is_friend,
                                                         onAddFriend
}) => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isRequestSent, setIsRequestSent] = useState(request_sent);

    const handleAddFriend = async () => {
        if (!onAddFriend) return;

        setIsLoading(true);
        try {
            await onAddFriend();
            setIsRequestSent(true);
        } catch (error) {
            console.error('Failed to send request:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const [isLoadingAccept, setIsLoadingAccept] = useState(false);
    const [isLoadingDecline, setIsLoadingDecline] = useState(false);
    const handleAccept = ( id: number ) => {
        setIsLoadingAccept(true)
        onAccept?.(id)
    }
    const handleDecline = ( id: number ) => {
        setIsLoadingDecline(true)
        onDecline?.(id)
    }

    return (
        <div className="UserListEntry">
            <CustomNavLink
                classes={'UserListEntry-image-wrap'}
                link={`/profile/${id}`}
                runfunc={() => {
                    navigate(`/profile/${id}`, {state: Date.now().toString()})
                }}>

                <img className={'UserListEntry-image'} src={pfp_url} />

            </CustomNavLink>

            <div className={'UserListEntry-text'}>
                <CustomNavLink
                    classes={'user-name'}
                    link={`/profile/${id}`}
                    runfunc={() => {
                        navigate(`/profile/${id}`, {state: Date.now().toString()})
                    }}>
                    {username}
                </CustomNavLink>

                <div className={'user-status'}>
                    {status}
                </div>

                { is_request &&
                    <div className={'request-actions'}>

                        {(isLoadingAccept) ? (
                            <div className={'btn btn-primary btn-sm'}>
                                <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left-s fa-spin'}/>
                                {'Accepting'}
                            </div>
                        ):(
                            <div className={'btn btn-primary btn-sm'} onClick={() => handleAccept(id)}>
                                <FontAwesomeIcon icon={faCheck} className={'icon-inline-left-s'}/>
                                {'Accept'}
                            </div>
                        )}

                        {(isLoadingDecline) ? (
                            <div className={'btn btn-secondary btn-sm'}>
                                <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left-s fa-spin'}/>
                                {'Declining'}
                            </div>
                        ) : (
                            <div className={'btn btn-secondary btn-sm'} onClick={() => handleDecline(id)}>
                                <FontAwesomeIcon icon={faTimes} className={'icon-inline-left-s'}/>
                                {'Decline'}
                            </div>
                        )}


                    </div>
                }

                { is_search &&
                    <div className={'search-actions'}>
                        { is_friend &&
                            <div className={'is-friend-indicator'}>
                                <FontAwesomeIcon icon={faCheck} className={''}/>
                            </div>
                        }

                        { isRequestSent &&
                            <div className={'request-sent-indicator'}>
                                <FontAwesomeIcon icon={faHourglassHalf} className={''}/>
                            </div>
                        }

                        {(!is_friend && !isRequestSent) &&
                            <>
                            {onAddFriend && (
                                <div
                                    className={'add-friend-btn'}
                                    onClick={handleAddFriend}
                                >
                                    {isLoading ? (
                                        <FontAwesomeIcon icon={faCircleNotch} className={' fa-spin'}/>
                                    ) : (
                                        <FontAwesomeIcon icon={faPlus} className={''}/>
                                    )}
                                </div>
                            )}
                            </>

                        }
                    </div>
                }

            </div>
        </div>
    )
}

export default UserListEntry