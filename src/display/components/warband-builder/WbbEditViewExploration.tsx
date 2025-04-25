import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbContextualPopover from "./WbbContextualPopover";

interface WbbEditViewExplorationProps {
    index: number;
}

const WbbEditViewExploration: React.FC<WbbEditViewExplorationProps> = ({ index }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    // @TODO: Test Data
    const exploration = {
        Name: 'Moonshine Stash',
        Id: 'ex_moonshine_stash',
        Choice: 'Distribute',
        LocationType: 'Common Location'
    };


    return (
        <div className="WbbEditViewExploration">
            <div className={'exploration-name'}>
                {exploration.Name}
            </div>

            <div className={'exploration-location'}>
                {exploration.LocationType}
            </div>

            {exploration.Choice &&
                <div className={'exploration-choice'}>
                    {'Choice: '}{exploration.Choice}
                </div>
            }

            {/* actions */}
            <WbbContextualPopover
                id={`exploration-${exploration.Id}`}
                type="exploration"
                item={exploration}
            />

        </div>
    );
};

export default WbbEditViewExploration;