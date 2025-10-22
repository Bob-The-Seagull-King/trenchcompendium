import React, {useCallback, useEffect, useState} from "react";
import {useCampaign} from "../../../context/CampaignContext";
import {RealWarbandPurchaseModel} from "../../../classes/saveitems/Warband/Purchases/WarbandPurchase";
import {usePopover} from "../../../context/PopoverContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircleNotch,
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
import {useCampaignActions} from "../../../utility/useCampaignActions";
import { ToolsController } from "../../../classes/_high_level_controllers/ToolsController";
import { CampaignWarband } from "../../../classes/saveitems/Campaign/CampaignWarband";
import {CampaignUser} from "../../../classes/saveitems/Campaign/CampaignUser";
import {toast} from "react-toastify";
import {CampaignAnnouncement} from "../../../classes/saveitems/Campaign/CampaignAnnouncement";
import CampaignPlayers from "./CampaignPlayers";
import AlertCustom from "../../components/generics/AlertCustom";
import {ICampaignUserInvite} from "../../../classes/saveitems/Campaign/CampaignManager";


interface CMContextualPopoverProps {
    id: string;
    type: 'announcement' | 'player' | 'warband' | 'warband-invite' | 'player-invite';
    item: any;
}

/**
 * The Contextual Popover for campaigns
 */
