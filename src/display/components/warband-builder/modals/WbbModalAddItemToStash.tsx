import { useWarband } from '../../../../context/WarbandContext';
import { FactionEquipmentRelationship } from '../../../../classes/relationship/faction/FactionEquipmentRelationship';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { containsTag, getCostType } from '../../../../utility/functions';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useModalSubmitWithLoading} from "../../../../utility/useModalSubmitWithLoading";
import { CachedFactionEquipment } from '../../../../classes/saveitems/Warband/UserWarband';

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
    
    const { warband, updateKey } = useWarband();
    const [listofoptions, setListofOptions] = useState<FactionEquipmentRelationship[]>([])
    const [cache, setCache] = useState<CachedFactionEquipment>({});
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
            if (Object.keys(cache).length == 0) {
                const options = await warband?.warband_data.GetFactionEquipmentOptions(exploration)
                let optionlist = []
                const tempcache = warband? warband.warband_data.EquipmentRelCache : {}
                const keys = Object.keys(tempcache)
                const fincache : CachedFactionEquipment = {}
                if (options != undefined) {
                    if (category.length > 0) {
                        console.log(options.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                        optionlist = (options.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                        
                        for (let i = 0; i < keys.length; i++) {
                            if ((tempcache[keys[i]].facrel.EquipmentItem.Category == category)) {
                                fincache[keys[i]] = tempcache[keys[i]]
                            }
                        }
                    } else {
                        optionlist = (options.filter((item : FactionEquipmentRelationship) => containsTag(item.Tags, 'exploration_only')));
                        for (let i = 0; i < keys.length; i++) {
                            if (containsTag(tempcache[keys[i]].facrel.Tags, 'exploration_only')) {
                                fincache[keys[i]] = tempcache[keys[i]]
                            }
                        }
                    }
                    setCache(fincache)
                    setListofOptions(optionlist)
                    setkevvar(keyvar + 1)
                }
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
                {Object.keys(cache).map((item, index) => (
                    <div
                        key={cache[item].facrel.ID}
                        className={`select-item ${selectedId === cache[item].facrel.ID ? 'selected' : ''} ${listofoptions.map(obj => obj.ID).includes(item)? '' : 'disabled'}`}
                        onClick={() => {
                            if (listofoptions.map(obj => obj.ID).includes(item)) {
                                setSelectedId(cache[item].facrel.ID)
                            }
                        }}
                    >
                        <span className={'item-left'}>
                            <span className={'item-name'}>
                                {cache[item].facrel.EquipmentItem.GetTrueName()}
                            </span>
                            
                        </span>

                        <span className={'item-right'}>
                            <span className={'item-cost'}>
                                {cache[item].facrel.Cost &&
                                    <>
                                    {cache[item].cost + " " + getCostType(cache[item].facrel.CostType) }
                                    </>
                                }
                            </span>

                            {((cache[item].limit > 0)) &&
                                <span className={'item-limit'}>
                                    Limit: {( cache[item].count_cur + "/" + cache[item].limit ) }
                                </span>
                            }
                            {((cache[item].restrictions )).length > 0 &&
                                <span className={'item-limit'}>
                                    Restrictions: {
                                        (( cache[item].restrictions )).join(', ')
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
