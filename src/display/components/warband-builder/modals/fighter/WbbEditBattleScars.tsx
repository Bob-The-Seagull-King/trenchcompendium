import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";

interface WbbEditBattleScarsProps {
    show: boolean;
    onClose: () => void;
    currentScars: number;
    onSubmit: (newScars: number) => void;
}

const WbbEditBattleScars: React.FC<WbbEditBattleScarsProps> = ({ show, onClose, currentScars, onSubmit }) => {
    const [scars, setScars] = useState<number>(currentScars);

    useEffect(() => {
        setScars(currentScars); // reset state when modal opens
    }, [show, currentScars]);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        onSubmit(scars);
        onClose();
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setScars(isNaN(value) ? 0 : value);
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalEdit WbbEditBattleScars" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Battle Scars</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <Form.Group controlId="battleScarsInput">
                    <Form.Label>Number of Battle Scars</Form.Label>
                    <Form.Control
                        type="number"
                        value={scars}
                        min={0}
                        onChange={handleChange}
                    />
                </Form.Group>

                {scars !== currentScars && (
                    <div className="">
                        {'Difference: '}
                        {(scars - currentScars) > 0 ? `+${scars - currentScars}` : `${scars - currentScars}`}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={scars < 0 || isSubmitting}>
                    {isSubmitting && (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    )}
                    {'Save Battle Scars'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditBattleScars;
