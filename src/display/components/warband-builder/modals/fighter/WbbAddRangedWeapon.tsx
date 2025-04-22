import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface RangedWeapon {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddRangedWeaponProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (weapon: RangedWeapon) => void;
}

const WbbModalAddRangedWeapon: React.FC<WbbModalAddRangedWeaponProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const availableWeapons: RangedWeapon[] = [
        { id: 'rw1', name: 'Siege Jezzail', costDucats: 15 },
        { id: 'rw2', name: 'Jezzail', costDucats: 7 },
        { id: 'rw3', name: 'Machine Gun', costGlory: 5 },
    ];

    const handleSubmit = () => {
        const selected = availableWeapons.find((w) => w.id === selectedId);
        if (selected) {
            onSubmit(selected);
            setSelectedId(null); // reset
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddRangedWeapon" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Ranged Weapon</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {availableWeapons.map((weapon) => (
                    <div
                        key={weapon.id}
                        className={`select-item ${selectedId === weapon.id ? 'selected' : ''}`}
                        onClick={() => setSelectedId(weapon.id)}
                    >
                        <span className={'item-name'}>
                            {weapon.name}
                        </span>
                        <span className={'item-cost'}>
                            {weapon.costDucats &&
                                <>
                                    {weapon.costDucats}{' Ducats'}
                                </>
                            }
                            {weapon.costGlory &&
                                <>
                                    {weapon.costGlory}{' Glory'}
                                </>
                            }
                        </span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId}>
                    Add Weapon
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddRangedWeapon;
