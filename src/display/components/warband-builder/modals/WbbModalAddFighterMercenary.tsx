import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Fighter {
    id: string;
    name: string;
}

interface WbbModalAddFighterMercenaryProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (selectedFighters: Fighter[]) => void;
}

const WbbModalAddFighterMercenary: React.FC<WbbModalAddFighterMercenaryProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleSubmit = () => {
        if (selectedId) {
            const selected = availableFighters.filter((f) => f.id === selectedId);
            onSubmit(selected);
            setSelectedId(null); // Clear selection
            onClose();
        }
    };

    // Test Data @TODO: Replace with actual mercenary options
    const availableFighters = [
        { id: 'm1', name: 'Mamluk Faris', cost: '5 Glory Points' },
        { id: 'm2', name: 'Trench Dog', cost: '1 Glory Point' }
    ];

    return (
        <Modal show={show} onHide={onClose} className={'WbbModalAddItem WbbModalAddFighterMercenary'} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Mercenary</Modal.Title>
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

export default WbbModalAddFighterMercenary;
