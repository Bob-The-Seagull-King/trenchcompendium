import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface WbbEditFighterStatusProps {
    show: boolean;
    onClose: () => void;
    currentStatus: string; // should be one of: "Active", "Captured", "Dead"
    onSubmit: (newStatus: string) => void;
}

const WbbModalEditFighterStatus: React.FC<WbbEditFighterStatusProps> = ({
                                                                       show,
                                                                       onClose,
                                                                       currentStatus,
                                                                       onSubmit
                                                                   }) => {
    const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);

    const statuses = ['Active', 'Captured', 'Dead'];

    const handleSubmit = () => {
        onSubmit(selectedStatus);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbEditFighterStatus" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Fighter Status</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <h6>{'Select Fighter Status'}</h6>
                {statuses.map((status) => (
                    <div
                        key={status}
                        className={`select-item ${selectedStatus === status ? 'selected' : ''}`}
                        onClick={() => setSelectedStatus(status)}
                    >
                        {status}
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={selectedStatus === currentStatus}>
                    Update Status
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalEditFighterStatus;
