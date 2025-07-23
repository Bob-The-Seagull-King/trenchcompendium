import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../../../classes/options/StaticOption';
import { SelectedOption } from '../../../../../classes/options/SelectedOption';
import { WarbandPurchase } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { UserWarband } from '../../../../../classes/saveitems/Warband/UserWarband';
import { WarbandMember } from '../../../../../classes/saveitems/Warband/Purchases/WarbandMember';
import { useWarband } from '../../../../../context/WarbandContext';

interface WbbEditSelectionProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (fighter : WarbandPurchase) => void;
    warband : UserWarband | null;
    contextItem : any;
}

const WbbMoveEquipmentToFighterModal: React.FC<WbbEditSelectionProps> = ({
                                                                                show,
                                                                                onClose,
                                                                                onSubmit,
                                                                                warband,
                                                                                contextItem
                                                                            }) => {

    const [selectedFighter, setSelectedFighter] = useState<WarbandPurchase | null>(null);
    const [fighterlist, setFighterList] = useState<WarbandPurchase[]>([]);
    const [keyvar, setkeyvar] = useState(0);

    

    const { updateKey } = useWarband()
    
    useEffect(() => {
        async function RunGetModels() {
            const NewList : WarbandPurchase[] = []
            if (contextItem.purchase != undefined && contextItem.equipment != undefined && warband != null) {
                const FighterList = warband.GetFighters()
                for (let i = 0; i < FighterList.length; i++) {
                    if (contextItem.purchase.CustomInterface.tags["is_custom"]) {
                            NewList.push(FighterList[i].purchase)
                    } else {
                        const validtoadd = await FighterList[i].model.CanAddItem(contextItem.purchase.PurchaseInterface)
                        if (validtoadd) {
                            NewList.push(FighterList[i].purchase)
                        }
                    }
                }
            }
            setFighterList(NewList);
            setkeyvar(keyvar + 1)
        }

        RunGetModels()
    }, [updateKey])
    
    const handleSubmit = () => {
        if (selectedFighter != null) {
            onSubmit(selectedFighter);
        }
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal className="WbbEditGoeticSelectionModal" show={show} onHide={onClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>{`Move Equipment to Fighter`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        <div className={'goetic-selection-wrap'} key={keyvar}>
                            {warband?.Models.map((discipline) => (
                            <div
                                key={discipline.HeldObject.ID + discipline.HeldObject.ID}
                                className={`select-item ${selectedFighter === discipline ? 'selected' : ''} ${fighterlist.includes(discipline) ? '' : ' disabled'}`}
                                onClick={() => {
                                    if (fighterlist.includes(discipline)) {
                                        setSelectedFighter(discipline)
                                    }
                                }}
                            >
                                {(discipline.HeldObject as WarbandMember).GetFighterName()}
                            </div>
                            ))}

                        </div>
                    </div>
                    <div >
                        <strong>Move {(contextItem.equipment != undefined)? contextItem.equipment.GetTrueName() : ""}</strong>?
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Move Equipment
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
};

export default WbbMoveEquipmentToFighterModal;