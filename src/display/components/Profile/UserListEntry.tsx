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
}

const UserListEntry: React.FC<UserListEntryProps> = ({ id, username, status }) => {

    // @TODO: These are random image IDS -> Replace with user profile image IDs
    const imageIds = [171, 168, 172, 179]
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)]

    const navigate = useNavigate();
    
    return (
        <div className="UserListEntry">
            <CustomNavLink
                classes={'UserListEntry-image-wrap'}
                link={`/profile/${id}`}
                runfunc={() => {
                    navigate(`/profile/${id}`)
                }}>
                <SynodImage
                    imageId={randomId}
                    className={'UserListEntry-image'}
                />
            </CustomNavLink>

            <div className={'UserListEntry-text'}>
                <CustomNavLink
                    classes={'user-name'}
                    link={`/profile/${id}`}
                    runfunc={() => {
                        navigate(`/profile/${id}`)
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