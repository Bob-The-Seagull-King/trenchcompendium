import React, {useEffect, useState} from "react";
import {useCampaign} from "../../../context/CampaignContext";
import {RealWarbandPurchaseModel} from "../../../classes/saveitems/Warband/Purchases/WarbandPurchase";
import {usePopover} from "../../../context/PopoverContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCopy,
    faCrown,
    faEdit,
    faEllipsisVertical,
    faFloppyDisk, faTimes,
    faTrash,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Button, Modal, Popover} from "react-bootstrap";
import {useAuth} from "../../../utility/AuthContext";


interface CMContextualPopoverProps {
    id: string;
    type: 'announcement' | 'player' | 'warband' | 'warband-invite' | 'player-invite';
    item: any;
}

/**
 * The Contextual Popover for campaigns
 */
const CMContextualPopover: React.FC<CMContextualPopoverProps> = ({ id, type, item }) => {

    const { campaign } = useCampaign();
    if( !campaign) {
        return null;
    }

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


    /**
     * Player Actions
     */
    const [showRemovePlayerModal, setshowRemovePlayerModal] = useState(false);
    // Remove a player
    const handleRemovePlayer = () => {
        // @TODO: remove player here
        // @TODO: grab player ID from player object?
        alert ('@TODO: remove player here');
    }

    const [showChangeAdminModal, setshowChangeAdminModal] = useState(false);
    // Remove a player
    const handleChangeAdmin = () => {
        // @TODO: Change Campaign Admin here
        // @TODO: grab player ID from player object?
        alert ('@TODO: change admin here');
    }

    /** End Player actions*/




    /**
     * Warband Actions
     */
    const [showRemoveWarbandModal, setshowRemoveWarbandModal] = useState(false);
    // Remove a warband
    const handleRemoveWarband = () => {
        // @TODO: remove warband here
        // @TODO: grab warband ID from object?
        alert ('@TODO: remove warband here');
    }

    /** End Warband Actions */

    /**
     * Warband Invite Actions
     */
    const [showCancelWarbandInviteModal, setshowCancelWarbandInviteModal] = useState(false);
    // Remove a warband
    const handleCancelWarbandInvite = () => {
        // @TODO: Cancel warband invite here
        // @TODO: grab warband ID from object?
        alert ('@TODO: cancel warband invite here');
    }
    /** End Warband Invite Actions */

    /**
     * Player Invite Actions
     */
    const [showCancelPlayerInviteModal, setshowCancelPlayerInviteModal] = useState(false);
    // Remove a warband
    const handleCancelPlayerInvite = () => {
        // @TODO: Cancel player invite here
        // @TODO: grab player ID from object?
        alert ('@TODO: cancel player invite here');
    }
    /** End Player Invite Actions */

    /** Hides popover when a modal is opened */
    // Enter Modal state var here to listen to it
    useEffect(() => {
        if (showEditAnnouncementModal
            || showConfirmDeleteAnnouncementModal
            || showConfirmDeleteAnnouncementModal
            || showRemovePlayerModal
            || showRemoveWarbandModal
            || showChangeAdminModal
            || showCancelWarbandInviteModal
            || showCancelPlayerInviteModal
        ) {
            setActivePopoverId(null);
        }
    }, [
        showEditAnnouncementModal,
        showConfirmDeleteAnnouncementModal,
        showRemovePlayerModal,
        showRemoveWarbandModal,
        showChangeAdminModal,
        showCancelWarbandInviteModal,
        showCancelPlayerInviteModal,
    ]);

    if(type === 'announcement' && ( !userId || !campaign.IsAdmin(userId))) {
        return null;
    }


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
                            {(type === 'announcement') &&
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
                            {(type === 'player') &&
                                <>
                                    <div className="action"
                                         onClick={withStopPropagation(() => setshowRemovePlayerModal(true))}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Remove Player'}
                                    </div>
                                    <div className="action"
                                         onClick={withStopPropagation(() => setshowChangeAdminModal(true))}>
                                        <FontAwesomeIcon icon={faCrown} className="icon-inline-left-l"/>
                                        {'Make Admin'}
                                    </div>
                                </>
                            }


                            {/** Warband actions */}
                            {(type === 'warband') &&
                                <>
                                    <div className="action"
                                         onClick={withStopPropagation(() => setshowRemoveWarbandModal(true))}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Remove Warband'}
                                    </div>
                                </>
                            }

                            {/** Warband Invite actions */}
                            {(type === 'warband-invite') &&
                                <>
                                    <div className="action"
                                         onClick={withStopPropagation(() => setshowCancelWarbandInviteModal(true))}>
                                        <FontAwesomeIcon icon={faTimes} className="icon-inline-left-l"/>
                                        {'Cancel Invite'}
                                    </div>
                                </>
                            }

                            {/** Player Invite actions */}
                            {(type === 'player-invite') &&
                                <>
                                    <div className="action"
                                         onClick={withStopPropagation(() => setshowCancelPlayerInviteModal(true))}>
                                        <FontAwesomeIcon icon={faTimes} className="icon-inline-left-l"/>
                                        {'Cancel Invite'}
                                    </div>
                                </>
                            }

                        </div>
                    </Popover.Body>
                }>

                <div className="CM-item-actions" onClick={(e) => e.stopPropagation()}>
                    <FontAwesomeIcon icon={faEllipsisVertical}/>
                </div>
            </OverlayTrigger>


            {/** Edit Announcement  Modal */}
            <Modal show={showEditAnnouncementModal} onHide={() => setshowEditAnnouncementModal(false)}
                   className={'CMManagePanel_CreateAnnouncement_Modal'}
                   centered>
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
                    {/* @TODO: hook up input data here*/}
                    <label className="form-label">
                        {'Announcement title'}
                    </label>
                    <input
                        className="form-control form-control-sm mb-3"
                        type="text"
                        // value={''}
                        // onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="Announcement title"
                        required
                    />

                    <label
                        htmlFor={'announcement-textarea'}
                    >
                        {'Announcement text'}
                    </label>
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
                    <Button variant="primary" onClick={withStopPropagation(handleEditAnnouncement)}>
                        <FontAwesomeIcon icon={faFloppyDisk} className={'icon-inline-left'} />
                        Save
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
                    <div className={'announcement-titl mt-3'}>
                        <strong>
                            Lorem title
                        </strong>
                    </div>
                    <div className={'small announcement-date'}>lorem date</div>

                    <p className={'small mt-2'}>
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
                        <FontAwesomeIcon icon={faTrash} className={'icon-inline-left'} />
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/**Remove Player Modal */}
            <Modal show={showRemovePlayerModal} onHide={() => setshowRemovePlayerModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Remove Player`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowRemovePlayerModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to remove this player from your campaign?'}

                    {/* @TODO: output player details here*/}
                    <div className={'my-3'}>
                        <strong>
                            {'Player Name here'}
                        </strong>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowRemovePlayerModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleRemovePlayer)}>
                        <FontAwesomeIcon icon={faTrash} className={'icon-inline-left'} />
                        Remove Player
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Change Admin Modal */}
            <Modal show={showChangeAdminModal} onHide={() => setshowChangeAdminModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Remove Player`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowChangeAdminModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to make this player the admin of your campaign?'}

                    {/* @TODO: change to custom alert */}
                    <div className={'alert alert-danger my-3'}>
                        <div className={'mb-3'}>
                            <strong>
                                {'Caution'}
                            </strong>
                        </div>
                        <div>
                            {'You will transfer your admin rights to this player:'}
                            <br/>
                            <strong>
                                {/* @TODO: add player Name here */}
                                {'Player Name'}
                            </strong>
                            <br/>
                            <br/>
                            {'You will still stay a player in this campaign but will lose your admin status if you do.'}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowChangeAdminModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleChangeAdmin)}>
                        <FontAwesomeIcon icon={faCrown} className={'icon-inline-left'} />
                        Change Admin
                    </Button>
                </Modal.Footer>
            </Modal>



            {/** Remove Warband Modal */}
            <Modal show={showRemoveWarbandModal} onHide={() => setshowRemoveWarbandModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Remove Warband`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowRemoveWarbandModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to remove this warband from your campaign?'}

                    {/* @TODO: output warband details here*/}
                    <div className={'my-3'}>
                        <strong>
                            {'warband Name here'}
                        </strong>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowRemoveWarbandModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleRemoveWarband)}>
                        <FontAwesomeIcon icon={faTrash} className={'icon-inline-left'} />
                        Remove Warband
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Cancel Warband Invite Modal */}
            <Modal show={showCancelWarbandInviteModal} onHide={() => setshowCancelWarbandInviteModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Cancel Warband Invite`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowCancelWarbandInviteModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to cancel the invite to this warband?'}

                    {/* @TODO: output warband details here*/}
                    <div className={'my-3'}>
                        <strong>
                            {'warband Name here'}
                        </strong>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowCancelWarbandInviteModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleCancelWarbandInvite)}>
                        <FontAwesomeIcon icon={faTimes} className={'icon-inline-left'} />
                        Cancel Invite
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Cancel Player Invite Modal */}
            <Modal show={showCancelPlayerInviteModal} onHide={() => setshowCancelPlayerInviteModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Cancel Warband Invite`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowCancelPlayerInviteModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to cancel the invite to this player?'}

                    {/* @TODO: output warband details here*/}
                    <div className={'my-3'}>
                        <strong>
                            {'Player Name here'}
                        </strong>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowCancelPlayerInviteModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleCancelPlayerInvite)}>
                        <FontAwesomeIcon icon={faTimes} className={'icon-inline-left'} />
                        Cancel Invite
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default CMContextualPopover;