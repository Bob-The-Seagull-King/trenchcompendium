import React, { useState, useEffect } from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import {
    faArrowRight,
    faCheck,
    faCircleNotch,
    faMinus,
    faPlus,
    faTimes,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";
import {WarbandMember} from "../../../../../classes/saveitems/Warband/Purchases/WarbandMember";

interface WbbEditFighterExperienceProps {
    show: boolean;
    onClose: () => void;
    fighter: WarbandMember;
    onSubmit: (newXP: number) => void;
    maxXP: number;
}

const WbbEditFighterExperience: React.FC<WbbEditFighterExperienceProps> = ({ show, onClose, onSubmit, fighter, maxXP }) => {
    const [xp, setXp] = useState<number>(fighter.GetExperiencePoints());

    useEffect(() => {
        setXp(fighter.GetExperiencePoints()); // reset when modal opens
    }, [fighter.GetExperiencePoints()]);


    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        onSubmit(xp);
        onClose();
    });

    return (
        <Modal show={show} onHide={onClose} className="WbbEditFighterExperience" centered>
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
                <div>{'Fighter'}</div>
                <div className={'mb-3'}>
                    <strong>
                        {fighter.GetModelName()}
                    </strong>
                    {' - '}{fighter.GetFighterName()}
                </div>


                <label className="form-label">
                    {'Experience Points: '}

                    {fighter.GetExperiencePoints()}
                    { xp != fighter.GetExperiencePoints() &&
                        <>
                            <FontAwesomeIcon icon={faArrowRight} className={`icon-inline-right `} />
                            <span className={`${xp > fighter.GetExperiencePoints()? 'plusxp' : 'minusxp'}`}>
                                {' '}{xp}
                            </span>
                        </>
                    }
                </label>

                <div className={'xp-boxes'}>
                    {Array.from({length: maxXP}, (_, i) => {
                        const level = i + 1;
                        const isBold = fighter.boldXpIndices.includes(level);
                        const hasXP = level <= fighter.GetExperiencePoints();

                        const plusXP = ((level > fighter.GetExperiencePoints()) && (level <= xp));
                        const minusXP = ((level <= fighter.GetExperiencePoints()) && (level > xp));

                        return (
                            <div
                                key={level}
                                className={`xp-box ${isBold ? 'xp-box-bold' : ''}`}
                            >
                                { minusXP ?(
                                    <FontAwesomeIcon icon={faTimes} className={'minusxp'} />
                                ): (
                                    <>
                                        {hasXP && <FontAwesomeIcon icon={faCheck}/>}
                                    </>
                                )}

                                {plusXP && <FontAwesomeIcon icon={faCheck} className={'plusxp'}/>}

                            </div>
                        );
                    })}
                </div>


                <div className={'mt-3'}>
                    <button className={'btn btn-secondary me-3 pe-3 ps-3'}
                        onClick={() => setXp(Math.max(0, xp - 1))}
                    >
                        <FontAwesomeIcon icon={faMinus}/>
                    </button>

                    <button className={'btn btn-secondary pe-3 ps-3'}
                        onClick={() => setXp(xp + 1)}
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>

                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '}/>
                    )}
                    {'Save Experience'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditFighterExperience;
