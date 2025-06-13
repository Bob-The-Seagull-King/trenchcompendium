import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faChevronRight, faLock, faLockOpen, faXmark} from "@fortawesome/free-solid-svg-icons";

interface WbbEditCampaignCycleProps {
    show: boolean;
    onClose: () => void;
    currentCampaignCycle: number;
    currentCampaignCycleMax: number;
    onSubmit: (newCycle: number, newCycleMax: number) => void;
}

const WbbEditCampaignCycleModal: React.FC<WbbEditCampaignCycleProps> = ({
                                                                            show,
                                                                            onClose,
                                                                            currentCampaignCycle,
                                                                            currentCampaignCycleMax,
                                                                            onSubmit
                                                                        }) => {
    const [selectedCycle, setSelectedCycle] = useState<number>(currentCampaignCycle);
    const [cycleMax, setCycleMax] = useState<number>(currentCampaignCycleMax);

    const cycleOptions = Array.from({ length: currentCampaignCycleMax }, (_, i) => i + 1);

    const [showCycleModal1, setshowCycleModal1] = useState<boolean>(show);
    const [showCycleModal2, setshowCycleModal2] = useState<boolean>(false);

    React.useEffect(() => {
        if (show) {
            setshowCycleModal1(true);
            setshowCycleModal2(false);
        }
    }, [show]);


    // select a new active cycle
    const handleSelectCycle = () => {
        onSubmit(selectedCycle, cycleMax);
        handleClose();
        onClose();
    };

    // Advance to next cycle
    const handleSubmitAdvance = () => {
        onSubmit(cycleMax+1, cycleMax+1); // submit new max cycle

        setSelectedCycle(cycleMax+1); // update current cycle in modals
        setCycleMax(cycleMax+1); // update max cycle in modals

        handleClose();
        onClose();
    };

    // closes the modals
    const handleClose = () => {
        setshowCycleModal1(false);
        setshowCycleModal2(false);
        onClose();
    };

    // resets the modal UI on cancellation
    const handleAbort = () => {
        handleClose();
        setSelectedCycle(currentCampaignCycle); // reset selection to current cycle value
    };

    return (
        <>
            <Modal show={showCycleModal1} onHide={handleAbort} className="WbbEditCampaignCycleModal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Edit Campaign Cycle</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={handleAbort}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'cycle-hint-above'}>
                        <strong>
                            {'Currently Viewing: '}
                        </strong>

                        {'Cycle ' + currentCampaignCycle}
                    </div>

                    <div className="cycle-selection-wrap">
                        {cycleOptions.map((cycle) => (
                            <div
                                key={cycle}
                                className={`select-item ${selectedCycle === cycle ? 'selected' : ''}`}
                                onClick={() => setSelectedCycle(cycle)}
                            >
                                {`Cycle ${cycle}`}

                                {(selectedCycle === cycle) &&
                                    <FontAwesomeIcon icon={faCheck} className=""/>
                                }

                                { (cycleMax == cycle ) ? (
                                    <>
                                        <FontAwesomeIcon icon={faLockOpen} className="icon-inline-right"/>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faLock} className="icon-inline-right"/>
                                    </>
                                )}
                            </div>
                        ))}

                        <div className={'select-item select-item-advance'}
                             onClick={() => {
                                 setshowCycleModal1(false);
                                 setshowCycleModal2(true);
                             }}
                        >
                            {'Advance to Cycle ' + (cycleMax + 1)}

                            <FontAwesomeIcon icon={faChevronRight} className=""/>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAbort}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleSelectCycle();
                        }}
                        disabled={selectedCycle === currentCampaignCycle}
                    >
                        Update Cycle
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showCycleModal2} onHide={handleAbort} className="WbbEditCampaignCycleModal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{'Advance to Cylce ' + (cycleMax + 1)} </Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={handleAbort}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'cycle-hint-above'}>
                        {'Do you want to advance to the next Campaign cycle?'}
                    </div>

                    <br/>
                    <div className={'cycle-hint-below'}>
                        <ul>
                            <li>{'The Warband details of the previous round will be copied.'}</li>
                            <li>{'The previous rounds cannot be edited after you advance to the next round.'}</li>
                            <li>{'Make sure you have tracked all advancements, injuries, exploration etc. before advancing to the next round.'}</li>
                        </ul>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAbort}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmitAdvance}
                    >
                        {'Advance to cycle ' + (cycleMax + 1)}
                        <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right"/>

                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default WbbEditCampaignCycleModal;
