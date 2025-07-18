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
    const [listoffulloptions, setListofFullOptions] = useState<FactionEquipmentRelationship[]>([])
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
            const fulloptions = await warband?.warband_data.GetFactionEquipmentOptions(exploration, true, true)
            if (options != undefined && fulloptions != undefined) {
                if (category.length > 0) {
                    setListofOptions(options.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                    setListofFullOptions(fulloptions.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                } else {
                    setListofOptions(options.filter((item : FactionEquipmentRelationship) => containsTag(item.Tags, 'exploration_only')));
                    setListofFullOptions(fulloptions.filter((item : FactionEquipmentRelationship) => containsTag(item.Tags, 'exploration_only')));
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
                {listoffulloptions.map((item) => (
                    <div
                        key={item.ID}
                        className={`select-item ${selectedId === item.ID ? 'selected' : ''} ${listofoptions.includes(item)? '' : 'disabled'}`}
                        onClick={() => {
                            if (listofoptions.includes(item)) {
                                setSelectedId(item.ID)
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
