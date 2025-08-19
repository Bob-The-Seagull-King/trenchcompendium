import '../../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import {Equipment, EquipmentStats} from '../../../../../classes/feature/equipment/Equipment';
import { FactionEquipmentRelationship } from '../../../../../classes/relationship/faction/FactionEquipmentRelationship';
import { ModelEquipmentRelationship } from '../../../../../classes/relationship/model/ModelEquipmentRelationship';
import { EventRunner } from '../../../../../classes/contextevent/contexteventhandler';
import { getCostType } from '../../../../../utility/functions';
import { RealWarbandPurchaseModel, WarbandPurchase } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { WarbandEquipment } from '../../../../../classes/saveitems/Warband/Purchases/WarbandEquipment';


interface EquipmentItemProps {
    item: WarbandPurchase
    fighter? : RealWarbandPurchaseModel | null
}

const WbbEquipmentStats: React.FC<EquipmentItemProps> = (props : EquipmentItemProps) => {


    const abilityObject = (((props.item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment))
    const warbadnequip = (((props.item.HeldObject as WarbandEquipment)))
    const [statlist] = useState<EquipmentStats>(abilityObject.Stats)
    const [cost] = useState<number>(props.item.ItemCost)
    const [costtype] = useState<number>(props.item.CostType)
    const baseequip = abilityObject;

    

    /** Range */
    const RangeVal = warbadnequip.GetRange();

    /** Hands */
    let HandValMelee = ""
    if (statlist.hands_melee != undefined) {HandValMelee += statlist.hands_melee.toString() + " Hands"}

    let HandValRange = ""
    if (statlist.hands_ranged != undefined) {HandValRange += statlist.hands_ranged.toString() + " Hands"}

    return (
        <>
            {statlist && (RangeVal != "" || (HandValMelee != "" || HandValRange != "") || abilityObject.Modifiers.length > 0 || (cost != null && costtype != null) ) &&
                <table className={'WbbEquipmentStats'}>
                    <tbody>
                        {RangeVal != "" &&
                            <tr>
                                <td className={'label-cell'}>
                                    {'Range'}
                                </td>
                                <td>
                                    {RangeVal}
                                </td>
                            </tr>
                        }
                        {(HandValMelee != "" || HandValRange != "") &&
                            <tr>
                                <td className={'label-cell'}>
                                    {'Hands'}
                                </td>
                                <td>
                                    <div>
                                        {HandValRange != "" &&
                                            HandValRange + ' (Ranged)'
                                        }
                                    </div>
                                    <div>
                                        {HandValMelee != "" &&
                                            HandValMelee + ' (Melee)'
                                        }
                                    </div>

                                </td>
                            </tr>
                        }

                        {abilityObject.Modifiers.length > 0 &&
                            <tr>
                                <td className={'label-cell'}>
                                    {'Modifiers'}
                                </td>
                                <td>
                                    <div>
                                        {abilityObject.Modifiers.join(', ')}
                                    </div>
                                </td>
                            </tr>
                        }
                        {(costtype != null && cost != null) &&
                        <tr>
                            <td className={'label-cell'}>
                                {'Cost'}
                            </td>
                            <td>
                                {cost + " " + getCostType(costtype)}
                            </td>
                        </tr>
                        }

                    </tbody>
                </table>
            }
        </>
    )
};


export default WbbEquipmentStats;
