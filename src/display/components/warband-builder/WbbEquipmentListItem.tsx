import React from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowUp,
    faCoins,
    faCopy,
    faEllipsisVertical,
    faTrash,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";

interface EquipmentItemProps {
    item: {
        Name: string;
        CostDucats: number;
        CostGlory: number;
        ModifiersString?: string;
        Id: string;
    };
}

const WbbEquipmentListItem: React.FC<EquipmentItemProps> = ({ item }) => {
    return (
        <div className="WbbEquipmentListItem">
            <div className="equipment-name">{item.Name}</div>
            <div className="equipment-cost">
                {item.CostDucats > 0 &&
                    <>
                        {item.CostDucats + " Ducats"}
                    </>
                }
                {item.CostGlory > 0 &&
                    <>
                        {item.CostGlory + "  Glory"}
                    </>
                }
            </div>

            <div className={'equipment-modifiers'}>
                {item.ModifiersString}
            </div>

            <WbbContextualPopover
                id={`equipment-${item.Id}`}
                type="equipment"
                item={item}
            />
        </div>
    );
};

export default WbbEquipmentListItem;
