import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { FactionEquipmentRelationship } from '../../../../../classes/relationship/faction/FactionEquipmentRelationship';
import { getCostType } from '../../../../../utility/functions';

interface EquipmentItem {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddEquipmentProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (equipment: FactionEquipmentRelationship) => void;
    fighter : RealWarbandPurchaseModel
    category : string
}

const WbbModalAddEquipment: React.FC<WbbModalAddEquipmentProps> = ({ show, onClose, onSubmit, fighter, category }) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);

    const [available, setAvailable] = useState<FactionEquipmentRelationship[]>([]);
    const [keyvar, setkevvar] = useState(0);

    const handleSubmit = () => {
        const selected = available.find(w => w.ID === selectedID);
        if (selected) {
            onSubmit(selected);
            setSelectedID(null)
            onClose();
        }
    };
    
    
    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await fighter.model.GetModelEquipmentOptions()
            if (options != undefined) {
                setAvailable(options.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    return (
        <Modal key={keyvar} show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddEquipment" centered>
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
                {available.map((item) => (
                    <div
                        key={item.ID}
                        className={`select-item ${selectedID === item.ID ? 'selected' : ''}`}
                        onClick={() => setSelectedID(item.ID)}
                    >
                        <span className={'item-name'}>
                            {item.EquipmentItem.GetTrueName()}
                        </span>
                        <span className={'item-cost'}>
                            {item.Cost &&
                                <>
                                    {item.Cost + " " + getCostType(item.CostType)}
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
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedID}>
                    Add Equipment
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddEquipment;

