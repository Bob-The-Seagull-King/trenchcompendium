import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";


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
    };
    activePopoverId: string | null;
    setActivePopoverId: (id: string | null) => void;
    index: number;
    onClick?: () => void;
    isActive?: boolean;
}
const WbbEditViewFighter: React.FC<WbbEditViewFighterProps> = ({ item, activePopoverId, setActivePopoverId, index, onClick, isActive }) => {

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const showPopover = activePopoverId === item.ModelId + index;
    const togglePopover = () => {
        setActivePopoverId(showPopover ? null : item.ModelId + index);
    };

    /**
     * @TODO
     * This copies the fighter
     */
    const handleCopy = () => {
        setActivePopoverId(null);
        alert('copy this item');

        return true;
    };

    /**
     * Opens the delete confirmation modal
     */
    const handleDeleteClick = () => {
        setActivePopoverId(null);
        setShowDeleteConfirm(true);
    };

    /**
     * @TODO:
     * Handles the confirmation to actually delete the fighter.
     */
    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        alert('item deleted (backend hook here)');
    };

    /**
     * Closes the confirmation modal
     */
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

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

            <div className={'actions'}>
                <OverlayTrigger
                    trigger="click"
                    placement="left"
                    show={showPopover}
                    onToggle={togglePopover}
                    rootClose={true}
                    overlay={
                        <Popover.Body className="popover Wbb-item-actions-popover">
                            <div className={'actions'}>
                                <div
                                    className={'action action-copy'}
                                    onClick={handleCopy}
                                >
                                    <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l"/>
                                    {'Copy Fighter'}
                                </div>

                                <div
                                    className={'action action-delete'}
                                    onClick={handleDeleteClick}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                    {'Delete Fighter'}
                                </div>
                            </div>
                        </Popover.Body>
                    }>
                    <div className={'Wbb-item-actions'}
                         onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon icon={faEllipsisVertical} className=""/>
                    </div>
                </OverlayTrigger>

                <Modal show={showDeleteConfirm} onHide={handleCancelDelete} centered>
                    <Modal.Header
                        closeButton={false}
                    >
                        <Modal.Title>Delete Fighter</Modal.Title>

                        <FontAwesomeIcon
                            icon={faXmark}
                            className="modal-close-icon"
                            role="button"
                            onClick={handleCancelDelete}
                        />
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            <strong>{'Fighter Name: '}</strong>
                            {item.ModelName + " " + item.FighterName}
                        </p>

                        <p>
                            Are you sure you want to delete this fighter? This action cannot be undone.
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancelDelete}>
                            Cancel
                        </Button>

                        <Button variant="primary" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className={'equipment-summary'}>
            {/*  @TODO: generate a string with equipment starting with weapons, armor and equipment  */}
                {'Jezzail, Trench Knife, Standard Armour, Alchemical Ammunition'}
            </div>

        </div>
    );
};

export default WbbEditViewFighter;
