import React, { useState, useEffect } from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface WbbEditFighterExperienceProps {
    show: boolean;
    onClose: () => void;
    currentXP: number;
    onSubmit: (newXP: number) => void;
}

const WbbEditFighterExperience: React.FC<WbbEditFighterExperienceProps> = ({ show, onClose, currentXP, onSubmit }) => {
    const [xp, setXp] = useState<number>(currentXP);

    useEffect(() => {
        setXp(currentXP); // reset when modal opens
    }, [currentXP]);

    const handleSubmit = () => {
        onSubmit(xp);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbEditFighterExperience" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Set Experience Points</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <label className="form-label">Experience Points</label>
                <FormControl
                    type="number"
                    min={0}
                    value={xp}
                    onChange={(e) => setXp(parseInt(e.target.value) || 0)}
                    placeholder="Enter XP"
                />

                <div className={''}>
                    {'Current XP: '}{currentXP}
                </div>
                <div className={''}>
                    {'New XP: '}{xp}
                </div>
                {xp !== currentXP && (
                    <div className="">
                        {'Difference: '}
                        {(xp - currentXP) > 0 ? `+${xp - currentXP}` : `${xp - currentXP}`}
                    </div>
                )}

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditFighterExperience;
