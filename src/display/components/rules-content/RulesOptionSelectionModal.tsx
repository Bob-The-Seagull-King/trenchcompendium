import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../classes/options/StaticOption';
import { SelectedOption } from '../../../classes/options/SelectedOption';
import { StaticOption } from '../../../classes/options/StaticOption';
import {getCostType} from "../../../utility/functions";
import WbbSelectItemEquipment from "../warband-builder/micro-elements/WbbSelectItem";

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
    const [selectedOption, setSelectedOption] = useState<IChoice | null>(currentChoice);
    const [openedID, setOpenedID] = useState<string | null>(null);

    const handleSubmit = ( option : IChoice ) => {
        onSubmit(option);
        onClose();
    };

    // Type helper
    function getType(v: any): string | undefined {
        return v?.__typename ?? v?.type ?? v?.kind ?? v?.constructor?.name;
    }

    const allFER =
        choiceparent.Selections.length > 0 && // optional: leere Liste nicht als "true" werten
        choiceparent.Selections.every((s: any) => getType(s?.value) === 'FactionEquipmentRelationship');

    return (
        <div onClick={(e) => {
            e.stopPropagation();
        }}>
            <Modal show={show} onHide={onClose} className="WbbModalAddItem" centered>
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
                    <div className={'select-items-wrap'}>
                        {choiceparent.Selections.map((option, index) => (
                            <React.Fragment key={index}>
                                {allFER ? (
                                    <WbbSelectItemEquipment
                                        key={`select-item-${option.id}`}

                                        id={option.id}
                                        title={option.value.Name}
                                        opened={openedID === option.id}
                                        available={true}
                                        onClick={() => {
                                            setOpenedID(option.id === openedID ? null : option.id)
                                        }}
                                        equipment={option.value.EquipmentItem}
                                        isSubmitting={false}
                                        onSubmit={() => {
                                            handleSubmit(option);
                                        }}
                                        submitBtnString={'Choose Equipment'}
                                        cost={option.value.Cost + " " + getCostType(option.value.CostType)}
                                    />
                                ):(
                                    <div
                                        key={option.id + option.display_str}
                                        className={`select-item ${selectedOption === option ? 'selected' : ''}`}
                                        onClick={() => setSelectedOption(option)}
                                    >
                                        {option.display_str}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>

                    {selectedOption ? (
                        <Button variant="primary" onClick={() => handleSubmit(selectedOption)} disabled={selectedOption === currentChoice}>
                            Save Option
                        </Button>
                    ):(
                        <Button variant="primary" disabled={selectedOption === currentChoice}>
                            Save Option
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RulesOptionSelection;