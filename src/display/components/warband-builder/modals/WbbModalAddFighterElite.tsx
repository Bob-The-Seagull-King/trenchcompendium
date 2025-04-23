import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Fighter {
    id: string;
    name: string;
}

interface WbbModalAddFighterEliteProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (selectedFighters: Fighter[]) => void;
}

const WbbModalAddFighterElite: React.FC<WbbModalAddFighterEliteProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleSubmit = () => {
        if (selectedId) {
            const selected = availableFighters.filter((f) => f.id === selectedId);
            onSubmit(selected);
            setSelectedId(null); // clear selection
            onClose();
        }
    };

    // Test Data @TODO: replace with actual elite options
    const availableFighters = [
        { id: 'e1', name: 'Yüzbasi Captain', cost: '35 Ducats' },
        { id: 'e2', name: 'Assassin', cost: '40 Ducats' },
        { id: 'e3', name: 'Jabirean Alchemist', cost: '30 Ducats' }
    ];

    return (
        <Modal show={show} onHide={onClose} className={'WbbModalAddItem WbbModalAddFighterElite'} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Elite</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {availableFighters.map((fighter) => (
                    <div
                        key={fighter.id}
                        className={`select-item ${selectedId === fighter.id ? 'selected' : ''}`}
                        onClick={() => handleSelect(fighter.id)}
                    >
                        <span className={'item-name'}>
                            {fighter.name}
                        </span>
                        <span className={'item-cost'}>
                            {fighter.cost}
                        </span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId}>
                    Add Fighter
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddFighterElite;
