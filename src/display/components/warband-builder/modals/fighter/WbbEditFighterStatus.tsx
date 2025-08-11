import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCheckCircle, faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { makestringpresentable } from '../../../../../utility/functions';
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";

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

    const statuses = ['active', 'reserved', 'lost', 'dead'];

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        onSubmit(selectedStatus);
        onClose();
    });

    return (
        <Modal show={show} onHide={onClose} className="WbbModal WbbModalSelect WbbEditFighterStatus" centered>
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
                {statuses.map((status) => (
                    <div
                        key={status}
                        className={`select-item ${selectedStatus === status ? 'selected' : ''}`}
                        onClick={() => setSelectedStatus(status)}
                    >
                        <span>
                            {currentStatus === status &&
                            <FontAwesomeIcon icon={faCheckCircle} className={'icon-inline-left-l'}/>
                            }
                            {makestringpresentable(status)}
                        </span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={(selectedStatus === currentStatus) || isSubmitting}>
                    {isSubmitting && (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    )}
                    {'Update Status'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalEditFighterStatus;
