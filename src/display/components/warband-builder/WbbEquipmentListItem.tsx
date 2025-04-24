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

            <div className={'actions'}>
                <OverlayTrigger
                    trigger="click"
                    placement="left"
                    rootClose={true}
                    overlay={
                        <Popover.Body className="popover Wbb-item-actions-popover">
                            <div className={'actions'}>

                                {/* @TODO: Move to stash */}
                                <div
                                    className={'action action-move-to-stash'}
                                >
                                    <FontAwesomeIcon icon={faArrowUp} className="icon-inline-left-l"/>
                                    {'Move to Stash'}
                                </div>


                                {/* @TODO: Move to fighter */}
                                <div
                                    className={'action action-move-to-fighter'}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="icon-inline-left-l"/>
                                    {'Move to Fighter'}
                                </div>

                                {/* @TODO: Sell item */}
                                <div
                                    className={'action action-sell'}
                                >
                                    <FontAwesomeIcon icon={faCoins} className="icon-inline-left-l"/>
                                    {'Sell Item'}
                                </div>

                                {/* @TODO: Copy Item*/}
                                <div
                                    className={'action action-copy'}
                                >
                                    <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l"/>
                                    {'Copy Item'}
                                </div>

                                {/* @TODO: Delete Item */}
                                <div
                                    className={'action action-delete'}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                    {'Delete  Item'}
                                </div>
                            </div>
                        </Popover.Body>
                    }>
                    <div className={'Wbb-item-actions'}
                         onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon icon={faEllipsisVertical} className=""/>
                    </div>
                </OverlayTrigger>
            </div>
        </div>
    );
};

export default WbbEquipmentListItem;
