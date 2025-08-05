

import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useCampaign} from "../../../context/CampaignContext";

const CMManagePanel_CreateAnnouncement: React.FC = () => {
    const { campaign } = useCampaign();

    const [show, setShow] = useState<boolean>(false);
    const [announcement, setAnnouncement] = useState<string>('');

    // handler function
    const handleSubmit = () => {
        campaign.CreateAnnouncement(announcement);
        alert ('TODO: create announcement here')
        setShow(false);
    };


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
                    <label
                        htmlFor={'announcement-textarea'}
                    >
                        {'Create an announcement for all players to see.'}
                    </label>

                    <textarea
                        id="announcement-textarea"
                        className="form-control mt-2"
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        rows={5}
                        placeholder="Enter your message here..."
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={announcement.trim() === ''}
                    >
                        Update VP
                    </Button>
                </Modal.Footer>
            </Modal>
        </>


    );
};

export default CMManagePanel_CreateAnnouncement;
