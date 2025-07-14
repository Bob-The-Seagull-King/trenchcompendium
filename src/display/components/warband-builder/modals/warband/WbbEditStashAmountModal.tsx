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
                <div className="mb-3">
                    <label htmlFor={'add-cost-input'}>
                        {'Add X '+ getCostType(costtype) + ' to your stash'}
                    </label>

                    <input
                        type="number" id={'add-cost-input'}
                        className="form-control"
                        value={selectedcost}
                        onChange={(e) => setSelectedcost(parseInt(e.target.value) || 0)}
                        min={currentcount * -1}
                    />

                    <div className="form-text">Current {getCostType(costtype)}: {currentcount} New {getCostType(costtype)}: {currentcount + selectedcost}</div>
                </div>
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