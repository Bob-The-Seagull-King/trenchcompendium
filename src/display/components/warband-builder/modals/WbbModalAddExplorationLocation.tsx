import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ExplorationOption {
    id: string;
    name: string;
}

interface ExplorationLocation {
    id: string;
    name: string;
    options?: ExplorationOption[];
}

interface WbbModalAddExplorationLocationProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (location: ExplorationLocation, selectedOptions: ExplorationOption[]) => void;
}

const WbbModalAddExplorationLocation: React.FC<WbbModalAddExplorationLocationProps> = ({ show, onClose, onSubmit }) => {
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

    // @TODO: get actual location data
    // Sample data – replace with actual locations & options
    const availableLocations: ExplorationLocation[] = [
        {
            id: 'loc1',
            name: 'Moonshine Stash',
            options: [
                { id: 'opt1', name: 'Distribute' },
                { id: 'opt2', name: 'Destroy' }
            ]
        },
        {
            id: 'loc2',
            name: 'Heavy Weapons Cache',
            options: [
                { id: 'opt3', name: 'Surplus' },
                { id: 'opt4', name: 'Specialise' }
            ]
        },
        {
            id: 'loc3',
            name: 'Fallen Soldier' // No options
        }
    ];

    const selectedLocation = availableLocations.find(loc => loc.id === selectedLocationId);

    const handleSubmit = () => {
        if (selectedLocation) {
            const selectedOptions = selectedLocation.options?.filter(opt => opt.id === selectedOptionId) || [];
            onSubmit(selectedLocation, selectedOptions);
            setSelectedLocationId(null);
            setSelectedOptionId(null);
            onClose();
        }
    };

    const isSubmitDisabled = !selectedLocationId ||
        (selectedLocation?.options && selectedLocation.options.length > 0 && !selectedOptionId);

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddExplorationLocation" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Exploration Location</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="exploration-locations">
                    <h6>Select Exploration Location:</h6>
                    {availableLocations.map((loc) => (
                        <div
                            key={loc.id}
                            className={`select-item ${selectedLocationId === loc.id ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedLocationId(loc.id);
                                setSelectedOptionId(null); // reset when switching location
                            }}
                        >
                            {loc.name}
                        </div>
                    ))}
                </div>

                {selectedLocation?.options && (
                    <div className="exploration-options mt-3">
                        <h6>Select an Option for {selectedLocation.name}:</h6>
                        {selectedLocation.options.map(opt => (
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
                    Add Location
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddExplorationLocation;
