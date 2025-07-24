import React, {useState} from 'react';
import {Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { Skill } from '../../../classes/feature/ability/Skill';
import { returnDescription } from '../../../utility/util';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import { RealWarbandPurchaseModel } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import WbbEquipmentStats from "./modals/warband/WbbEquipmentStats";
import WbbEquipmentMain from "./modals/warband/WbbEquipmentMain";

const WbbEditViewAdvancement: React.FC<{ advancement: WarbandProperty, fighter : RealWarbandPurchaseModel }> = ({ advancement, fighter }) => {

    const { playMode } = usePlayMode();
    
    const SelfSkill : Skill = advancement.SelfDynamicProperty.OptionChoice as Skill;
    const [showDetailsModal, setShowDetailsModal] = useState(false);


    return (

        <div className={`WbbEditViewAdvancement ${playMode ? 'play-mode' : ''}`}
             onClick={!playMode ? () => setShowDetailsModal(true) : undefined}
        >
            <div className="advancement-title">
                <strong>{advancement.Name}</strong>
            </div>

            <div className="advancement-description">
                {returnDescription(SelfSkill, SelfSkill.Description)}
            </div>
            
            {advancement.SelfDynamicProperty.Selections.length > 0 &&
                <span className={'title-choice'}>
                    {advancement.SelfDynamicProperty.Selections.map((item) => 
                        <WbbOptionSelect 
                            property={advancement}
                            key={advancement.SelfDynamicProperty.Selections.indexOf(item)}
                            choice={item}
                        />
                    )}                        
                </span>
            }

            {/* actions */}
            { !playMode &&
                <WbbContextualPopover
                    id={`advancement-${advancement.ID}`}
                    type="advancement"
                    item={advancement}
                    context={fighter}
                />
            }

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} className="WbbEditViewAdvancement-Modal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{advancement.Name}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setShowDetailsModal(false);
                            }
                        }
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className="advancement-description">
                        {returnDescription(SelfSkill, SelfSkill.Description)}
                    </div>

                    {advancement.SelfDynamicProperty.Selections.length > 0 &&
                        <span className={'title-choice'}>
                            {advancement.SelfDynamicProperty.Selections.map((item) =>
                                <WbbOptionSelect
                                    property={advancement}
                                    key={advancement.SelfDynamicProperty.Selections.indexOf(item)}
                                    choice={item}
                                />
                            )}
                        </span>
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default WbbEditViewAdvancement;