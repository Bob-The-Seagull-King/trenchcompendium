import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faArrowRight, faExclamationTriangle, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { getCostType } from '../../../../../utility/functions';

interface WbbEditVictoryPointsProps {
    show: boolean;
    onClose: () => void;
    currentcount: number;
    costtype : number;
    onSubmit: (newcount: number, costtype: number) => void;
}

const WbbEditStashAmountModal: React.FC<WbbEditVictoryPointsProps> = ({
                                                                            show,
                                                                            onClose,
                                                                            currentcount,
                                                                            costtype,
                                                                            onSubmit
                                                                        }) => {

    const [selectedcost, setSelectedcost] = useState<string>('0');
    const [tooNegative, setTooNegative] = useState<boolean>(false);

    const handleSubmit = () => {
        onSubmit(parseInt(selectedcost), costtype);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalEdit WbbModalEditCurrency" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Stashed {getCostType(costtype)}</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <div className={'mb-3'}>
                    {'Stashed ' + getCostType(costtype) + ': '}
                    {currentcount}

                    {parseInt(selectedcost) != 0 &&
                        <>
                            <FontAwesomeIcon icon={faArrowRight} className={`icon-inline-right mb-1`}/>

                            <span className={`${parseInt(selectedcost) > 0 ? 'plus-text' : 'minus-text'} mx-1`}>
                                {' '}{currentcount + parseInt(selectedcost)}
                            </span>

                            {tooNegative &&
                                <FontAwesomeIcon icon={faExclamationTriangle} className={'icon-inline-right-l icon-wraning'}/>
                            }
                        </>
                    }


                </div>

                <div className="mb-3">
                    <label htmlFor={'add-cost-input'}>
                        {'Edit ' + getCostType(costtype) + ' in your stash'}
                    </label>

                    <input
                        type="number"
                        id="add-cost-input"
                        className="form-control mt-1"
                        value={selectedcost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedcost(value);

                            const num = parseInt(value);
                            if (!isNaN(num) && num < 0 && Math.abs(num) > currentcount) {
                                // React to negative value exceeding current count
                                setTooNegative(true)
                            } else {
                                setTooNegative(false)
                            }

                        }}
                        onBlur={() => {
                            if (selectedcost.trim() === '') setSelectedcost('0');
                        }}
                        min={currentcount * -1}
                    />
                    <div className={'form-text'}>
                        {'Use negative numbers to deduct ' + getCostType(costtype) + ' from your stash'}
                    </div>

                    {tooNegative &&
                        <div className={'alert alert-warning my-3'}>
                            <strong>
                                {'Caution'}
                            </strong>
                            <div className={'small'}>
                                {'You can only deduct ' + currentcount + ' ' + getCostType(costtype) + ' from your stash.'}
                            </div>
                        </div>
                    }
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={parseInt(selectedcost) === 0 || tooNegative}
                >
                    Change {getCostType(costtype)}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditStashAmountModal;