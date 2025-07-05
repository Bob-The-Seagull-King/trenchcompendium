import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Skill } from '../../../../../classes/feature/ability/Skill';
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';


interface WbbModalAddAdvancementProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (advancement: Skill) => void;
    fighter : RealWarbandPurchaseModel
}

const WbbModalAddAdvancement: React.FC<WbbModalAddAdvancementProps> = ({ show, onClose, onSubmit, fighter }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [available, setAvailable] = useState<Skill[]>([]);
    const [keyvar, setkevvar] = useState(0);

    const handleSubmit = () => {
        const selected = available.find((a) => a.ID === selectedId);
        if (selected) {
            onSubmit(selected);
            setSelectedId(null);
            onClose();
        }
    };
        
    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await fighter.model.GetModelSkillOptions()
            if (options != undefined) {
                setAvailable(options)
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddAdvancement" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Advancement</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {available.map((adv) => (
                    <div
                        key={adv.ID}
                        className={`select-item ${selectedId === adv.ID ? 'selected' : ''}`}
                        onClick={() => setSelectedId(adv.ID)}
                    >
                        <div className="item-name">{adv.GetTrueName()}</div>

                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId}>
                    Add Advancement
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddAdvancement;
