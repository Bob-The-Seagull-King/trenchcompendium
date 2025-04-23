import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Fighter {
    id: string;
    name: string;
}

interface WbbModalAddFighterTroopProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (selectedFighters: Fighter[]) => void;
}

const WbbModalAddFighterTroop: React.FC<WbbModalAddFighterTroopProps> = ({ show, onClose, onSubmit }) => {
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

    // Test Data @TODO: replace with actual fighter options
    const availableFighters = [
        { id: 'f1', name: 'Azeb', cost: '15 Ducats' },
        { id: 'f2', name: 'Sapper', cost: '20 Ducats' },
        { id: 'f3', name: 'Jannissary', cost: '30 Ducats' }
    ];

    return (
        <Modal show={show} onHide={onClose} className={'WbbModalAddItem WbbModalAddFighterTroop'} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Troop</Modal.Title>
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

export default WbbModalAddFighterTroop;
