import React from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    body: string | React.ReactNode;
    title?: string;
}

/**
 * A general Confirmation Modal
 * @param show
 * @param onClose
 * @param onConfirm
 * @param body
 * @param title
 * @constructor
 */

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                 show,
                                                                 onClose,
                                                                 onConfirm,
                                                                 body,
                                                                 title = 'Confirmation',
                                                             }) => {
    const handleConfirmAction = () => {
        onConfirm();
        onClose(); // optionally close the modal
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>{title}</Modal.Title>
                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                />
            </Modal.Header>

            <Modal.Body>
                {body}
                <div className="mt-4 d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={handleConfirmAction}>
                        Confirm
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmationModal;
