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
import { ToolsController } from "../../../classes/_high_level_controllers/ToolsController";
import { CampaignWarband } from "../../../classes/saveitems/Campaign/CampaignWarband";
import {CampaignUser} from "../../../classes/saveitems/Campaign/CampaignUser";
import {toast} from "react-toastify";
import {CampaignAnnouncement} from "../../../classes/saveitems/Campaign/CampaignAnnouncement";
import CampaignPlayers from "./CampaignPlayers";
import AlertCustom from "../../components/generics/AlertCustom";
import {ICampaignUserInvite} from "../../../classes/saveitems/Campaign/CampaignManager";
import {Campaign} from "../../../classes/saveitems/Campaign/Campaign";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../../resources/routes-constants";


interface CMContextualPopoverProps {
    id: string;
    type: 'announcement' | 'player' | 'warband' | 'warband-invite' | 'player-invite' | 'campaign' | 'player-self';
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
    const navigate = useNavigate();

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
     * Campaign Actions
     */
    const [showEditCampaignNameModal, setShowEditCampaignNameModal] = useState(false);
    const [campaignTitle, setCampaignTitle] = useState(campaign.GetName() );

    const handleEditCampaignName = () => {
        if (campaign != null && type == "campaign") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.UpdateCampaign(
                    campaign.GetId(), // campaign ID
                    campaignTitle, // new title
                    campaign.GetDescription(), // keep the description
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    setShowEditCampaignNameModal(false);   // close Modal
                    toast.success('Campaign name changed')
                })
            })
        }
    }

    const [showDeleteCampaignModal, setShowDeleteCampaignModal] = useState(false);
    const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

    const handleDeleteCampaign = () => {
        if (campaign != null && type == "campaign") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.DeleteCampaign(
                    campaign.GetId(), // campaign ID
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    setShowDeleteCampaignModal(false);   // close Modal
                    navigate( ROUTES.CAMPAIGN, {state: Date.now().toString()})
                    toast.success('Campaign deleted')
                })
            })
        }
    }


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
     * Player self actions
     */
    const [showLeaveCampaignModal, setshowLeaveCampaignModal] = useState(false);
    const handleLeavePlayer = () => {
        if (campaign != null && type == "player-self") {
            setBusy(true);
            setActivePopoverId(null); // Close popover

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.ForceRemovePlayer(campaign.GetId(), (item as CampaignUser).Id).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    setshowLeaveCampaignModal(false);   // close Modal
                    toast.success('You have left the campaign')
                })})
        }
    };



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
            || showEditCampaignNameModal
            || showDeleteCampaignModal
        ) {
            setActivePopoverId(null);
        }
    }, [
        showEditAnnouncementModal,
        showConfirmDeleteAnnouncementModal,
        showRemovePlayerModal,
        showRemoveWarbandModal,
        showChangeAdminModal,
        showEditCampaignNameModal,
        showDeleteCampaignModal,
    ]);

    // Only logged in users can edit any option
    if( !userId ) {
        return null;
    }
    // only admins can edit general things
    if( !campaign.IsAdmin(userId) && type != 'player-self' ) {
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
                    <Popover id={`cm-popover-${id}`} className="CM-item-actions-popover">
                        <Popover.Body className="popover CM-item-actions-popover">
                            <div className="actions">

                                {/** Campaign Actions */}
                                {(type === 'campaign') &&
                                    <>
                                        <div className="action"
                                             onClick={withStopPropagation(() => setShowEditCampaignNameModal(true))}>
                                            <FontAwesomeIcon icon={faEdit} className="icon-inline-left-l"/>
                                            {'Rename Campaign'}
                                        </div>

                                        <div className="action"
                                             onClick={withStopPropagation(() => setShowDeleteCampaignModal(true))}>
                                            <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                            {'Delete Campaign'}
                                        </div>
                                    </>
                                }

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


                                {/** Player self actions */}
                                {(type === 'player-self') &&
                                    <>
                                        <div className="action"
                                             onClick={withStopPropagation(() => setshowLeaveCampaignModal(true))}>
                                            <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                            {'Leave Campaign'}
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
                    </Popover>
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

            {/** Edit Campaign Name Modal */}
            <Modal show={showEditCampaignNameModal} onHide={() => setShowEditCampaignNameModal(false)}
                   className={'CMManagePanel_EditCampaignName_Modal'}
                   centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Edit Campaign Name`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setShowEditCampaignNameModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    <label className="form-label">
                        {'Campaign Name'}
                    </label>

                    <input
                        className="form-control form-control-sm mb-3"
                        type="text"
                        value={campaignTitle}
                        onChange={(e) => setCampaignTitle(e.target.value)}
                        placeholder="Campaign Name"
                        required
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setShowEditCampaignNameModal(false);
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
                        <Button variant="primary" onClick={withStopPropagation(handleEditCampaignName)}>
                            <FontAwesomeIcon icon={faFloppyDisk} className={'icon-inline-left'} />
                            Save
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/** Delete Campaign Confirmation Modal */}
            <Modal show={showDeleteCampaignModal} onHide={() => setShowDeleteCampaignModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Campaign`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setShowDeleteCampaignModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    <AlertCustom
                        type={'danger'}
                    >
                        {'Do you really want to delete this campaign? This action can not be undone.'}
                    </AlertCustom>

                    <div className={'mt-3'}>
                        <label className="form-label small" htmlFor={'delete-warband-confirm'}>
                            {"Type 'Confirm' to delete your warband."}
                        </label>
                        <input
                            type="text" id={'delete-warband-confirm'}
                            className="form-control"
                            placeholder={'Confirm'}
                            value={deleteConfirmInput}
                            onChange={(e) => setDeleteConfirmInput(e.target.value)}
                        />

                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setShowDeleteCampaignModal(false);
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
                        <Button
                            variant="danger"
                            onClick={withStopPropagation(handleDeleteCampaign)}
                            disabled={deleteConfirmInput !== 'Confirm'}
                        >
                            <FontAwesomeIcon icon={faTrash} className={'icon-inline-left'} />
                            Delete Campaign
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>


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
                    <textarea
                        id="announcement-textarea"
                        className="form-control mt-2"
                        value={announcementHTML}
                        onChange={(e) => setAnnouncementHTML(e.target.value)}
                        rows={10}
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

            {/** Player Leave Campaign Modal */}
            <Modal show={showLeaveCampaignModal} onHide={() => setshowLeaveCampaignModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Leave Campaign`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowLeaveCampaignModal(false);
                            }}
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to leave this campaign?'}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowLeaveCampaignModal(false);
                        }
                    }>
                        Cancel
                    </Button>

                    {busy ? (
                        <Button variant="primary" disabled={true}>
                            <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin icon-inline-left'} />
                            Leaving Campaign
                        </Button>
                    ):(
                        <Button variant="primary" onClick={withStopPropagation(handleLeavePlayer)}>
                            <FontAwesomeIcon icon={faTrash} className={'icon-inline-left'} />
                            Leave Campaign
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