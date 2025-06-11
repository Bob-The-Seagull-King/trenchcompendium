import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

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
    const [selectedVP, setSelectedVP] = useState<number>(currentVP);

    const handleSubmit = () => {
        onSubmit(selectedVP);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbEditVictoryPointsModal" centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Victory Points</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h6>Set Victory Points</h6>
                <input
                    type="number"
                    className="form-control"
                    value={selectedVP}
                    onChange={(e) => setSelectedVP(parseInt(e.target.value) || 0)}
                    min={0}
                />
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