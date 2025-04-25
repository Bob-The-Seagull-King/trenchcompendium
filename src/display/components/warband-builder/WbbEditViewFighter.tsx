import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";


/**
 * The Fighter Element in the Warband builder
 * @constructor
 */

interface WbbEditViewFighterProps {
    item: {
        FighterName: string;
        ModelName: string;
        ModelId: string;
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

    // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    //
    // const showPopover = activePopoverId === item.ModelId + index;
    // const togglePopover = () => {
    //     setActivePopoverId(showPopover ? null : item.ModelId + index);
    // };
    //
    // /**
    //  * @TODO
    //  * This copies the fighter
    //  */
    // const handleCopy = () => {
    //     setActivePopoverId(null);
    //     alert('copy this item');
    //
    //     return true;
    // };
    //
    // /**
    //  * Opens the delete confirmation modal
    //  */
    // const handleDeleteClick = () => {
    //     setActivePopoverId(null);
    //     setShowDeleteConfirm(true);
    // };
    //
    // /**
    //  * @TODO:
    //  * Handles the confirmation to actually delete the fighter.
    //  */
    // const handleConfirmDelete = () => {
    //     setShowDeleteConfirm(false);
    //     alert('item deleted (backend hook here)');
    // };
    //
    // /**
    //  * Closes the confirmation modal
    //  */
    // const handleCancelDelete = () => {
    //     setShowDeleteConfirm(false);
    // };

    return (
        <div className={`WbbEditViewFighter ${isActive ? 'active' : ''}`} onClick={onClick}>
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

            <WbbContextualPopover
                id={`fighter-${item.FighterIndex}`}
                type="fighter"
                item={item}
            />

            <div className={'equipment-summary'}>
            {/*  @TODO: generate a string with equipment starting with weapons, armor and equipment  */}
                {'Jezzail, Trench Knife, Standard Armour, Alchemical Ammunition'}
            </div>

        </div>
    );
};

export default WbbEditViewFighter;
