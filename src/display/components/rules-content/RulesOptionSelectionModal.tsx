import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../classes/options/StaticOption';
import { SelectedOption } from '../../../classes/options/SelectedOption';
import { StaticOption } from '../../../classes/options/StaticOption';

interface RulesEditSelectionProps {
    show: boolean;
    onClose: () => void;
    currentChoice: IChoice | null;
    onSubmit: (newGoetic: IChoice | null) => void;
    choiceparent : StaticOption
}

const RulesOptionSelection: React.FC<RulesEditSelectionProps> = ({
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
        <div onClick={(e) => {
            e.stopPropagation();
        }}>
            <Modal show={show} onHide={onClose} className="RulesOptionSelection RulesOptionSelection-Modal" centered>
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
                        {choiceparent.Selections.map((discipline) => (
                            <div
                                key={discipline.id + discipline.display_str}
                                className={`select-item ${selectedGoetic === discipline ? 'selected' : ''}`}
                                onClick={() => setSelectedGoetic(discipline)}
                            >
                                {discipline.display_str}
                            </div>
                        ))}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={selectedGoetic === currentChoice}>
                        Update Discipline
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RulesOptionSelection;