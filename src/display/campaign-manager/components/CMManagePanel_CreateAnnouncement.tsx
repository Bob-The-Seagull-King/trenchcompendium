

import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useCampaign} from "../../../context/CampaignContext";
import {toast} from "react-toastify";
import {ToolsController} from "../../../classes/_high_level_controllers/ToolsController";
import AlertCustom from "../../components/generics/AlertCustom";
import CMMarkdownTip from "../micro-components/CMMarkdownTip";

const CMManagePanel_CreateAnnouncement: React.FC = () => {
    const { campaign, reloadCampaignDisplay } = useCampaign();

    if( !campaign) {
        return null;
    }

    const [busy, setBusy] = useState<boolean>(false); // loading state
    const [show, setShow] = useState<boolean>(false);
    const [announcementTitle, setAnnouncementTitle] = useState<string>('');
    const [announcement, setAnnouncement] = useState<string>('');

    // handler function


    const handleAddAnnouncement = () => {
        if (campaign != null ) {
            setBusy(true);

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.AddAnnouncement(
                    campaign.GetId(),
                    announcementTitle,
                    announcement,
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    setShow(false);   // close Modal
                    toast.success('Announcement created')
                })
            })
        }
    }


    return (
        <>
            <div className="CMManagePanel_CreateAnnouncement CMManagePanel-action"
                onClick={() => setShow(true)}
            >
                {'Create Announcement'}
            </div>

            <Modal show={show} onHide={() => setShow(false)} className="CMManagePanel_CreateAnnouncement_Modal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Create Announcement</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setShow(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        <label className="form-label">
                            {'Announcement title'}
                        </label>
                        <input
                            className="form-control form-control-sm"
                            type="text"
                            value={announcementTitle}
                            onChange={(e) => setAnnouncementTitle(e.target.value)}
                            placeholder="Announcement title"
                            required
                        />
                    </div>
                    <label
                        htmlFor={'announcement-textarea'}
                    >
                        {'Announcement text'}
                    </label>
                    <textarea
                        id="announcement-textarea"
                        className="form-control mt-2"
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        rows={10}
                        placeholder="Enter your message here..."
                        required
                    />

                    <CMMarkdownTip />
                </Modal.Body>

                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>

                    {busy ? (
                        <Button
                            variant="primary"
                            disabled={true}
                        >
                            <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin me-2'} />
                            {'Creating announcement'}
                        </Button>
                    ):(
                        <Button
                            variant="primary"
                            onClick={handleAddAnnouncement}
                            disabled={announcement.trim() === ''}
                        >
                            {'Create announcement'}
                        </Button>
                    )}


                </Modal.Footer>
            </Modal>
        </>


    );
};

export default CMManagePanel_CreateAnnouncement;
