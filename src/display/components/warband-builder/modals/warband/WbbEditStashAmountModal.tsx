import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { getCostType } from '../../../../../utility/functions';

interface WbbEditVictoryPointsProps {
    show: boolean;
    onClose: () => void;
    currentcount: number;
    costtype : number;
    onSubmit: (newcount: number, costtype: number) => void;
}

const WbbEditStashAmountModal: React.FC<WbbEditVictoryPointsProps> = ({
                                                                            show,
                                                                            onClose,
                                                                            currentcount,
                                                                            costtype,
                                                                            onSubmit
                                                                        }) => {
    const [selectedcost, setSelectedcost] = useState<number>(0);

    const handleSubmit = () => {
        onSubmit(selectedcost, costtype);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbEditVictoryPointsModal" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Add Stashed {getCostType(costtype)}</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <input
                    type="number"
                    className="form-control"
                    value={selectedcost}
                    onChange={(e) => setSelectedcost(parseInt(e.target.value) || 0)}
                    min={currentcount * -1}
                />
                <h6>Current {getCostType(costtype)}: {currentcount} New {getCostType(costtype)}: {currentcount + selectedcost}</h6>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedcost === 0}
                >
                    Add {getCostType(costtype)}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditStashAmountModal;