import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Item {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddItemToStashProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (weapon: Item) => void;
}

const WbbModalAddItemToStash: React.FC<WbbModalAddItemToStashProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const availableItems: Item[] = [
        { id: 'mw1', name: 'Trench Knife', costDucats: 5 },
        { id: 'mw2', name: 'Ritual Blade', costDucats: 10 },
        { id: 'mw3', name: 'Great Sword', costDucats: 20 },
    ];

    const handleSubmit = () => {
        const weapon = availableItems.find(w => w.id === selectedId);
        if (weapon) {
            onSubmit(weapon);
            setSelectedId(null);
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddItemToStash" centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Item to Stash</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {availableItems.map((item) => (
                    <div
                        key={item.id}
                        className={`select-item ${selectedId === item.id ? 'selected' : ''}`}
                        onClick={() => setSelectedId(item.id)}
                    >
                        <span className={'item-name'}>
                            {item.name}
                        </span>
                        <span className={'item-cost'}>
                            {item.costDucats &&
                                <>
                                    {item.costDucats}{' Ducats'}
                                </>
                            }
                            {item.costGlory &&
                                <>
                                    {item.costGlory}{' Glory'}
                                </>
                            }
                        </span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId}>
                    Add item
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddItemToStash;
