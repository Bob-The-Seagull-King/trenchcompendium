import React, {useEffect, useState} from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import {usePlayMode} from "../../../context/PlayModeContext";
import {usePrintMode} from "../../../context/PrintModeContext";
import { ModelUpgradeRelationship } from '../../../classes/relationship/model/ModelUpgradeRelationship';
import { getCostType } from '../../../utility/functions';
import { returnDescription } from '../../../utility/util';
import { MemberUpgradePresentation, WarbandMember } from '../../../classes/saveitems/Warband/Purchases/WarbandMember';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import { useWarband } from '../../../context/WarbandContext';
import { Upgrade } from '../../../classes/feature/ability/Upgrade';
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import OptionSetStaticDisplay from '../subcomponents/description/OptionSetStaticDisplay';


interface WbbOptionItemProps {
    option: MemberUpgradePresentation;
    owner : WarbandMember
}

const WbbOptionItem: React.FC<WbbOptionItemProps> = ({ option, owner }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(option.purchase != null);

    const { warband, reloadDisplay, updateKey} = useWarband();

    const handleSelectOption = () => {
        if (option.purchase != null) {
            owner.DeleteUpgrade(option.purchase).then(() => {
                option.purchase = null;
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => {
                    reloadDisplay()
                    setSelected(false)
                    })
            })
        } else {
            
            owner.AddUpgrade(option.upgrade).then((result) => {
                option.purchase = result;
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => {
                        reloadDisplay()
                        setSelected(true)
                        })
            })
        }
    };

    const { playMode } = usePlayMode();
    const { printMode } = usePrintMode();

    // Update `open` when playMode changes
    useEffect(() => {
        if (playMode || printMode) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [playMode, printMode]);

    return (
        <div className="WbbOptionItem" key={updateKey}>
            {/* Edit View with options */}
            {(!playMode && !printMode) &&
                <div className="option-title"
                     onClick={(e) => {
                         if( option.allowed || option.purchase != null ) {
                             handleSelectOption();
                         }
                    }}
                >
                    <span
                        className="input-wrap"
                    >
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={option.upgrade.ID}
                            key={updateKey}
                            checked={selected}
                            disabled={(!option.allowed) && (option.purchase == null)}
                            onClick={(e) => e.stopPropagation()} // prevent collapse toggle
                            onChange={handleSelectOption}
                        />
                    </span>

                    <span className="option-name">{option.upgrade.UpgradeObject.Name}</span>

                    {/* Displays the cost of the upgrade */}
                    {option.upgrade.Cost > 0 &&
                        <span className="option-cost">
                            {' - '}
                            {option.upgrade.Cost + " " + getCostType(option.upgrade.CostType)}
                        </span>
                    }

                    {/* Displays the limit of the upgrade if any */}
                    { option.upgrade.GetLimitNumber() > 0 &&
                        <span className='option-limit'>
                            {' - '}
                            {option.upgrade.GetLimitNumber()}
                            {'/'}
                            {option.upgrade.GetLimitNumberTotal()}
                        </span>
                    }

                    <span className="collapse-chevron-wrap" onClick={(e) => {
                        e.stopPropagation(); // prevent option from being selected
                        setOpen(!open);
                    }}>
                        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
                    </span>
                </div>
            }

            {/* Play mode view without options*/}
            {(playMode || printMode) &&
                <div className="option-title"
                     onClick={() => {
                         setOpen(!open);
                     }}>
                    <span className="option-name">{option.upgrade.UpgradeObject.Name}</span>

                    <span className="collapse-chevron-wrap">
                        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown}/>
                    </span>
                </div>
            }

            <Collapse in={open}>
                <div className="option-details" key={updateKey}>

                    <div className="option-details-inner">
                        {option.purchase?.HeldObject != null &&
                        <>
                            {returnDescription(option.purchase?.HeldObject, ((option.purchase?.HeldObject as WarbandProperty).SelfDynamicProperty.OptionChoice as Upgrade).Description)}
                            
                            {((option.purchase?.HeldObject as WarbandProperty).SelfDynamicProperty).Selections.length > 0 &&
                                <span className={'title-choice'}>
                                    {((option.purchase?.HeldObject as WarbandProperty)).SelfDynamicProperty.Selections.map((item: any) => 
                                        <WbbOptionSelect 
                                            property={((option.purchase?.HeldObject as WarbandProperty))}
                                            key={((option.purchase?.HeldObject as WarbandProperty)).SelfDynamicProperty.Selections.indexOf(item)}
                                            choice={item}
                                        />
                                    )}                        
                                </span>
                            }
                        </>
                        }{option.purchase?.HeldObject == null &&
                            <>
                                {returnDescription(option.upgrade, option.upgrade.UpgradeObject.Description)}
                                
                                <OptionSetStaticDisplay data={option.upgrade.UpgradeObject.MyOptions} />
                            </>
                        }
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default WbbOptionItem;
