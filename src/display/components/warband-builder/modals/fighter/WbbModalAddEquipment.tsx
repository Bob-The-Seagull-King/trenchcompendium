import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';

interface EquipmentItem {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddEquipmentProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (equipment: EquipmentItem) => void;
    fighter : RealWarbandPurchaseModel
    category : string
}

const WbbModalAddEquipment: React.FC<WbbModalAddEquipmentProps> = ({ show, onClose, onSubmit, fighter, category }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Example test data — replace with actual equipment list
    const availableEquipment: EquipmentItem[] = [
        { id: 'eq1', name: 'Alchemical Ammunition', costDucats: 3 },
        { id: 'eq2', name: 'Helmet', costDucats: 15 },
        { id: 'eq3', name: 'Gas Mask', costDucats: 3 },
        { id: 'eq4', name: 'Standard Armour', costDucats: 10 },
    ];

    const handleSubmit = () => {
        const selected = availableEquipment.find((item) => item.id === selectedId);
        if (selected) {
            onSubmit(selected);
            setSelectedId(null);
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddEquipment" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Equipment</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {availableEquipment.map((item) => (
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
                    Add Equipment
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddEquipment;
