import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCheckCircle, faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { makestringpresentable } from '../../../../../utility/functions';
import { GetStatAsFullString, ModelStatistics } from '../../../../../classes/feature/model/ModelStats';
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";

interface WbbEditFighterStats {
    show: boolean;
    fighter : RealWarbandPurchaseModel;
    onClose: () => void;
    currentStatus: ModelStatistics | null;
    options : ModelStatistics[];
    onSubmit: (newStatus: ModelStatistics) => void;
}

const WbbEditFighterStatProfile: React.FC<WbbEditFighterStats> = ({
                                                                       show,
                                                                       fighter,
                                                                       onClose,
                                                                       currentStatus,
                                                                       options,
                                                                       onSubmit
                                                                   }) => {
    const [selectedStatus, setSelectedStatus] = useState<ModelStatistics | null>(currentStatus);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        if (selectedStatus) {
            onSubmit(selectedStatus);
            onClose();
        }
    });


    return (
        <Modal show={show} onHide={onClose} className="WbbModal WbbModalSelect WbbEditFighterStatProfile" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Fighter Stat Profile</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {options.map((stat) => (
                    <div
                        key={stat.toString()}
                        className={`select-item ${selectedStatus === stat ? 'selected' : ''}`}
                        onClick={() => setSelectedStatus(stat)}
                    >
                        <span>
                            {currentStatus === stat &&
                                <FontAwesomeIcon icon={faCheckCircle} className={'icon-inline-left-l'}/>
                            }
                            {stat ? GetStatAsFullString(stat) : "-"}
                        </span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={(selectedStatus === currentStatus) || isSubmitting}>
                    {isSubmitting && (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    )}
                    {'Update Stat Profile'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditFighterStatProfile;
