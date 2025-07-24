import React, {useState} from 'react';
import {Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";
import { Injury } from '../../../classes/feature/ability/Injury';
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { returnDescription } from '../../../utility/util';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import { RealWarbandPurchaseModel } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';

const WbbEditViewInjury: React.FC<{ injury: WarbandProperty, fighter : RealWarbandPurchaseModel }> = ({ injury, fighter }) => {

    const { playMode } = usePlayMode();

    const SelfInjury : Injury = injury.SelfDynamicProperty.OptionChoice as Injury;
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    return (
        <div className={`WbbEditViewInjury ${playMode ? 'play-mode' : ''}`}
             onClick={!playMode ? () => setShowDetailsModal(true) : undefined}
        >
            <div className="injury-title">
                <strong>{injury.Name}</strong>
            </div>

            {!playMode &&
                <div className="injury-source">
                    {"Elite Injuries Chart #" + SelfInjury.TableVal}
                </div>
            }

            <div className="injury-description">
                {returnDescription(SelfInjury, SelfInjury.Description)}
            </div>
            
            {injury.SelfDynamicProperty.Selections.length > 0 &&
                <span className={'title-choice'}>
                    {injury.SelfDynamicProperty.Selections.map((item) => 
                        <WbbOptionSelect 
                            property={injury}
                            key={injury.SelfDynamicProperty.Selections.indexOf(item)}
                            choice={item}
                        />
                    )}                        
                </span>
            }

            {!playMode &&
                <WbbContextualPopover
                    id={`injury-${injury.ID}`}
                    type="injury"
                    item={injury}
                    context={fighter}
                />
            }

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} className="WbbEditViewInjury-Modal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{injury.Name}</Modal.Title>

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
                    <div className="injury-description">
                        {returnDescription(SelfInjury, SelfInjury.Description)}
                    </div>

                    {injury.SelfDynamicProperty.Selections.length > 0 &&
                        <span className={'title-choice'}>
                            {injury.SelfDynamicProperty.Selections.map((item) =>
                                <WbbOptionSelect
                                    property={injury}
                                    key={injury.SelfDynamicProperty.Selections.indexOf(item)}
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

export default WbbEditViewInjury;