import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";

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

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        const selected = availableWeapons.find((w) => w.id === selectedId);
        if (selected) {
            onSubmit(selected);
            setSelectedId(null); // reset
            onClose();
        }
    });


    return (
        <Modal show={show} onHide={onClose} className="WbbModal WbbModalSelect WbbModalAddRangedWeapon" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Ranged Weapon</Modal.Title>

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
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId || isSubmitting}>
                    {isSubmitting ? (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    ): (
                        <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'} />
                    )}
                    {'Add Weapon'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddRangedWeapon;
