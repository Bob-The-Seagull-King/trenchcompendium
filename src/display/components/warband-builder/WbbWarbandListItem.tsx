import React, { useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen, faCopy, faEllipsisVertical, faPen, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import { SumWarband, WarbandManager } from '../../../classes/saveitems/Warband/WarbandManager';
import SynodImage from "../../../utility/SynodImage";
import SynodFactionImage from "../../../utility/SynodFactionImage";

/**
 * This is a list item of a warband for the WBB overview page.
 * - It shows the name and infor about the warband
 * - Lets the user navigate to the edit screen for this warband
 * - show basic interactions like "rename" and "delete"
 *
 * @constructor
 */

interface WbbWarbandListItemProps {
    item: SumWarband
    manager : WarbandManager
    parentfunc : any
}
const WbbWarbandListItem: React.FC<WbbWarbandListItemProps> = ({ item, manager, parentfunc }) => {
    const navigate = useNavigate();
    const [showPopover, setShowPopover] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    /**
     *
     * This copies this warband
     */
    async function handleCopy() {
        setShowPopover(false);
        await manager.DuplicateItem(item.warband_data);
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
        navigate('/warband/edit/' + item.id);
    };

    /**
     *
     * Handles the confirmation to actually delete the warband.
     */
    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        manager.DeletePack(item.id);
        parentfunc();
    };

    /**
     * Closes the confirmation modal
     */
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };


    return (
        <div className={'col-12 col-lg-6'}>
            <div className={'WbbWarbandListItem'} >
                <div onClick={navigateToEdit} className={'warband-item-text-wrap'}>
                    <div className={'item-name'}>
                        {item.warband_data.Name}
                    </div>

                    <div className={'item-faction'}>
                        {(item.warband_data.Faction.MyFaction)? item.warband_data.Faction.MyFaction.SelfDynamicProperty.OptionChoice.Name : ""}
                    </div>

                    <div className={'item-cost'}>
                        {item.warband_data.Ducats + " Ducats" + " | " + item.warband_data.Glory + " Glory" }
                    </div>

                    <div className={'item-campaign'}>
                        {item.warband_data.GetCampaignName()}
                        <br />
                        {'Campaign Cycle: ' + item.warband_data.GetCampaignCycleMax()}
                    </div>
                </div>

                <div className={'warband-item-image-wrap'}>
                    <SynodFactionImage
                        factionSlug={(item.warband_data.Faction.MyFaction)? item.warband_data.Faction.MyFaction.SelfDynamicProperty.OptionChoice.ID : ""}
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
                            {item.warband_data.Name}
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