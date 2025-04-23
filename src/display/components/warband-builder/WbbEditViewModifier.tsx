import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";

interface WbbEditViewModifierProps {
    warband: any;
    activePopoverId: string | null;
    setActivePopoverId: (id: string | null) => void;
    index: number;
}

const WbbEditViewModifier: React.FC<WbbEditViewModifierProps> = ({ warband, activePopoverId, setActivePopoverId, index }) => {

    // @TODO: Test Data
    const modifier = {
        Name: 'Moonshine Stash',
        Id: 'mo_moonshine_stash',
        Choice: 'Distribute',
        Description: ''
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const showPopover = activePopoverId === modifier.Id + index;
    const togglePopover = () => {
        setActivePopoverId(showPopover ? null : modifier.Id + index);
    };

    /**
     * @TODO
     * This copies the Modifier
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
     * Handles the confirmation to actually delete the modifier.
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
        <div className="WbbEditViewModifier">
            <div className={'modifier-title'}>
                <span className={'title-name'}>
                    {modifier.Name}
                </span>

                {/* @TODO: Add condition if choices need to be displayed */}
                {modifier.Choice &&
                    <span className={'title-choice'}>
                        {' - '}{modifier.Choice}
                    </span>
                }

                {/* actions */}
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
                                        {'Copy Modifier'}
                                    </div>

                                    <div
                                        className={'action action-delete'}
                                        onClick={handleDeleteClick}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Modifier'}
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
                                <strong>{'Modifier: '}</strong>
                                {modifier.Name}
                            </p>

                            <p>
                                Are you sure you want to delete this modifier? This action cannot be undone.
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
            </div>

            <div className={'modifier-body'}>
                {'During the next battle, your warband rolls Morale checks with +2 DICE. (Trench Pilgrims and New Antioch only)'}
            </div>
        </div>
    );
};

export default WbbEditViewModifier;