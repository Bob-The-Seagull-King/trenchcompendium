import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { makestringpresentable } from '../../../../../utility/functions';
import { GetStatAsFullString, ModelStatistics } from '../../../../../classes/feature/model/ModelStats';
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';

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

    const handleSubmit = () => {
        if (selectedStatus) {
            onSubmit(selectedStatus);
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbEditFighterStatus" centered>
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
                <h6>{'Select Fighter Status'}</h6>
                {options.map((stat) => (
                    <div
                        key={stat.toString()}
                        className={`select-item ${selectedStatus === stat ? 'selected' : ''}`}
                        onClick={() => setSelectedStatus(stat)}
                    >
                        
                        {stat? GetStatAsFullString(stat) : "-"}
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={selectedStatus === currentStatus}>
                    Update Stat Profile
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditFighterStatProfile;
