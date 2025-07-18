import { useWarband } from '../../../../context/WarbandContext';
import { FactionEquipmentRelationship } from '../../../../classes/relationship/faction/FactionEquipmentRelationship';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { containsTag, getCostType } from '../../../../utility/functions';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useModalSubmitWithLoading} from "../../../../utility/useModalSubmitWithLoading";

interface Item {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddItemToStashProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (weapon: FactionEquipmentRelationship) => void;
    category : string;
    exploration : boolean;
}

const WbbModalAddItemToStash: React.FC<WbbModalAddItemToStashProps> = ({ show, onClose, onSubmit, category, exploration }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    
    const { warband } = useWarband();
    const [listofoptions, setListofOptions] = useState<FactionEquipmentRelationship[]>([])
    const [keyvar, setkevvar] = useState(0);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        const weapon = listofoptions.find(w => w.ID === selectedId);
        if (weapon) {
            onSubmit(weapon);
            setSelectedId(null);
            onClose();
        }
    });

    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await warband?.warband_data.GetFactionEquipmentOptions(exploration)
            if (options != undefined) {
                if (category.length > 0) {
                    setListofOptions(options.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                } else {
                    setListofOptions(options.filter((item : FactionEquipmentRelationship) => containsTag(item.Tags, 'exploration_only')));
                }
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    return (
        <Modal show={show} key={keyvar} onHide={onClose} className="WbbModalAddItem WbbModalAddItemToStash" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Add Item to Stash</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {listofoptions.map((item) => (
                    <div
                        key={item.ID}
                        className={`select-item ${selectedId === item.ID ? 'selected' : ''}`}
                        onClick={() => setSelectedId(item.ID)}
                    >
                        <span className={'item-name'}>
                            {item.EquipmentItem.GetTrueName()}
                        </span>
                        <span className={'item-cost'}>
                            {item.Cost &&
                                <>
                                    {item.Cost + " " + getCostType(item.CostType)}
                                </>
                            }
                        </span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>

                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId || isSubmitting}>
                    {isSubmitting ? (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    ): (
                        <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'} />
                    )}
                    {'Add item'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddItemToStash;
