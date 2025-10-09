import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { FactionEquipmentRelationship } from '../../../../../classes/relationship/faction/FactionEquipmentRelationship';
import {getCostType, makestringpresentable} from '../../../../../utility/functions';
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";
import { useWarband } from '../../../../../context/WarbandContext';
import { CachedFactionEquipment } from '../../../../../classes/saveitems/Warband/UserWarband';
import WbbEquipmentListItem from "../../WbbEquipmentListItem";
import WbbEquipmentDetails from "../../micro-elements/WbbEquipmentDetails";
import AlertCustom from "../../../generics/AlertCustom";
import WbbSelectItemEquipment from "../../micro-elements/WbbSelectItem";

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
    const [openedID, setOpenedID] = useState<string | null>(null);

    const { warband } = useWarband();
    const [available, setAvailable] = useState<FactionEquipmentRelationship[]>([]);
    const [cache, setCache] = useState<CachedFactionEquipment>({});
    const [keyvar, setkevvar] = useState(0);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading((id?: string) => {
        const selected = available.find(w => w.ID === openedID); // use opened id
        if (selected) {
            onSubmit(selected);
            onClose();
        }
    });
    
    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await fighter.model.GetModelEquipmentOptions()
            if (options != undefined) {
                const tempcache = warband? warband.warband_data.EquipmentRelCache : {}
                const keys = Object.keys(tempcache)
                const specialcache = await fighter.model.GetSpecialCache()
                const specialkeys = Object.keys(specialcache)
                const fincache : CachedFactionEquipment = {}
                
                for (let i = 0; i < keys.length; i++) {
                    if ((tempcache[keys[i]].facrel.EquipmentItem.Category == category)) {
                        fincache[keys[i]] = tempcache[keys[i]]
                    }
                }
                for (let i = 0; i < specialkeys.length; i++) {
                    if ((specialcache[specialkeys[i]].facrel.EquipmentItem.Category == category)) {
                        fincache[specialkeys[i]] = specialcache[specialkeys[i]]
                    }
                }

                setAvailable(options.filter((item : FactionEquipmentRelationship) => item.EquipmentItem.Category == category))
                setCache(fincache)
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    return (
        <Modal key={keyvar} show={show} onHide={onClose} className="WbbModal WbbModalSelect WbbModalAddEquipment" centered>
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
                {Object.keys(cache).map((item, index) => (
                    <WbbSelectItemEquipment
                        key={`select-item-${index}`}

                        id={cache[item].facrel.ID}
                        title={cache[item].facrel.EquipmentItem.GetTrueName()}
                        opened={openedID === cache[item].facrel.ID}
                        available={available.includes(cache[item].facrel)}
                        onClick={() => {
                            setOpenedID(prev => prev === cache[item].facrel.ID ? null : cache[item].facrel.ID)
                        }}
                        equipment={cache[item].facrel.EquipmentItem}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                        submitBtnString={'Add Equipment'}
                        cost={cache[item].cost + " " + getCostType(cache[item].facrel.CostType)}
                        limit={
                            cache[item].limit > 0
                                ? "Limit: " + (cache[item].count_cur + "/" + cache[item].limit)
                                : ""
                        }
                        restrictions={cache[item].restrictions}
                    />
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddEquipment;

