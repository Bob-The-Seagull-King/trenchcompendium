import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faCircleNotch, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useModalSubmitWithLoading } from "../../../../utility/useModalSubmitWithLoading";
import { useWbbMode } from "../../../../context/WbbModeContext";
import {useWarband} from "../../../../context/WarbandContext";
import {makestringpresentable} from "../../../../utility/functions";
import WbbGeneralCollapse from "../WbbGeneralCollapse";
import {returnDescription} from "../../../../utility/util";

interface Fighter {
    id: string;
    name: string;
    modelName: string;
}

interface SkillOption {
    id: string;
    name: string;
    available: boolean;
}

interface WbbExploration_Selection_Fruit_Props {
    onChange?: (selected: Fighter | null, skill: string | null) => void;
}

const WbbExploration_Selection_Fruit: React.FC<
    WbbExploration_Selection_Fruit_Props
> = ({ onChange }) => {
    const { edit_mode } = useWbbMode();
    const { warband } = useWarband();

    const fighters: Fighter[] = [
        { id: "f1", name: "Sergeant Alaric", modelName: "Janissary" },
        { id: "f2", name: "Brother Malrick", modelName: "Azeb" },
        { id: "f3", name: "Scout Elena", modelName: "Janissary" },
        { id: "f4", name: "Initiate Corvus", modelName: "Azeb" },
        { id: "f5", name: "Veteran Kael", modelName: "Janissary" },
    ];

    const skills: SkillOption[] = [
        { id: "skill_blessing", name: "Blessing", available: true },
        { id: "skill_vision", name: "Vision", available: true },
        { id: "skill_wrath", name: "Wrath", available: false },
    ];

    const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        if (onChange) {
            onChange(selectedFighter, selectedSkill);
        }
        setShowModal(false);
    });

    const handleSelectFighter = (fighter: Fighter) => {
        const updated = selectedFighter?.id === fighter.id ? null : fighter;
        setSelectedFighter(updated);
        setSelectedSkill(null); // reset skill on fighter change
        if (onChange) {
            onChange(updated, null);
        }
    };

    return (
        <div className="WbbExploration_Selection_Fruit mb-3">
            <div className="fw-bold mb-2">Choose One Fighter</div>

            {fighters.map((fighter) => {
                const isSelected = selectedFighter?.id === fighter.id;

                return (
                    <div className="form-check" key={fighter.id}>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="angelic-instrument-fighter"
                            checked={isSelected}
                            onClick={() => handleSelectFighter(fighter)}
                            readOnly
                        />
                        <label
                            className="form-check-label"
                            onClick={() => handleSelectFighter(fighter)}
                            style={{ cursor: "pointer" }}
                        >
                            {fighter.name !== '' && <>{fighter.name}{' - '}</>}
                            {fighter.modelName}
                        </label>
                    </div>
                );
            })}

            {selectedFighter && (
                <div className="mt-3">
                    <div className="fw-bold mb-2">Choose One Skill</div>

                    <div className="skill-select">
                        <div className={'skill-select-string'}>
                            {selectedSkill ? (
                                <>{skills.find((s) => s.id === selectedSkill)?.name}</>
                            ) : (
                                <>-</>
                            )}
                        </div>

                        {edit_mode && (
                            <div className={'btn btn-primary'} onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={selectedSkill ? faArrowsRotate : faPlus}
                                                 className={'icon-inline-left-l'} />
                                {selectedSkill ? "Change Skill" : "Select Skill"}
                            </div>
                        )}
                    </div>

                    {/* See for reference: src/display/components/warband-builder/modals/fighter/WbbAddAdvancement.tsx */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}
                           className="WbbModal WbbModalSelect WbbModalAddSkill" centered>
                        <Modal.Header closeButton={false}>
                            <Modal.Title>Select Skill</Modal.Title>

                            <FontAwesomeIcon
                                icon={faXmark}
                                className="modal-close-icon"
                                role="button"
                                onClick={() => setShowModal(false)}
                            />
                        </Modal.Header>

                        <Modal.Body>
                            {warband?.warband_data.GetPatron() == null &&
                                <div className="alert alert-warning my-4 mx-4">
                                    {'No patron selected'}
                                </div>
                            }

                            {/* @TODO: collapse for each table */}
                            <WbbGeneralCollapse
                                title={'Melee and strength skills'}
                                initiallyOpen={false}
                                nopad={true}
                            >
                                {/* @TODO: map skills in table */}
                                {skills.map((skill) => (
                                    <React.Fragment key={skill.id}>
                                        <div
                                            className={`select-item ${selectedSkill === skill.id ? 'selected' : ''} ${!skill.available ? 'disabled' : ''}`}
                                            onClick={() => skill.available && setSelectedSkill(skill.id)}
                                        >
                                            {/* @TODO: Add Skill number and name */}
                                            <span className={'item-name'}>
                                                {'5 - '}
                                                {skill.name}
                                            </span>
                                        </div>

                                        {selectedSkill === skill.id && (
                                            <div className={'select-item-details'}>
                                                {/* @TODO: add Skill description */}
                                                {'Enemy models suffer -1 DICE to hit this model with melee attacks.\n'}
                                            </div>
                                        )}
                                </React.Fragment>
                            ))}
                        </WbbGeneralCollapse>

                    </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSubmit} disabled={!selectedSkill || isSubmitting}>
                                {isSubmitting ? (
                                    <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '}/>
                                ) : (
                                    <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'}/>
                                )}
                                {'Add Skill'}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default WbbExploration_Selection_Fruit;
