import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Skill } from '../../../../../classes/feature/ability/Skill';
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { SkillSuite } from '../../../../../classes/saveitems/Warband/Purchases/WarbandMember';
import { makestringpresentable } from '../../../../../utility/functions';
import WbbFighterCollapse from '../../WbbFighterCollapse';
import {useModalSubmitWithLoading} from "../../../../../utility/useModalSubmitWithLoading";


interface WbbModalAddAdvancementProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (advancement: Skill) => void;
    fighter : RealWarbandPurchaseModel
}

const WbbModalAddAdvancement: React.FC<WbbModalAddAdvancementProps> = ({ show, onClose, onSubmit, fighter }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [available, setAvailable] = useState<SkillSuite[]>([]);
    const [keyvar, setkevvar] = useState(0);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        const selected = FindItem(selectedId);
        if (selected) {
            onSubmit(selected);
            setSelectedId(null);
            onClose();
        }
    });

    function FindItem(a : string | null) {
        for (let i = 0; i < available.length; i++) {
            for (let j = 0; j < available[i].list.length; j++) {
                if (available[i].list[j].ID == a) {
                    return available[i].list[j]
                }
            }
        }
        return null;
    }
        
    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await fighter.model.GetModelSkillOptions()
            if (options != undefined) {
                setAvailable(options)
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddAdvancement" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Advancement</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <div className={"fighter-card"}>
                    <div  className={'fighter-card-collapse-wrap'} >
                    {available.map((adv) => (
                        <WbbFighterCollapse
                            key={adv.skillgroup.ID}
                            title={makestringpresentable(adv.skillgroup.GetTrueName())}
                            initiallyOpen={false}
                            nopad={true}
                        >
                            <>
                                {adv.list.map((skl) => 
                                    <div
                                        key={skl.ID}
                                        className={`select-item ${selectedId === skl.ID ? 'selected' : ''}`}
                                        onClick={() => setSelectedId(skl.ID)}
                                    >
                                        <div className="item-name">{skl.GetTrueName()}</div>

                                    </div>)
                                }
                            </>
                        </WbbFighterCollapse>
                        
                    ))}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId || isSubmitting}>
                    {isSubmitting ? (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    ): (
                        <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'} />
                    )}
                    {'Add Advancement'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddAdvancement;
