import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../../../classes/options/StaticOption';
import { SelectedOption } from '../../../../../classes/options/SelectedOption';
import WbbSelectItemEquipment from "../../micro-elements/WbbSelectItem";
import {getCostType} from "../../../../../utility/functions";

interface WbbEditSelectionProps {
    show: boolean;
    onClose: () => void;
    currentChoice: IChoice | null;
    onSubmit: (newGoetic: IChoice | null) => void;
    choiceparent : SelectedOption
}

const WbbEditSelectionModal: React.FC<WbbEditSelectionProps> = ({
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
        choiceparent.Option.Selections.length > 0 && // optional: leere Liste nicht als "true" werten
        choiceparent.Option.Selections.every((s: any) => getType(s?.value) === 'FactionEquipmentRelationship');

    return (
        <div onClick={(e) => {
            e.stopPropagation();
        }}>
            <Modal show={show} onHide={onClose} className="WbbModal WbbModalSelect WbbEditSelectionModal" centered>
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
                        {choiceparent.Option.Selections.map((option, index) => (
                            <React.Fragment key={index}>
                            {/* Show equipment selection when all options are equipment */}
                            {allFER ? (
                                <WbbSelectItemEquipment
                                    key={`select-item-${option.id}`}
                                    id={option.id}
                                    title={option.value.Name}
                                    opened={openedID === option.id}
                                    selected={(selectedOption?.id === option.id) && !openedID}
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

                {/* If all options are equipment -> No need to show the footer*/}
                {!allFER &&
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
                }
            </Modal>
        </div>
    );
};

export default WbbEditSelectionModal;