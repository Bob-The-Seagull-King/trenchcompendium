import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";


interface Advancement {
    Name: string,
    Description: string,
    Table: string,
    Id: string,
    Number: number
}

const WbbEditViewAdvancement: React.FC<{ advancement: Advancement }> = ({ advancement }) => {

    return (
        <div className="WbbEditViewAdvancement">
            <div className="advancement-title">
                <strong>{advancement.Name}</strong>
            </div>

            <div className="advancement-source">
                {advancement.Table + " #" + advancement.Number}
            </div>

            <div className="advancement-description">
                {advancement.Description}
            </div>

            {/* actions */}
            <WbbContextualPopover
                id={`advancement-${advancement.Id}`}
                type="advancement"
                item={advancement}
            />
        </div>
    );
};

export default WbbEditViewAdvancement;