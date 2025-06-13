import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Advancement {
    id: string;
    name: string;
    description?: string;
}

interface WbbModalAddAdvancementProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (advancement: Advancement) => void;
}

const WbbModalAddAdvancement: React.FC<WbbModalAddAdvancementProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const availableAdvancements: Advancement[] = [
        { id: 'adv1', name: 'Stand Firm', description: 'Treat first Down as Minor Hit' },
        { id: 'adv2', name: 'Crack Shot', description: 'Ranged attacks gain +1 dice'},
        { id: 'adv3', name: 'Resilient', description: 'Ignore 1 injury per battle' },
    ];

    const handleSubmit = () => {
        const selected = availableAdvancements.find((a) => a.id === selectedId);
        if (selected) {
            onSubmit(selected);
            setSelectedId(null);
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddAdvancement" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Advancement</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {availableAdvancements.map((adv) => (
                    <div
                        key={adv.id}
                        className={`select-item ${selectedId === adv.id ? 'selected' : ''}`}
                        onClick={() => setSelectedId(adv.id)}
                    >
                        <div className="item-name">{adv.name}</div>

                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId}>
                    Add Advancement
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddAdvancement;
