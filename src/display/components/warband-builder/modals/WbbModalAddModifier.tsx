import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ModifierOption {
    id: string;
    name: string;
    description?: string;
}

interface Modifier {
    id: string;
    name: string;
    options?: ModifierOption[];
    description?: string;
}

interface WbbModalAddModifierProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (modifier: Modifier, selectedOption: ModifierOption | null) => void;
}

const WbbModalAddModifier: React.FC<WbbModalAddModifierProps> = ({ show, onClose, onSubmit }) => {
    const [selectedModifierId, setSelectedModifierId] = useState<string | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

    // @TODO: get actual modifier Data
    // Sample modifiers – replace with actual data
    const availableModifiers: Modifier[] = [
        {
            id: 'mod1',
            name: 'Moonshine Stash',
            options: [
                {
                    id: 'opt1',
                    name: 'Distribute',
                    description: 'During the next battle, your warband rolls Morale checks with +2 DICE. (Trench Pilgrims and New Antioch only)'
                },
                {
                    id: 'opt2',
                    name: 'Destroy',
                    description: 'Up to two of your ELITES each gain +1 Experience Point. (Trench Pilgrims, New Antioch and IronSulatante only)'
                }
            ]
        },
        { // no options
            id: 'mod2',
            name: 'Pot of Manna',
            description: ' You find a cup blessed by God that provides endless nourishment. Whenever your warband rolls to explore, it gains an additional 10 ducats from looting due to the reduced cost of rations'
        },
        {
            id: 'mod3',
            name: 'Exploration Skill ',
            options: [
                {
                    id: 'opt1',
                    name: 'Extra Dice',
                    description: ': Roll one extra Exploration Die.'
                },
                {
                    id: 'opt2',
                    name: 'Duplicate',
                    description: ': After you roll, select any Exploration Die and add another die with an identical result, including any modifications, to your total.'
                }
            ]
        }
    ];

    const selectedModifier = availableModifiers.find(mod => mod.id === selectedModifierId);
    const selectedOption = selectedModifier?.options?.find(opt => opt.id === selectedOptionId) || null;

    const handleSubmit = () => {
        if (selectedModifier) {
            onSubmit(selectedModifier, selectedOption);
            setSelectedModifierId(null);
            setSelectedOptionId(null);
            onClose();
        }
    };

    const isSubmitDisabled =
        !selectedModifierId ||
        (selectedModifier?.options && selectedModifier.options.length > 0 && !selectedOptionId);

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddModifier" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Warband Modifier</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="modifier-list">
                    <h6>Choose a Modifier:</h6>
                    {availableModifiers.map((mod) => (
                        <div
                            key={mod.id}
                            className={`select-item ${selectedModifierId === mod.id ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedModifierId(mod.id);
                                setSelectedOptionId(null); // reset option
                            }}
                        >
                            {mod.name}
                        </div>
                    ))}
                </div>

                {selectedModifier?.options && (
                    <div className="modifier-options mt-3">
                        <h6>Select one option:</h6>
                        {selectedModifier.options.map((opt) => (
                            <div
                                key={opt.id}
                                className={`select-item ${selectedOptionId === opt.id ? 'selected' : ''}`}
                                onClick={() => setSelectedOptionId(opt.id)}
                            >
                                {opt.name}
                            </div>
                        ))}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitDisabled}>
                    Add Modifier
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddModifier;
