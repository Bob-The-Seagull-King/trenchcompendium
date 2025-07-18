import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Injury } from '../../../../../classes/feature/ability/Injury';
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";


interface WbbModalAddInjuryProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (injury: Injury) => void;
    fighter : RealWarbandPurchaseModel
}

const WbbModalAddInjury: React.FC<WbbModalAddInjuryProps> = ({ show, onClose, onSubmit, fighter }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [available, setAvailable] = useState<Injury[]>([]);
    const [keyvar, setkevvar] = useState(0);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        const selected = available.find((i) => i.ID === selectedId);
        if (selected) {
            onSubmit(selected);
            setSelectedId(null); // reset
            onClose();
        }
    });


    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await fighter.model.GetModelInjuryOptions()
            if (options != undefined) {
                setAvailable(options)
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddInjury" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Injury</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body key={keyvar}>
                {available.map((injury) => (
                    <div
                        key={injury.ID}
                        className={`select-item ${selectedId === injury.ID ? 'selected' : ''}`}
                        onClick={() => setSelectedId(injury.ID)}
                    >
                        <span className="item-name">{injury.Name}</span>
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
                    {'Add Injury'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddInjury;