const CMContextualPopover: React.FC<CMContextualPopoverProps> = ({ id, type, item }) => {

    const { campaign, reload, reloadCampaignDisplay, updateCampaignKey } = useCampaign();
    if( !campaign) {
        return null;
    }

    const [busy, setBusy] = useState(false);

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
    const [showConfirmDeleteAnnouncementModal, setshowConfirmDeleteAnnouncementModal] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState((item as CampaignAnnouncement).Title );
    const [announcementHTML, setAnnouncementHTML] = useState((item as CampaignAnnouncement).Html);

    // Edit an announcement
    const handleEditAnnouncement = () => {
        if (campaign != null && type == "announcement") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.EditAnnouncement(
                    campaign.GetId(),
                    item,
                    announcementTitle,
                    announcementHTML,
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    setshowEditAnnouncementModal(false);   // close Modal
                    toast.success('Saved announcement')
                })
            })
        }
    }

    // Delete an announcement
    const handleDeleteAnnouncement = () => {
        if (campaign != null && type == "announcement") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.DeleteAnnouncement(
                    campaign.GetId(),
                    item
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    setshowConfirmDeleteAnnouncementModal(false);   // close Modal
                    toast.success('Deleted announcement')
                })
            })
        }
    }

    /** End Announcement actions*/


    /**
     * Player Actions
     */
    const [showRemovePlayerModal, setshowRemovePlayerModal] = useState(false);
    // Remove a player
    const handleRemovePlayer = () => {
        if (campaign != null && type == "player") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.ForceRemovePlayer(campaign.GetId(), (item as CampaignUser).Id).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    setshowRemovePlayerModal(false);   // close Modal
                    toast.success('Removed player from campaign')
                })})
        }
    };

    const [showChangeAdminModal, setshowChangeAdminModal] = useState(false);
    // Remove a player
    const handleChangeAdmin = () => {
        if (campaign != null && type == "player") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.ChangeCampaignAdmin(
                    campaign.GetId(),
                    (item as CampaignUser).Id
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    setshowChangeAdminModal(false);   // close Modal
                    toast.success('Admin Changed')
                })
            })
        }
    }
    /** End Player actions*/




    /**
     * Warband Actions
     */
    const [showRemoveWarbandModal, setshowRemoveWarbandModal] = useState(false);
    // Remove a warband
    const handleRemoveWarband = () => {
        if (campaign != null && type == "warband") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
            Tools.UserCampaignManager.ForceRemoveWarband(campaign.GetId(), (item as CampaignWarband).WarbandID).then(() => {
                reloadCampaignDisplay();
                setBusy(false);
                setshowRemoveWarbandModal(false);   // close Modal
                toast.success('Removed warband from campaign')

            })})
        }
    }

    /** End Warband Actions */

    /**
     * Warband Invite Actions
     */
    // Cancel a warband invite

    const handleCancelWarbandInvite = () => {


        if (campaign != null && type == "warband-invite") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.CampaignWarbandReject(
                    campaign.GetId(),
                    item.id
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    toast.success('Cancelled warband invite')
                })
            })
        }
    }
    /** End Warband Invite Actions */

    /**
     * Cancel player invite
     */
    const handleCancelPlayerInvite  = () => {
        if (campaign != null && type == "player-invite") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.CampaignInviteCancel(
                    campaign.GetId(),
                    (item as CampaignUser).Id
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    toast.success('Cancelled player invite')
                })
            })
        }
    };
    /** End Player Invite Actions */

    /** Hides popover when a modal is opened */
    // Enter Modal state var here to listen to it
    useEffect(() => {
        if (showEditAnnouncementModal
            || showConfirmDeleteAnnouncementModal
            || showRemovePlayerModal
            || showRemoveWarbandModal
            || showChangeAdminModal
        ) {
            setActivePopoverId(null);
        }
    }, [
        showEditAnnouncementModal,
        showConfirmDeleteAnnouncementModal,
        showRemovePlayerModal,
        showRemoveWarbandModal,
        showChangeAdminModal,
    ]);

    // Only admins can edit any option
    if( !userId || !campaign.IsAdmin(userId)) {
        return null;
    }

    // Only admins can edit announcements
    if(type === 'announcement' && ( !userId || !campaign.IsAdmin(userId))) {
        return null;
    }

    // do not show any options if these are options for the admin (none are applicable)
    if( type === 'player' && campaign.IsAdmin(item.Id) ) {
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
                                         onClick={withStopPropagation(() => setshowConfirmDeleteAnnouncementModal(true))}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Announcement'}
                                    </div>
                                </>
                            }

                            {/** Player actions */}
                            {(type === 'player') &&
                                <>
                                    { !campaign.IsAdmin(item.Id) &&
                                        <div className="action"
                                        onClick={withStopPropagation(() => setshowRemovePlayerModal(true))}
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                            {'Remove Player'}
                                        </div>
                                    }

                                    {!campaign.IsAdmin(item.Id) &&
                                        <div className="action"
                                             onClick={withStopPropagation(() => setshowChangeAdminModal(true))}>
                                            <FontAwesomeIcon icon={faCrown} className="icon-inline-left-l"/>
                                            {'Make Admin'}
                                        </div>
                                    }
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
                                         onClick={withStopPropagation(() => handleCancelWarbandInvite())}>
                                        <FontAwesomeIcon icon={faTimes} className="icon-inline-left-l"/>
                                        {'Cancel Invite'}
                                    </div>
                                </>
                            }

                            {/** Player Invite actions */}
                            {(type === 'player-invite') &&
                                <>
                                    <div className="action"
                                         onClick={withStopPropagation(() => handleCancelPlayerInvite())}>
                                        <FontAwesomeIcon icon={faTimes} className="icon-inline-left-l"/>
                                        {'Cancel Invite'}
                                    </div>
                                </>
                            }

                        </div>
                    </Popover.Body>
                }>

                { !busy ? (
                    <div className="CM-item-actions" onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon icon={faEllipsisVertical}/>
                    </div>
                ): (
                    <div className="CM-item-actions">
                        <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin'}/>
                    </div>
                )}
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
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
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
                        value={announcementHTML}
                        onChange={(e) => setAnnouncementHTML(e.target.value)}
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

                    {busy ? (
                        <Button variant="primary" disabled={true}>
                            <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin icon-inline-left'} />
                            Saving
                        </Button>
                    ):(
                        <Button variant="primary" onClick={withStopPropagation(handleEditAnnouncement)}>
                            <FontAwesomeIcon icon={faFloppyDisk} className={'icon-inline-left'} />
                            Save
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/** Delete Announcement Confirm Modal */}
            <Modal show={showConfirmDeleteAnnouncementModal} onHide={() => setshowConfirmDeleteAnnouncementModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Announcement`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowConfirmDeleteAnnouncementModal(false);
                        }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to delete this announcement?'}

                    <div className={'announcement-titl mt-3'}>
                        <strong>
                            {(item as CampaignAnnouncement).Title}
                        </strong>
                    </div>
                    <div className={'small announcement-date'}>
                        {(item as CampaignAnnouncement).DateStr}
                    </div>

                    <p className={'small mt-2'}>
                        {(item as CampaignAnnouncement).Html}
                    </p>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowConfirmDeleteAnnouncementModal(false);
                        }
                    }>
                        Cancel
                    </Button>

                    {busy ? (
                        <Button variant="danger" disabled={true}>
                            <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin icon-inline-left'} />
                            Deleting
                        </Button>
                    ):(
                        <Button variant="danger" onClick={withStopPropagation(handleDeleteAnnouncement)}>
                            <FontAwesomeIcon icon={faTrash} className={'icon-inline-left'} />
                            Delete
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/** Remove Player Modal */}
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

                    <div className={'my-3'}>
                        <strong>
                            {(item as CampaignUser).Nickname}
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

                    {busy ? (
                        <Button variant="danger" disabled={true}>
                            <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin icon-inline-left'} />
                            Removing Player
                        </Button>
                    ):(
                        <Button variant="danger" onClick={withStopPropagation(handleRemovePlayer)}>
                            <FontAwesomeIcon icon={faTrash} className={'icon-inline-left'} />
                            Remove Player
                        </Button>
                    )}

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

                    <AlertCustom
                        type={'danger'}
                        className={'mt-3'}
                    >
                        <h5 className={'mb-3'}>
                            <strong>
                                {'Caution'}
                            </strong>
                        </h5>
                        <div>
                            {'You will transfer your admin rights to this player:'}
                            <br/>
                            <br/>
                            <strong>
                                {(item as CampaignUser).Nickname}
                            </strong>
                            <br/>
                            <br/>
                            {'You will still stay a player in this campaign but will lose your admin status if you do.'}
                        </div>

                    </AlertCustom>
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

                    {busy ? (
                        <Button variant="primary" disabled={true}>
                            <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin icon-inline-left'}/>
                            Changing Admin
                        </Button>
                    ):(
                        <Button variant="danger" onClick={withStopPropagation(handleChangeAdmin)}>
                            <FontAwesomeIcon icon={faCrown} className={'icon-inline-left'} />
                            Change Admin
                        </Button>
                    )}
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

                    <div className={'my-3'}>
                        <strong>
                            {(item as CampaignWarband).WarbandName}
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

                    {busy ? (
                        <Button variant="danger" disabled={true}>
                            <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin icon-inline-left'} />
                            Removing Warband
                        </Button>
                    ):(
                        <Button
                            variant="danger"
                            onClick={withStopPropagation(handleRemoveWarband)}
                        >
                            <FontAwesomeIcon icon={faTrash} className={'icon-inline-left'} />
                            Remove Warband
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default CMContextualPopover;