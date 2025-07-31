import React, {useEffect, useState} from 'react';
import { SiteUserPublic } from '../../../classes/user_synod/user_public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {SumWarband} from "../../../classes/saveitems/Warband/WarbandManager";
import {useWarband} from "../../../context/WarbandContext";
import {useWbbMode} from "../../../context/WbbModeContext";
import UserListEntry from "../Profile/UserListEntry";



const WbbUserinfo: React.FC = () => {

    const { warband, updateKey } = useWarband();
    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    // if( warband?.warband_data.getUser() ){
    //
    // }


    return (
        <>
            {/*{view_mode &&*/}
            {/*    <div className="WbbUserinfo">*/}
            {/*        <UserListEntry*/}
            {/*            friend_obj={friend}*/}
            {/*            is_request={true}*/}
            {/*            onAccept={handleAccept}*/}
            {/*            onDecline={handleDecline}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*}*/}
        </>

    );
};

export default WbbUserinfo;