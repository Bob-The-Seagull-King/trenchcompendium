import React, { useEffect, useState } from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowUp,
    faCoins,
    faCopy,
    faEllipsisVertical,
    faTrash,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";
import {usePrintMode} from "../../../context/PrintModeContext";
import { RealWarbandPurchaseEquipment, RealWarbandPurchaseModel, WarbandPurchase } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { WarbandEquipment } from '../../../classes/saveitems/Warband/Purchases/WarbandEquipment';
import { Equipment } from '../../../classes/feature/equipment/Equipment';
import { getCostType, makestringpresentable } from '../../../utility/functions';
import { useWarband } from '../../../context/WarbandContext';
import { returnDescription } from '../../../utility/util';
import KeywordDisplay from '../features/glossary/KeywordDisplay';
import GenericHover from '../generics/GenericHover';
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import { Keyword } from '../../../classes/feature/glossary/Keyword';

interface EquipmentItemProps {
    item: WarbandPurchase
    fighter? : RealWarbandPurchaseModel | null
}

const WbbEquipmentListItem: React.FC<EquipmentItemProps> = ({ item, fighter }) => {

    const { warband, updateKey } = useWarband();
    const { playMode } = usePlayMode();
    const { printMode } = usePrintMode();

    const [canRemove, setCanRemove] = useState(item.Sellable);
    const [cantSwap, setCantSwap] = useState(false);
    const [keywordlist, setKeywordList] = useState<Keyword[]>([]);
    const [keyvar, setKeyvar] = useState(0);

    const ItemValue = (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment))
    useEffect(() => {

        async function GetCanRemove() {
            if (fighter !== null && fighter != undefined) {
                if ((item.HeldObject as WarbandEquipment).EquipmentCache == null) {
                    await (item.HeldObject as WarbandEquipment).BuildNewProperties(fighter.model, item)
                }
                const cache = (item.HeldObject as WarbandEquipment).EquipmentCache
                if (cache != null) {
                    setCanRemove(cache.CanRemove)
                    setCantSwap(cache.CanSwap)
                    setKeywordList(cache.KeywordsCache)
                }
                setKeyvar((prev) => prev + 1)
            }
        }

        GetCanRemove();
    }, [updateKey])

    function GetIDRel() {
        if (fighter == null || fighter == undefined) {
            return warband?.warband_data.Equipment.indexOf(item)
        } else {
            return fighter.model.Equipment.indexOf(item)
        }
    }


    return (
        <div className={`WbbEquipmentListItem ${playMode ? 'play-mode' : ''} ${printMode ? 'print-mode' : ''} `} key={keyvar}>
            <div className="equipment-name">{ItemValue.GetTrueName()}
                {(item.CustomInterface != undefined) ? item.CustomInterface.tags["is_custom"]? " (Manually Added)" : "" : ""}
            </div>

            {(!playMode || printMode) &&
                <div className="equipment-cost">
                    {item.ItemCost > 0 &&
                        <>
                            {item.ItemCost + " " + getCostType(item.CostType)}
                        </>
                    }
                </div>
            }

            {(!playMode || printMode) &&
                <div className={'equipment-modifiers'}>
                    {ItemValue.GetModifiers()}
                </div>
            }

            {((canRemove == true) && (!playMode && !printMode)) &&
                <WbbContextualPopover
                    id={`equipment-${GetIDRel()}`}
                    type={(fighter == null || fighter == undefined)? "equipment" : "equipment_model"}
                    item={{
                        purchase: item,
                        equipment: (item.HeldObject as WarbandEquipment)
                    } as RealWarbandPurchaseEquipment}
                    context={(fighter == null || fighter == undefined)? null : fighter}
                    contextuallimit={cantSwap}
                />
            }

            {(playMode && !printMode)  &&
                <div className={'equipment-details'}>
                    <table>
                        { ItemValue.GetRange() &&
                            <tr>
                                <td>
                                    Range
                                </td>
                                <td>
                                    {ItemValue.GetRange()}
                                </td>
                            </tr>
                        }
                        { ItemValue.Category &&
                            <tr>
                                <td>
                                    Type
                                </td>
                                <td>
                                    {makestringpresentable( ItemValue.Category)}
                                </td>
                            </tr>
                        }
                        { ItemValue.GetModifiers() &&
                            <tr>
                                <td>
                                    Modifiers
                                </td>
                                <td>
                                    {ItemValue.GetModifiers()}
                                </td>
                            </tr>
                        }
                    </table>
                    { keywordlist.length > 0 &&
                        <div className={'keywords-wrap'}>
                            <div className={'text-label'}>
                                {'Keywords'}
                            </div>
                            <div className={'keywords'}>
                                <p className={'keywords'}>
                                    {keywordlist.map((item, index) => (
                                        <span className='' key={"equipment_keyword_" + ItemValue.GetID() + "_keyword_id"}>
                                        <GenericHover
                                            d_colour={'grey'}
                                            titlename={item.Name}
                                            d_name={item.Name}
                                            d_type={""}
                                            d_method={() => <KeywordDisplay data={item}/>}
                                        />
                                        {index < keywordlist.length - 1 && ", "}
                                    </span>
                                    )) /* Keywords */}
                                </p>
                            </div>
                        </div>
                    }
                    { ItemValue.Description.length > 0 &&
                        <div className={'rules-wrap'}>
                            <div className={'text-label'}>
                                {'Rules'}
                            </div>
                            <div className={'rules'}>
                                {returnDescription(ItemValue, ItemValue.Description)}
                            </div>
                        </div>
                    }
                    
                    
                </div>
            }
            {(item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.Selections.length > 0 &&
                        <span className={'title-choice'}>
                            {(item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.Selections.map((option) => 
                                <WbbOptionSelect 
                                    property={(item.HeldObject as WarbandEquipment).MyEquipment}
                                    key={(item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.Selections.indexOf(option)}
                                    choice={option}
                                />
                            )}                        
                        </span>
                    }
        </div>
    );
};

export default WbbEquipmentListItem;
