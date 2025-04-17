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
import { WarbandManager } from '../../../classes/saveitems/Warband/WarbandManager';
import WarbandItemViewDisplay from '../features/saveitem/Warband/WarbandItemViewDisplay';

interface WbbEditViewProps {
    warbandData: UserWarband | null;
    manager : WarbandManager
}



const WbbEditView = (props : WbbEditViewProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [keyval, setKeyVal] = useState(0);

    function UpdateManagerState(item : UserWarband) {
        props.manager.SetStorage();
        setKeyVal((prev) => (prev + 1))
    }

    return (
        <div className="WbbEditView" key={keyval}>
            {props.warbandData != null &&
            <>
                {props.warbandData.Name};
                
                <WarbandItemViewDisplay 
                    manager={props.manager}
                    data={props.warbandData}
                    updater={UpdateManagerState}
                />
            </>
            }
        </div>
    );
};

export default WbbEditView;