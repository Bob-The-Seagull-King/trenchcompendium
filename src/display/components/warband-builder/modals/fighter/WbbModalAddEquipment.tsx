import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { FactionEquipmentRelationship } from '../../../../../classes/relationship/faction/FactionEquipmentRelationship';
import { getCostType } from '../../../../../utility/functions';
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";
import { useWarband } from '../../../../../context/WarbandContext';

interface EquipmentItem {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddEquipmentProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (equipment: FactionEquipmentRelationship) => void;
    fighter : RealWarbandPurchaseModel
    category : string
}

const WbbModalAddEquipment: React.FC<WbbModalAddEquipmentProps> = ({ show, onClose, onSubmit, fighter, category }) => {
    const [selectedID, setSelectedID] = useState<string | null>(null);

    const { warband } = useWarband();
    const [available, setAvailable] = useState<FactionEquipmentRelationship[]>([]);
    const [fullavailable, setFullAvailable] = useState<FactionEquipmentRelationship[]>([]);
    const [keyvar, setkevvar] = useState(0);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        const selected = available.find(w => w.ID === selectedID);
        if (selected) {
            onSubmit(selected);
            setSelectedID(null)
            onClose();
        }
    });
    
    
    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await fighter.model.GetModelEquipmentOptions()
            const fulloptions = await fighter.model.GetModelEquipmentOptions(true)
            if (options != undefined) {
                setAvailable(options.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                setFullAvailable(fulloptions.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    return (
        <Modal key={keyvar} show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddEquipment" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Equipment</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {fullavailable.map((item) => (
                    <div
                        key={item.ID}
                        className={`select-item ${selectedID === item.ID ? 'selected' : ''} ${available.includes(item)? '' : 'disabled'}`}
                        onClick={() => {
                            if (available.includes(item)) {
                                setSelectedID(item.ID)
                            }
                        }}
                    >
                        <span className={'item-left'}>
                            <span className={'item-name'}>
                                {item.EquipmentItem.GetTrueName()}
                            </span>

                            
                            
                            
                        </span>

                        <span className={'item-right'}>
                            <span className={'item-cost'}>
                                {item.Cost &&
                                    <>
                                    {
                                        warband?
                                            warband.warband_data.EquipmentRelCahce[item.ID]? 
                                                warband.warband_data.EquipmentRelCahce[item.ID].cost + " " + getCostType(item.CostType)
                                                : item.GetCostString() : item.GetCostString()
                                    }
                                    </>
                                }
                            </span>

                            {(warband? warband.warband_data.EquipmentRelCahce[item.ID]? 
                                (warband.warband_data.EquipmentRelCahce[item.ID].limit )
                                : item.GetLimit() : item.GetLimit()) > 0 &&
                                <span className={'item-limit'}>
                                    Limit: {
                                        warband?
                                            warband.warband_data.EquipmentRelCahce[item.ID]? 
                                                ( warband.warband_data.EquipmentRelCahce[item.ID].count_cur + "/" + warband.warband_data.EquipmentRelCahce[item.ID].limit )
                                                : item.GetLimit() : item.GetLimit()
                                    }
                                </span>
                            }
                            {(warband? warband.warband_data.EquipmentRelCahce[item.ID]? 
                                (warband.warband_data.EquipmentRelCahce[item.ID].restrictions )
                                : item.GetRestrictionString() : item.GetRestrictionString()).length > 0 &&
                                <span className={'item-limit'}>
                                    Restrictions: {
                                        (warband?
                                            warband.warband_data.EquipmentRelCahce[item.ID]? 
                                                ( warband.warband_data.EquipmentRelCahce[item.ID].restrictions )
                                                : item.GetRestrictionString() : item.GetRestrictionString()).join(', ')
                                    }
                                </span>
                            }
                        </span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedID || isSubmitting}>
                    {isSubmitting ? (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    ): (
                        <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'} />
                    )}
                    {'Add Equipment'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddEquipment;

