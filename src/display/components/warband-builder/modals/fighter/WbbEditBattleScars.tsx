import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {
    faArrowRight,
    faCheck,
    faCircleNotch, faMinus,
    faPlus,
    faSkull,
    faTimes,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";
import {WarbandMember} from "../../../../../classes/saveitems/Warband/Purchases/WarbandMember";

interface WbbEditBattleScarsProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (newScars: number) => void;
    fighter: WarbandMember;
    maxScars: number;
}

const WbbEditBattleScars: React.FC<WbbEditBattleScarsProps> = ({ show, onClose, onSubmit, maxScars, fighter }) => {
    const [scars, setScars] = useState<number>(fighter.GetBattleScars());

    useEffect(() => {
        setScars(fighter.GetBattleScars()); // reset state when modal opens
    }, [show, fighter.GetBattleScars()]);

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
                <div>{'Fighter'}</div>
                <div className={'mb-3'}>
                    <strong>
                        {fighter.GetModelName()}
                    </strong>
                    {' - '}{fighter.GetFighterName()}
                </div>


                <label className="form-label">
                    {'Battle Scars: '}

                    {fighter.GetBattleScars()}
                    {scars != fighter.GetBattleScars() &&
                        <>
                            <FontAwesomeIcon icon={faArrowRight} className={`icon-inline-right `}/>
                            <span className={`${scars > fighter.GetBattleScars() ? 'plusscar' : 'minusscar'}`}>
                                {' '}{scars}
                            </span>
                        </>
                    }
                </label>

                <div className="battle-scar-boxes">
                    {Array.from({length: maxScars}, (_, i) => {
                        const index = i + 1;
                        const isChecked = index <= fighter.GetBattleScars();
                        const isSkull = index === maxScars;

                        const plusScar = ((index > fighter.GetBattleScars()) && (index <= scars));
                        const minusScar = ((index <= fighter.GetBattleScars()) && (index > scars));

                        return (
                            <div key={index} className="battle-scar-box">
                                {/* Show skull icon on the last scar */}
                                {isSkull &&
                                    <FontAwesomeIcon icon={faSkull} className={'skull-icon'}/>
                                }

                                { minusScar ? (
                                    <FontAwesomeIcon icon={faTimes} className={'minusscar'} />
                                ): (
                                    <>
                                        {isChecked && <FontAwesomeIcon icon={faTimes}/>}
                                    </>
                                )}

                                {plusScar && <FontAwesomeIcon icon={faTimes} className={'plusscar'}/>}
                            </div>
                        );
                    })}
                </div>


                <div className={'mt-3'}>
                    <button className={'btn btn-secondary me-3 pe-3 ps-3'}
                            onClick={() => setScars(Math.max(0, scars - 1))}
                    >
                        <FontAwesomeIcon icon={faMinus}/>
                    </button>

                    <button className={'btn btn-secondary pe-3 ps-3'}
                            onClick={() => setScars(scars + 1)}
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={scars < 0 || isSubmitting}>
                    {isSubmitting && (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '}/>
                    )}
                    {'Save Battle Scars'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditBattleScars;
