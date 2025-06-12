/**
 * This is the entry for a user in user lists
 */

import React from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";

interface UserListEntryProps {
    id: number
    username: string
    status: string
    pfp_url: string
}

const UserListEntry: React.FC<UserListEntryProps> = ({ id, username, status, pfp_url }) => {

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
            </div>
        </div>
    )
}

export default UserListEntry