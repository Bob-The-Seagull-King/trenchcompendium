import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";


/**
 * The Fighter Element in the Warband builder
 * @constructor
 */

interface WbbEditViewFighterProps {
    item: {
        FighterName: string;
        ModelName: string;
        Slug: string;
        FighterBaseDucats: number;
        FighterBaseGlory: number;
        FighterTotalCostDucats: number;
        FighterTotalCostGlory: number;
        IsElite: boolean;
        IsMercenary: boolean;
        ExperiencePoints: number;
        BattleScars: number;
        Injuries: any;
        Advancements: any;
        Equipment: any;
        FighterIndex: number;
    };
    index: number;
    onClick?: () => void;
    isActive?: boolean;
}
const WbbEditViewFighter: React.FC<WbbEditViewFighterProps> = ({ item, index, onClick, isActive }) => {

    const { playMode } = usePlayMode();

    return (
        <div className={`WbbEditViewFighter ${isActive ? 'active' : ''} ${playMode ? 'play-mode' : ''}`} onClick={onClick}>
            <div className={'model-name'}>
                {item.ModelName}
            </div>
            <div className={'fighter-name'}>
                {item.FighterName}
            </div>

            <div className={'cost-wrap'}>
                {item.FighterTotalCostDucats > 0 &&
                    <div className={'cost-ducats'}>{item.FighterTotalCostDucats + " Ducats"}</div>
                }
                {item.FighterTotalCostGlory > 0 &&
                    <div className={'cost-Glory'}>{item.FighterTotalCostGlory + " Glory"}</div>
                }
            </div>

            {!playMode &&
                <WbbContextualPopover
                    id={`fighter-${item.FighterIndex}`}
                    type="fighter"
                    item={item}
                />
            }


            <div className={'equipment-summary'}>
                {/*  @TODO: generate a string with equipment starting with weapons, armor and equipment  */}
                {'Jezzail, Trench Knife, Standard Armour, Alchemical Ammunition'}
            </div>

        </div>
    );
};

export default WbbEditViewFighter;
