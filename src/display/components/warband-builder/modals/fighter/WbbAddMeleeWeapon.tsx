import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface MeleeWeapon {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddMeleeWeaponProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (weapon: MeleeWeapon) => void;
}

const WbbModalAddMeleeWeapon: React.FC<WbbModalAddMeleeWeaponProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const availableWeapons: MeleeWeapon[] = [
        { id: 'mw1', name: 'Trench Knife', costDucats: 5 },
        { id: 'mw2', name: 'Ritual Blade', costDucats: 10 },
        { id: 'mw3', name: 'Great Sword', costDucats: 20 },
    ];

    const handleSubmit = () => {
        const weapon = availableWeapons.find(w => w.id === selectedId);
        if (weapon) {
            onSubmit(weapon);
            setSelectedId(null);
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddMeleeWeapon" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Melee Weapon</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
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
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId}>
                    Add Weapon
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddMeleeWeapon;
