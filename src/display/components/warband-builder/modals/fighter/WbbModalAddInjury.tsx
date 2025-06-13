import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Injury {
    id: string;
    name: string;
    description?: string;
}

interface WbbModalAddInjuryProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (injury: Injury) => void;
}

const WbbModalAddInjury: React.FC<WbbModalAddInjuryProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const availableInjuries: Injury[] = [
        { id: 'inj1', name: 'Hand Wound', description: '-1 DICE for melee attacks' },
        { id: 'inj2', name: 'Blind Eye', description: '-1 to Ranged Accuracy' },
        { id: 'inj3', name: 'Cracked Rib', description: '-1 Toughness' }
    ];

    const handleSubmit = () => {
        const selected = availableInjuries.find((i) => i.id === selectedId);
        if (selected) {
            onSubmit(selected);
            setSelectedId(null); // reset
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddInjury" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Injury</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {availableInjuries.map((injury) => (
                    <div
                        key={injury.id}
                        className={`select-item ${selectedId === injury.id ? 'selected' : ''}`}
                        onClick={() => setSelectedId(injury.id)}
                    >
                        <span className="item-name">{injury.name}</span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId}>
                    Add Injury
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddInjury;
