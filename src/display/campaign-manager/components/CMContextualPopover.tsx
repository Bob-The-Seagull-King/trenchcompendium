import React, {useEffect, useState} from "react";
import {useCampaign} from "../../../context/CampaignContext";
import {RealWarbandPurchaseModel} from "../../../classes/saveitems/Warband/Purchases/WarbandPurchase";
import {usePopover} from "../../../context/PopoverContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEdit, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Button, Modal, Popover} from "react-bootstrap";
import {useAuth} from "../../../utility/AuthContext";


interface CMContextualPopoverProps {
    id: string;
    type: 'announcement' | 'player' | 'warband' ;
    item: any;
}

/**
 * The Contextual Popover for campaigns
 */
const CMContextualPopover: React.FC<CMContextualPopoverProps> = ({ id, type, item }) => {

    const { campaign } = useCampaign();
    const { userId } = useAuth()

    const { activePopoverId, setActivePopoverId } = usePopover();
    const isActive = activePopoverId === id;
    const handleToggle = () => {
        setActivePopoverId(isActive ? null : id);
    };

    // Wrapper function to stop event propagation from this popover
    const withStopPropagation = (fn: () => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        fn();
    };




    /**
     * Announcement Actions
     */
    const [showEditAnnouncementModal, setshowEditAnnouncementModal] = useState(false);
    const [showConfirmDeleteAnnouncementModal, setshowConfirmDeleteAnnouncemenrModal] = useState(false);

    // Edit an announcement
    const handleEditAnnouncement = () => {
        // @TODO: save edit announcemenet here
        alert ('@TODO: save edit announcemenet here');
    }

    // Delete an announcement
    const handleDeleteAnnouncement = () => {
        // @TODO: delete announcemenet here
        alert ('@TODO: delete announcemenet here');
    }

    /** End Announcement actions*/

    /** Hides popover when a modal is opened */
    // Enter Modal state var here to listen to it
    useEffect(() => {
        if (showEditAnnouncementModal
            || showConfirmDeleteAnnouncementModal
        ) {
            setActivePopoverId(null);
        }
    }, [
        showEditAnnouncementModal,
        showConfirmDeleteAnnouncementModal,
    ]);


    return (
        <div className="CMContextualPopover">
            <OverlayTrigger
                trigger="click"
                placement="left"
                show={isActive}
                onToggle={handleToggle}
                rootClose={true}
                overlay={
                    <Popover.Body className="popover CM-item-actions-popover">
                        <div className="actions">

                            {/** Announcement Actions */}
                            {(type === 'announcement' && userId &&campaign.IsAdmin(userId)) &&
                                <>
                                    <div className="action"
                                         onClick={withStopPropagation(() => setshowEditAnnouncementModal(true))}>
                                        <FontAwesomeIcon icon={faEdit} className="icon-inline-left-l"/>
                                        {'Edit Announcement'}
                                    </div>

                                    <div className="action"
                                         onClick={withStopPropagation(() => setshowConfirmDeleteAnnouncemenrModal(true))}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Announcement'}
                                    </div>
                                </>
                        }

                        {/** Player actions */}
                        {/** Warband actions */}

                        </div>
                    </Popover.Body>
                }>

                <div className="CM-item-actions" onClick={(e) => e.stopPropagation()}>
                    <FontAwesomeIcon icon={faEllipsisVertical}/>
                </div>
            </OverlayTrigger>


            {/** Edit Announcement  Modal */}
            <Modal show={showEditAnnouncementModal} onHide={() => setshowEditAnnouncementModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Edit Announcement`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowEditAnnouncementModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {/* @TODO: hook up textarea data here*/}
                    <textarea
                        id="announcement-textarea"
                        className="form-control mt-2"
                        // value={announcement}
                        // onChange={(e) => setAnnouncement(e.target.value)}
                        rows={5}
                        placeholder="Enter your message here..."
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowEditAnnouncementModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleEditAnnouncement)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Delete Announcement Confirm Modal */}
            <Modal show={showConfirmDeleteAnnouncementModal} onHide={() => setshowConfirmDeleteAnnouncemenrModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Announcement`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowConfirmDeleteAnnouncemenrModal(false);
                        }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to delete this announcement?'}

                    {/* @TODO: output announcement here*/}
                    <div className={'announcement-title'}>Lorem title</div>
                    <div className={'announcement-date'}>lorem date</div>
                    <p className={'small'}>
                        {'Lorem ipsum'}
                    </p>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowConfirmDeleteAnnouncemenrModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleDeleteAnnouncement)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default CMContextualPopover;