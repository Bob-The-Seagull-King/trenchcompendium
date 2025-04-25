import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";


interface Advancement {
    Name: string,
    Description: string,
    Table: string,
    Id: string,
    Number: number
}

const WbbEditViewAdvancement: React.FC<{ advancement: Advancement }> = ({ advancement }) => {

    const { playMode } = usePlayMode();

    return (

        <div className={`WbbEditViewAdvancement ${playMode ? 'play-mode' : ''}`}>
            <div className="advancement-title">
                <strong>{advancement.Name}</strong>
            </div>

            { !playMode &&
                <div className="advancement-source">
                    {advancement.Table + " #" + advancement.Number}
                </div>
            }

            <div className="advancement-description">
                {advancement.Description}
            </div>

            {/* actions */}
            { !playMode &&
                <WbbContextualPopover
                    id={`advancement-${advancement.Id}`}
                    type="advancement"
                    item={advancement}
                />
            }

        </div>
    );
};

export default WbbEditViewAdvancement;