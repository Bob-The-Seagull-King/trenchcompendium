import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { Skill } from '../../../classes/feature/ability/Skill';
import { returnDescription } from '../../../utility/util';

const WbbEditViewAdvancement: React.FC<{ advancement: WarbandProperty }> = ({ advancement }) => {

    const { playMode } = usePlayMode();
    
    const SelfSkill : Skill = advancement.SelfDynamicProperty.OptionChoice as Skill;


    return (

        <div className={`WbbEditViewAdvancement ${playMode ? 'play-mode' : ''}`}>
            <div className="advancement-title">
                <strong>{advancement.Name}</strong>
            </div>

            <div className="advancement-description">
                {returnDescription(SelfSkill, SelfSkill.Description)}
            </div>

            {/* actions */}
            { !playMode &&
                <WbbContextualPopover
                    id={`advancement-${advancement.ID}`}
                    type="advancement"
                    item={advancement}
                />
            }

        </div>
    );
};

export default WbbEditViewAdvancement;