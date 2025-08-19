import React from "react";
import {useWarband} from "../../../context/WarbandContext";

interface WbbEditViewCampaignProps {
    onClick?: () => void;
    isActive?: boolean;
}

const WbbEditViewExplorationLocations: React.FC<WbbEditViewCampaignProps> = ({
                                                                     onClick,
                                                                     isActive
                                                                 }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);


    return (
        <div className={`WbbEditViewExplorationLocations warband-meta ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className={'meta-headline'}>{'Exploration'}</div>

            {/*<div className="meta-item">*/}
            {/*    <strong>*/}
            {/*        {'Unlocked Locations: ' + 2}*/}
            {/*    </strong>*/}
            {/*</div>*/}
        </div>
    );
};

export default WbbEditViewExplorationLocations;