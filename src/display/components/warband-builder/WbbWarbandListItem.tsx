import React, { useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen, faCopy, faEllipsisVertical, faPen, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import { WarbandManager } from '../../../classes/saveitems/Warband/WarbandManager';
import SynodImage from "../../../utility/SynodImage";


/**
 * This is a list item of a warband for the WBB overview page.
 * - It shows the name and infor about the warband
 * - Lets the user navigate to the edit screen for this warband
 * - show basic interactions like "rename" and "delete"
 *
 * @constructor
 */

interface WbbWarbandListItemProps {
    item: UserWarband
    manager : WarbandManager
    parentfunc : any
}
const WbbWarbandListItem: React.FC<WbbWarbandListItemProps> = ({ item, manager, parentfunc }) => {
    const navigate = useNavigate();
    const [showPopover, setShowPopover] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    /**
     * @TODO
     * This copies this warband
     */
    async function handleCopy() {
        setShowPopover(false);
        await manager.DuplicateItem(item);
        parentfunc();
        return true;
    }

    /**
     * Opens the delete confirmation modal
     */
    const handleDeleteClick = () => {
        setShowPopover(false);
        setShowDeleteConfirm(true);
    };

    /**
     * navigates to edit view
     */
    const navigateToEdit = () => {
        navigate('/warband/edit/' + item.ID);
    };

    /**
     * @TODO:
     * Handles the confirmation to actually delete the warband.
     */
    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        manager.DeletePack(item);
        parentfunc();
    };

    /**
     * Closes the confirmation modal
     */
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };


    return (
        <div className={'col-12 col-md-6'}>
            <div className={'WbbWarbandListItem'} >
                <div onClick={navigateToEdit} className={'warband-item-text-wrap'}>
                    <div className={'item-name'}>
                        {item.Name}
                    </div>

                    <div className={'item-faction'}>
                        {(item.Faction.MyFaction)? item.Faction.MyFaction.SelfDynamicProperty.OptionChoice.Name : ""}
                    </div>

                    <div className={'item-cost'}>
                        {item.Ducats + " Ducats" + " | " + item.Glory + " Glory" }
                    </div>

                    <div className={'item-campaign'}>
                        {
                            item.GetCampaignName()
                        }
                    </div>
                </div>

                <div className={'warband-item-image-wrap'}>
                    <SynodImage
                        imageId={113} // @TODO: add support for faction specific images
                        className={'warband-item-image'}
                        size={'large'}
                    />
                </div>

                <OverlayTrigger
                    trigger="click"
                    placement="left"
                    show={showPopover}
                    onToggle={() => setShowPopover(!showPopover)}
                    rootClose={true} // closes when clicking outside
                    overlay={
                        <Popover.Body className="popover Wbb-item-actions-popover">
                            <div className={'actions'}>
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
                    <div className={'Wbb-item-actions'}
                         onClick={(e) => e.stopPropagation()}>
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
                            {item.Name}
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