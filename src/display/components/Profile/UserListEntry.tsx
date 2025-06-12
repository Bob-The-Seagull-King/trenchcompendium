/**
 * This is the entry for a user in user lists
 */

import React from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface UserListEntryProps {
    id: number
    username: string
    status: string
    pfp_url: string
    is_request?: boolean
    onAccept?: (userId: number) => void;
    onDecline?: (userId: number) => void;
}

const UserListEntry: React.FC<UserListEntryProps> = ({ id,
                                                         username,
                                                         status,
                                                         pfp_url,
                                                         is_request,
                                                         onAccept,
                                                         onDecline
}) => {

    const navigate = useNavigate();

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
                        <div className={'btn btn-primary btn-sm'} onClick={() => onAccept?.(id)}>
                            <FontAwesomeIcon icon={faCheck} className={'icon-inline-left-s'}/>
                            {'Accept'}
                        </div>

                        <div className={'btn btn-secondary btn-sm'} onClick={() => onDecline?.(id)}>
                            <FontAwesomeIcon icon={faTimes} className={'icon-inline-left-s'}/>
                            {'Decline'}
                        </div>

                    </div>
                }

            </div>
        </div>
    )
}

export default UserListEntry