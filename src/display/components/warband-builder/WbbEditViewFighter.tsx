import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";
import { RealWarbandPurchaseModel } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { useWarband } from '../../../context/WarbandContext';


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

    const { playMode } = usePlayMode();
    const { warband } = useWarband();

    return (
        <div className={`WbbEditViewFighter ${isActive ? 'active' : ''} ${playMode ? 'play-mode' : ''}`} onClick={onClick}>
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

            {!playMode &&
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
