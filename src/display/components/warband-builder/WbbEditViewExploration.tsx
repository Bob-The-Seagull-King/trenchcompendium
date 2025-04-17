import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";

interface WbbEditViewExplorationProps {
    warband: any;
    activePopoverId: string | null;
    setActivePopoverId: (id: string | null) => void;
    index: number;
}

const WbbEditViewExploration: React.FC<WbbEditViewExplorationProps> = ({ warband, activePopoverId, setActivePopoverId, index }) => {

    // @TODO: Test Data
    const exploration = {
        Name: 'Moonshine Stash',
        Id: 'ex_moonshine_stash',
        Choice: 'Distribute',
        LocationType: 'Common Location'
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const showPopover = activePopoverId === exploration.Id + index;
    const togglePopover = () => {
        setActivePopoverId(showPopover ? null : exploration.Id + index);
    };

    /**
     * @TODO
     * This copies the Exploration Item
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
     * Handles the confirmation to actually delete the Exploration Item
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
        <div className="WbbEditViewExploration">
            <div className={'exploration-name'}>
                {exploration.Name}
            </div>

            <div className={'exploration-location'}>
                {exploration.LocationType}
            </div>

            {exploration.Choice &&
                <div className={'exploration-choice'}>
                    {'Choice: '}{exploration.Choice}
                </div>
            }

            <div className={'actions'}>
                <OverlayTrigger
                    trigger="click"
                    placement="left"
                    show={showPopover}
                    onToggle={togglePopover}
                    rootClose={true}
                    overlay={
                        <Popover.Body className="popover Wbb-item-actions-popover">
                            <div className='title'>
                                {'Actions'}
                            </div>

                            <div className={'actions'}>
                                <div
                                    className={'action action-copy'}
                                    onClick={handleCopy}
                                >
                                    <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l"/>
                                    {'Copy Exploration Location'}
                                </div>

                                <div
                                    className={'action action-delete'}
                                    onClick={handleDeleteClick}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                    {'Delete Exploration Location'}
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
                            <strong>{'Exploration Location: '}</strong>
                            {exploration.Name}
                        </p>

                        <p>
                            Are you sure you want to delete this exploration location? This action cannot be undone.
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
    );
};

export default WbbEditViewExploration;