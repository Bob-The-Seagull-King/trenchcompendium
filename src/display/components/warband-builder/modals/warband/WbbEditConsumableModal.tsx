import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../../../classes/options/StaticOption';
import { SelectedOption } from '../../../../../classes/options/SelectedOption';
import { WarbandConsumable } from '../../../../../classes/saveitems/Warband/WarbandConsumable';

interface WbbEditSelectionProps {
    show: boolean;
    onClose: () => void;
    currentChoice: IChoice | null;
    onSubmit: (newGoetic: IChoice | null) => void;
    choiceparent : WarbandConsumable
}

const WbbEditConsumableModal: React.FC<WbbEditSelectionProps> = ({
                                                                                show,
                                                                                onClose,
                                                                                currentChoice,
                                                                                onSubmit,
                                                                                choiceparent
                                                                            }) => {
    const [selectedGoetic, setSelectedGoetic] = useState<IChoice | null>(currentChoice);

    const handleSubmit = () => {
        onSubmit(selectedGoetic);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbEditGoeticSelectionModal" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Option</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <h6>Select Option</h6>

                <div className={'goetic-selection-wrap'}>
                {choiceparent.Options.map((discipline) => (
                        <div
                            key={discipline.id + discipline.display_str}
                            className={`select-item ${selectedGoetic === discipline ? 'selected' : ''}`}
                            onClick={() => setSelectedGoetic(discipline)}
                        >
                            {discipline.display_str}
                        </div>
                    ))}
                    {choiceparent.Options.length == 0 &&
                        <div
                            className="select-item"
                        >
                            {"No options are currently available to select"}
                        </div>
                    }
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={selectedGoetic === currentChoice}>
                    Update Selection
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditConsumableModal;