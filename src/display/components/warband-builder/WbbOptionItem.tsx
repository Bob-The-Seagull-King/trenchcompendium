import React, {useEffect, useState} from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
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
import {useWbbMode} from "../../../context/WbbModeContext";


interface WbbOptionItemProps {
    option: MemberUpgradePresentation;
    owner : WarbandMember;
    category : string;
}

const WbbOptionItem: React.FC<WbbOptionItemProps> = ({ option, owner, category }) => {
    const [open, setOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false); 
    const [keyvar, setkeyvar] = useState(0);
    const [selected, setSelected] = useState(option.purchase != null);
    const [allowed, setAllowed] = useState(option.allowed)
    const [canselect, setcanselect] = useState(allowed || option.purchase != null);

    const { warband, reloadDisplay, updateKey} = useWarband();

    const handleSelectOption = () => {
        if (option.purchase != null) {
            setSelected(false)
            owner.DeleteUpgrade(option.purchase).then(() => {
                option.purchase = null;
                setkeyvar(keyvar + 1)
                owner.CalcGivenPurchase(option.upgrade, category).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => {
                    reloadDisplay()
                    })})
            })
        } else {
            
            setSelected(true)
            owner.AddUpgrade(option).then((result) => {
                option.purchase = result;
                setkeyvar(keyvar + 1)
                
                owner.CalcGivenPurchase(option.upgrade, category).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => {
                        reloadDisplay()
                        })})
            })
        }
    };

    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2


    // Update `open` when Mode changes
    useEffect(() => {
        if (play_mode || print_mode) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [mode]);

    useEffect(() => {
        async function CheckAllowed() {
            setAllowed((await owner.CalcGivenPurchase(option.upgrade, category)).allowed)
            if (option.purchase) {
                setShowWarning((option.purchase.HeldObject as WarbandProperty).HaveEmptyOptions())
            }
        }
        CheckAllowed()
    }, []);

    useEffect(() => {
        setcanselect(allowed || option.purchase != null)
    })

    return (
        <div className="WbbOptionItem" key={updateKey.toString() + keyvar.toString()}>
            {/* Edit View with options */}
            {(view_mode || edit_mode) &&
                <div className="option-title"
                
                    key={keyvar.toString() + updateKey.toString()}
                     onClick={(e) => {
                         if( canselect && edit_mode ) {
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
                            key={keyvar.toString() + updateKey.toString()}
                            checked={selected}
                            disabled={(!canselect || view_mode)}
                            onClick={(e) => e.stopPropagation()} // prevent collapse toggle
                            onChange={handleSelectOption}
                        />
                    </span>

                    <span className="option-name">{option.upgrade.UpgradeObject.Name}</span>

                    {/* Displays the cost of the upgrade */}
                    {option.upgrade.Cost > 0 &&
                        <span className="option-cost">
                            {' - '}
                            {((option.discount < 0 && option.purchase == null)? option.cost - option.discount : option.cost) + " " + getCostType(option.upgrade.CostType)}
                        </span>
                    }

                    { showWarning &&
                        <FontAwesomeIcon icon={faTriangleExclamation} className="icon-inline-right-l icon-wraning"/>
                    }


                    {/* Displays the limit of the upgrade if any */}
                    { option.max_count > 0 &&
                        <span className='option-limit'>
                            {' - '}
                            { option.cur_count}
                            {'/'}
                            {option.max_count}
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
            {(play_mode || print_mode) &&
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
