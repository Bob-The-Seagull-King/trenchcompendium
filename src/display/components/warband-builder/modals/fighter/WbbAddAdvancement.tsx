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
import { useWarband } from '../../../../../context/WarbandContext';
import WbbGeneralCollapse from "../../WbbGeneralCollapse";
import {returnDescription} from "../../../../../utility/util";


interface WbbModalAddAdvancementProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (advancement: Skill) => void;
    fighter : RealWarbandPurchaseModel
}

const WbbModalAddAdvancement: React.FC<WbbModalAddAdvancementProps> = ({ show, onClose, onSubmit, fighter }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { warband } = useWarband();
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


    function handleSelect ( ID: string ) {
        if( selectedId == ID ) {
            setSelectedId(null)

        } else {
            setSelectedId(ID)
        }
    }


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
                <div  className={'WbbGeneralCollapse-wrap'} >
                    {warband?.warband_data.GetPatron() == null &&
                        <div className="alert alert-warning my-4 mx-4">
                            {'No patron selected'}
                        </div>
                    }

                    {available.map((adv) => (
                        <WbbGeneralCollapse
                            key={adv.skillgroup.ID}
                            title={makestringpresentable(adv.skillgroup.GetTrueName())}
                            initiallyOpen={false}
                            nopad={true}
                        >
                            <>
                                {adv.list.map((skl) =>
                                    <>
                                        <div
                                            key={skl.ID}
                                            className={`select-item ${selectedId === skl.ID ? 'selected' : ''}`}
                                            onClick={() => handleSelect(skl.ID)}
                                        >
                                            <div className="item-name">
                                                { skl.TableVal != -1 &&
                                                    <>
                                                        {skl.TableVal + ' - '}
                                                    </>
                                                }
                                                {skl.GetTrueName()}
                                            </div>
                                        </div>

                                        {selectedId === skl.ID &&
                                            <div className={'select-item-details'}>
                                                {returnDescription(skl, skl.Description)}
                                            </div>
                                        }
                                    </>
                                )}
                            </>
                        </WbbGeneralCollapse>

                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId || isSubmitting}>
                    {isSubmitting ? (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '}/>
                    ) : (
                        <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'}/>
                    )}
                    {'Add Advancement'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddAdvancement;
