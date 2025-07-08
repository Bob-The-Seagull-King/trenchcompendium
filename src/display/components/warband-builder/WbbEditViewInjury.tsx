import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash} from "@fortawesome/free-solid-svg-icons";
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

    return (
        <div className={`WbbEditViewInjury ${playMode ? 'play-mode' : ''}`}>
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
        </div>
    );
};

export default WbbEditViewInjury;