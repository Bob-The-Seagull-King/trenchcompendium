import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface WbbEditPatronSelectionProps {
    show: boolean;
    onClose: () => void;
    currentPatron: string;
    onSubmit: (newPatron: string) => void;
}

const WbbEditPatronSelectionModal: React.FC<WbbEditPatronSelectionProps> = ({
                                                                                show,
                                                                                onClose,
                                                                                currentPatron,
                                                                                onSubmit
                                                                            }) => {
    const [selectedPatron, setSelectedPatron] = useState<string>(currentPatron);

    // @TODO: Get actual Patron Options
    const patronOptions = ['Sublime Gate', 'Learned Saint', 'Infernal Noble'];

    const handleSubmit = () => {
        onSubmit(selectedPatron);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbEditPatronSelectionModal" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Patron</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <h6>Select a Patron</h6>

                <div className={'patron-selection-wrap'}>
                    {patronOptions.map((patron) => (
                        <div
                            key={patron}
                            className={`select-item ${selectedPatron === patron ? 'selected' : ''}`}
                            onClick={() => setSelectedPatron(patron)}
                        >
                            {patron}
                        </div>
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedPatron === currentPatron}
                >
                    Update Patron
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditPatronSelectionModal;