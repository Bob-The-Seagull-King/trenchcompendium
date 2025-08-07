import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faArrowRight, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface WbbEditVictoryPointsProps {
    show: boolean;
    onClose: () => void;
    currentVP: number;
    onSubmit: (newVP: number) => void;
}

const WbbEditVictoryPointsModal: React.FC<WbbEditVictoryPointsProps> = ({
                                                                            show,
                                                                            onClose,
                                                                            currentVP,
                                                                            onSubmit
                                                                        }) => {

    const [selectedVP, setSelectedVP] = useState<number | undefined>(currentVP);

    const handleSubmit = () => {
        if(selectedVP) {
            onSubmit(selectedVP);
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbEditVictoryPointsModal" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Victory Points</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <div className={'mb-3'}>
                    {'Victory Points: ' + currentVP}

                    {(selectedVP != undefined && selectedVP > 0 && selectedVP != currentVP) &&
                        <>
                            <FontAwesomeIcon icon={faArrowRight} className={`icon-inline-right mb-1`}/>

                            <span
                                className={`${selectedVP && selectedVP > currentVP ? 'plus-text' : 'minus-text'} mx-1`}
                            >
                                {' '}{selectedVP}
                            </span>
                        </>
                    }
                </div>

                <label htmlFor={'set-victory-points-input'}>
                    {'Set Victory Points'}
                </label>
                <input
                    id={'set-victory-points-input'}
                    type="number"
                    className="form-control"
                    value={selectedVP ?? ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedVP(val === '' ? undefined : parseInt(val));
                    }}
                    onFocus={(e) => e.target.select()}
                />

                {(typeof selectedVP === 'number' && selectedVP < 0) && (
                    <div className={'alert alert-warning my-3'}>
                        <strong>
                            {'Caution'}
                        </strong>
                        <div className={'small'}>
                            {'You cannot have negative Victory points'}
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedVP === currentVP}
                >
                    Update VP
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditVictoryPointsModal;