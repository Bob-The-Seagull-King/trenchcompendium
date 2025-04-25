import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbContextualPopover from "./WbbContextualPopover";

interface WbbEditViewModifierProps {
    index: number;
}

const WbbEditViewModifier: React.FC<WbbEditViewModifierProps> = ({ index }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    // @TODO: Test Data
    const modifier = {
        Name: 'Moonshine Stash',
        Id: 'mo_moonshine_stash',
        Choice: 'Distribute',
        Description: ''
    };

    return (
        <div className="WbbEditViewModifier">
            <div className={'modifier-title'}>
                <span className={'title-name'}>
                    {modifier.Name}
                </span>

                {/* @TODO: Add condition if choices need to be displayed */}
                {modifier.Choice &&
                    <span className={'title-choice'}>
                        {' - '}{modifier.Choice}
                    </span>
                }

                {/* actions */}
                <WbbContextualPopover
                    id={`modifier-${modifier.Id}`}
                    type="modifier"
                    item={modifier}
                />
            </div>

            <div className={'modifier-body'}>
                {'During the next battle, your warband rolls Morale checks with +2 DICE. (Trench Pilgrims and New Antioch only)'}
            </div>
        </div>
    );
};

export default WbbEditViewModifier;