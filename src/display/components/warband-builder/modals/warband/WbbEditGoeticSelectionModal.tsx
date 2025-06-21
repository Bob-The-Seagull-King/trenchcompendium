import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface WbbEditGoeticSelectionProps {
    show: boolean;
    onClose: () => void;
    currentGoetic: string;
    onSubmit: (newGoetic: string) => void;
}

const WbbEditGoeticSelectionModal: React.FC<WbbEditGoeticSelectionProps> = ({
                                                                                show,
                                                                                onClose,
                                                                                currentGoetic,
                                                                                onSubmit
                                                                            }) => {
    const [selectedGoetic, setSelectedGoetic] = useState<string>(currentGoetic);

    const goeticDisciplines = ['Wrath', 'Lust', 'Greed', 'Sloth'];

    const handleSubmit = () => {
        onSubmit(selectedGoetic);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbEditGoeticSelectionModal" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Goetic Discipline</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <h6>Select Goetic Discipline</h6>

                <div className={'goetic-selection-wrap'}>
                    {goeticDisciplines.map((discipline) => (
                        <div
                            key={discipline}
                            className={`select-item ${selectedGoetic === discipline ? 'selected' : ''}`}
                            onClick={() => setSelectedGoetic(discipline)}
                        >
                            {discipline}
                        </div>
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={selectedGoetic === currentGoetic}>
                    Update Discipline
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditGoeticSelectionModal;