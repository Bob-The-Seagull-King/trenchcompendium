import { useWarband } from '../../../../context/WarbandContext';
import { FactionEquipmentRelationship } from '../../../../classes/relationship/faction/FactionEquipmentRelationship';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { containsTag, getCostType } from '../../../../utility/functions';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { EquipmentFactory } from '../../../../factories/features/EquipmentFactory';

interface Item {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddItemToStashProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (weapon: Equipment, cost : number, costtype : number) => void;
}

const WbbEquipmentAddCustomStash: React.FC<WbbModalAddItemToStashProps> = ({ show, onClose, onSubmit}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [cost, setCost] = useState<number>(0);
    const [costType, setCostType] = useState<0 | 1>(0); // 0 == ducats, 1 == glory
    
    const { warband } = useWarband();
    const [listofoptions, setListofOptions] = useState<Equipment[]>([])
    const [keyvar, setkevvar] = useState(0);

    const handleSubmit = () => {
        const weapon = listofoptions.find(w => w.ID === selectedId);
        if (weapon) {
            onSubmit(weapon, cost, costType);
            setSelectedId(null);
            onClose();
        }
    };
    
    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await EquipmentFactory.GetAllEquipment()
            if (options != undefined) {
                setListofOptions(options)
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    return (
        <Modal show={show} key={keyvar} onHide={onClose} className="WbbModalAddItem WbbModalAddItemToStash" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Add Item to Stash</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {listofoptions.map((item) => (
                    <div
                        key={item.ID}
                        className={`select-item ${selectedId === item.ID ? 'selected' : ''}`}
                        onClick={() => setSelectedId(item.ID)}
                    >
                        <span className={'item-name'}>
                            {item.GetTrueName()}
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

export default WbbEquipmentAddCustomStash;
