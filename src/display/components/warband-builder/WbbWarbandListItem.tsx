import React, { useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen, faCopy, faEllipsisVertical, faPen, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


/**
 * This is a list item of a warband for the WBB overview page.
 * - It shows the name and infor about the warband
 * - Lets the user navigate to the edit screen for this warband
 * - show basic interactions like "rename" and "delete"
 *
 * @constructor
 */

interface WbbWarbandListItemProps {
    item: {
        name: string;
        synod_id: number;
        faction_id: string;
        faction_name: string;
        value_ducats: number;
        value_glory: number;
        campaign_id?: number;
        campaign_name?: string;
    };
}
const WbbWarbandListItem: React.FC<WbbWarbandListItemProps> = ({ item }) => {
    const navigate = useNavigate();
    const [showPopover, setShowPopover] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    /**
     * @TODO
     * This copies this warband
     */
    const handleCopy = () => {
        setShowPopover(false);
        alert('copy this item');

        return true;
    };

    /**
     * Opens the delete confirmation modal
     */
    const handleDeleteClick = () => {
        setShowPopover(false);
        setShowDeleteConfirm(true);
    };

    /**
     * Opens the delete confirmation modal
     */
    const handleEditClick = () => {
        navigate('/warband/edit/' + item.synod_id);
    };

    /**
     * @TODO:
     * Handles the confirmation to actually delete the warband.
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
        <div className={'col-12 col-md-6'}>
            <div className={'WbbWarbandListItem'}>
                <div className={'item-name'}>
                    {item.name}
                </div>

                <div className={'item-faction'}>
                    {item.faction_name}
                </div>

                <div className={'item-cost'}>
                    {item.value_ducats + " Ducats" + " | " + item.value_glory + " Glory" }
                </div>

                <div className={'item-campaign'}>
                    {item.campaign_name
                        ? item.campaign_name
                        : "No Campaign"
                    }
                </div>

                <OverlayTrigger
                    trigger="click"
                    placement="left"
                    show={showPopover}
                    onToggle={() => setShowPopover(!showPopover)}
                    rootClose={true} // closes when clicking outside
                    overlay={
                        <Popover.Body className="popover Wbb-item-actions-popover">
                            <div className='title'>
                                {'Actions'}
                            </div>
                            <div className={'actions'}>

                                <div
                                    className={'action action-delete'}
                                    onClick={handleEditClick}
                                >
                                    <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                                    {'Edit Warband'}
                                </div>

                                <div
                                    className={'action action-copy'}
                                    onClick={handleCopy}
                                >
                                    <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l"/>
                                    {'Copy Warband'}
                                </div>

                                <div
                                    className={'action action-delete'}
                                    onClick={handleDeleteClick}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                    {'Delete Warband'}
                                </div>
                            </div>

                        </Popover.Body>
                    }>
                    <div className={'Wbb-item-actions'}>
                        <FontAwesomeIcon icon={faEllipsisVertical} className=""/>
                    </div>
                </OverlayTrigger>

                <Modal show={showDeleteConfirm} onHide={handleCancelDelete} centered>
                    <Modal.Header
                        closeButton={false}
                    >
                        <Modal.Title>Delete Warband</Modal.Title>

                        <FontAwesomeIcon
                            icon={faXmark}
                            className="modal-close-icon"
                            role="button"
                            onClick={handleCancelDelete}
                        />
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            <strong>{'Warband Name: '}</strong>
                            {item.name}
                        </p>

                        <p>
                            Are you sure you want to delete this warband? This action cannot be undone.
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

export default WbbWarbandListItem;