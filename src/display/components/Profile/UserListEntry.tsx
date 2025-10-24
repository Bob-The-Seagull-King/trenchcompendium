/**
 * This is the entry for a user in user lists
 */

import React, {useState} from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {
    faCheck,
    faCircleNotch,
    faCopy, faEllipsisVertical,
    faHourglassHalf,
    faPlus,
    faTimes,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {OverlayTrigger, Popover} from "react-bootstrap";
import { SiteUserPublic } from '../../../classes/user_synod/user_public';
import { SiteUserSearchResult } from './ProfilePageFriends';
import ImageCredits from "../../../utility/ImageCredits";

interface UserListEntryProps {
    friend_obj: SiteUserPublic | SiteUserSearchResult
    is_request?: boolean
    onAccept?: (userId: number) => void;
    onDecline?: (userId: number) => void;
    canremove?: boolean;
    is_search?: boolean;
    request_sent?: boolean;
    is_friend?: boolean;
    onAddFriend?: () => void;
    onRemoveFriend?: (userId: number) => void;
}

const UserListEntry: React.FC<UserListEntryProps> = ({ friend_obj,
                                                         is_request,
                                                         onAccept,
                                                         onDecline,
                                                         is_search,
                                                         canremove = false,
                                                         request_sent,
                                                         is_friend,
                                                         onAddFriend,
                                                         onRemoveFriend
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

    // show options popover
    const [showPopover, setShowPopover] = useState(false);

    /**
     * Delete a friend
     */
    const handleRemoveClick = ( id: number ) => {
        setShowPopover(false)

        onRemoveFriend?.(id)
    };

    // Set values
    let ID = 0;
    let Pfp_Url = "";
    let Pfp_Cred_Title = "";
    let Pfp_Cred_URL = "";
    let Name = "";
    let Status = "";

    if (friend_obj instanceof SiteUserPublic) {
        ID = friend_obj.ID;
        Pfp_Url = friend_obj.ProfilePic.urls["medium"];
        Pfp_Cred_Title = friend_obj.ProfilePic.source_title;
        Pfp_Cred_URL = friend_obj.ProfilePic.source_url;
        Name = friend_obj.GetNickname();
        Status = friend_obj.GetUserStatus();
    } else {
        ID = friend_obj.id;
        Pfp_Url = friend_obj.profile_picture_url;
        Name = friend_obj.nickname;
        Status = friend_obj.status;
    }

    return (
        <div className="UserListEntry">
            <CustomNavLink
                classes={'UserListEntry-image-wrap'}
                link={`/profile/${ID}`}
                runfunc={() => {
                    navigate(`/profile/${ID}`, {state: Date.now().toString()})
                }}>

                { (Pfp_Cred_Title && Pfp_Cred_URL) &&
                    <ImageCredits
                        sourceTitle={Pfp_Cred_Title}
                        sourceUrl={Pfp_Cred_URL}
                        popoverSlug={Pfp_Url+ID}
                    />
                }
                <img className={'UserListEntry-image'} src={Pfp_Url} />

            </CustomNavLink>

            <div className={'UserListEntry-text'}>
                <CustomNavLink
                    classes={'user-name'}
                    link={`/profile/${ID}`}
                    runfunc={() => {
                        navigate(`/profile/${ID}`, {state: Date.now().toString()})
                    }}>
                    {Name}
                </CustomNavLink>

                <div className={'user-status'}>
                    {Status}
                </div>

                { (!is_request && !is_search && canremove) &&
                    <OverlayTrigger
                        trigger="click"
                        placement="left"
                        show={showPopover}
                        onToggle={() => setShowPopover(!showPopover)}
                        rootClose={true} // closes when clicking outside
                        overlay={
                        <Popover>
                            <Popover.Body className="popover UserListEntry-options-popover">
                                <div className={'actions'}>
                                    <div
                                        className={'action action-delete'}
                                        onClick={() => handleRemoveClick(ID)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Remove Friend'}
                                    </div>
                                </div>
                            </Popover.Body>
                        </Popover>
                        }>
                        <div className={'UserListEntry-actions'}
                             onClick={(e) => e.stopPropagation()}>
                            <FontAwesomeIcon icon={faEllipsisVertical} className=""/>
                        </div>
                    </OverlayTrigger>
                }

                { is_request &&
                    <div className={'request-actions'}>

                        {(isLoadingAccept) ? (
                            <div className={'btn btn-primary btn-sm'}>
                                <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left-s fa-spin'}/>
                                {'Accepting'}
                            </div>
                        ):(
                            <div className={'btn btn-primary btn-sm'} onClick={() => handleAccept(ID)}>
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
                            <div className={'btn btn-secondary btn-sm'} onClick={() => handleDecline(ID)}>
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