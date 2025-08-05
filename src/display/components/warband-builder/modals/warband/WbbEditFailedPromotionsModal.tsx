import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
    faArrowRight,
    faCheck,
    faGift,
    faMinus,
    faPlus,
    faSkull,
    faTimes,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface WbbEditFailedPromotionModalProps {
    show: boolean;
    onClose: () => void;
    currentFails: number;
    onSubmit: (newVP: number) => void;
}

const WbbEditFailedPromotionsModal: React.FC<WbbEditFailedPromotionModalProps> = ({
                                                                            show,
                                                                            onClose,
                                                                            currentFails,
                                                                            onSubmit
                                                                        }) => {

    const [failedRolls, setFailedRolls] = useState<number>(currentFails);

    const maxFailedPromitions = 6

    const handleSubmit = () => {
        onSubmit(failedRolls);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalEdit WbbEditFailedPromotionModal" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Failed Promotions</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <h6>Set Failed Promotions</h6>

                <label className="form-label">
                    {currentFails}
                    {failedRolls != currentFails &&
                        <>
                            <FontAwesomeIcon icon={faArrowRight} className={`icon-inline-right `}/>
                            <span className={`${failedRolls > currentFails ? 'plusscar' : 'minusscar'}`}>
                                {' '}{failedRolls}
                            </span>
                        </>
                    }
                </label>

                <div className="failed-promo-boxes">
                    {Array.from({length: maxFailedPromitions}, (_, i) => {
                        const index = i + 1;
                        const isChecked = index <= currentFails;
                        const isSkull = index === maxFailedPromitions;

                        const plusScar = ((index > currentFails) && (index <= failedRolls));
                        const minusScar = ((index <= currentFails) && (index > failedRolls));

                        return (
                            <div key={index} className="failed-promo-box">
                                {/* Show skull icon on the last scar */}
                                {isSkull &&
                                    <FontAwesomeIcon icon={faGift} className={'final-icon'}/>
                                }

                                {minusScar ? (
                                    <FontAwesomeIcon icon={faCheck} className={'minusfailed'}/>
                                ) : (
                                    <>
                                        {isChecked && <FontAwesomeIcon icon={faCheck}/>}
                                    </>
                                )}

                                {plusScar && <FontAwesomeIcon icon={faCheck} className={'plusfailed'}/>}
                            </div>
                        );
                    })}
                </div>

                <div className={'mt-3'}>
                    <button className={'btn btn-secondary me-3 pe-3 ps-3'}
                            onClick={() => setFailedRolls(Math.max(0, failedRolls - 1))}
                    >
                        <FontAwesomeIcon icon={faMinus}/>
                    </button>

                    <button className={'btn btn-secondary pe-3 ps-3'}
                            onClick={() => setFailedRolls(failedRolls + 1)}
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>

                <p className={'my-3 small'}>
                    <i>
                        {'If in total you fail 5 Promotion rolls in a row (regardless how the dice are distributed amongst the models), the 6th one will always succeed. This re-sets the counter.'}
                    </i>
                </p>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={failedRolls === currentFails}
                >
                    Update Failed Promotions
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditFailedPromotionsModal;