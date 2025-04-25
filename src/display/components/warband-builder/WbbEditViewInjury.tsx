import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";

interface Injury {
    Name: string,
    Description: string,
    Table: string,
    Id: string,
    Number: number
}

const WbbEditViewInjury: React.FC<{ injury: Injury }> = ({ injury }) => {

    const { playMode } = usePlayMode();

    return (
        <div className={`WbbEditViewInjury ${playMode ? 'play-mode' : ''}`}>
            <div className="injury-title">
                <strong>{injury.Name}</strong>
            </div>

            {!playMode &&
                <div className="injury-source">
                    {injury.Table + " #" + injury.Number}
                </div>
            }

            <div className="injury-description">
                {injury.Description}
            </div>

            {!playMode &&
                <WbbContextualPopover
                    id={`injury-${injury.Id}`}
                    type="injury"
                    item={injury}
                />
            }
        </div>
    );
};

export default WbbEditViewInjury;