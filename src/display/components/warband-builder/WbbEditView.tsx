import React, { useEffect, useState } from 'react';
import { UserWarband, IUserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import WbbWarbandListItem from "./WbbWarbandListItem";
import WbbEditViewFighter from "./WbbEditViewFighter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faPlus} from "@fortawesome/free-solid-svg-icons";
import WbbEditViewStash from "./WbbEditViewStash";
import WbbEditViewModifier from "./WbbEditViewModifier";
import WbbEditViewExploration from "./WbbEditViewExploration";
import WbbFighterDetailView from "./WbbFighterDetailView";
import { useNavigate, useLocation } from 'react-router-dom';

interface WbbEditViewProps {
    warbandData: UserWarband | null;
}



const WbbEditView = (props : WbbEditViewProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="WbbEditView">
            {props.warbandData != null &&
            <>
                {props.warbandData.Name};
            </>
            }
        </div>
    );
};

export default WbbEditView;