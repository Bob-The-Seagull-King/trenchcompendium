import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import { RealWarbandPurchaseModel } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { useWarband } from '../../../context/WarbandContext';
import {useWbbMode} from "../../../context/WbbModeContext";


/**
 * The Fighter Element in the Warband builder
 * @constructor
 */

interface WbbEditViewFighterProps {
    item: RealWarbandPurchaseModel;
    index: number;
    onClick?: () => void;
    isActive?: boolean;
}
const WbbEditViewFighter: React.FC<WbbEditViewFighterProps> = ({ item, index, onClick, isActive }) => {

    const { warband } = useWarband();
    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    return (
        <div className={`WbbEditViewFighter ${isActive ? 'active' : ''} ${play_mode ? 'play-mode' : ''}`} onClick={onClick}>
            <div className={'model-name'}>
                {item.model.CurModel.GetName()}
            </div>
            <div className={'fighter-name'}>
                {item.model.GetFighterName()}
            </div>

            <div className={'cost-wrap'}>
                {item.purchase.GetTotalDucats() > 0 &&
                    <div className={'cost-ducats'}>{item.purchase.GetTotalDucats() + " Ducats"}</div>
                }
                {item.purchase.GetTotalGlory() > 0 &&
                    <div className={'cost-Glory'}>{item.purchase.GetTotalGlory() + " Glory"}</div>
                }
            </div>

            {edit_mode &&
                <WbbContextualPopover
                    id={`fighter-${warband? warband.warband_data.Models.indexOf(item.purchase) : 0}`}
                    type="fighter"
                    item={item}
                />
            }


            <div className={'equipment-summary'}>
                {item.model.GetEquipmentAsString()}
            </div>

        </div>
    );
};

export default WbbEditViewFighter;
