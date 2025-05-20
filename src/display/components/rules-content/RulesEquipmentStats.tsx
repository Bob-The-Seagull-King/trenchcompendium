import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import {Equipment, EquipmentStats} from '../../../classes/feature/equipment/Equipment';
import { FactionEquipmentRelationship } from '../../../classes/relationship/faction/FactionEquipmentRelationship';
import { ModelEquipmentRelationship } from '../../../classes/relationship/model/ModelEquipmentRelationship';


interface RulesEquipmentStatsProps {
    facrelObject?: FactionEquipmentRelationship;
    baseobject: Equipment;
}

const RulesEquipmentStats: React.FC<RulesEquipmentStatsProps> = (props : RulesEquipmentStatsProps) => {

    if (typeof props.facrelObject === 'undefined' &&
        typeof props.baseobject === 'undefined') {
        return null;
    }

    const abilityObject = props.baseobject;
    const [statlist, setstatlist] = useState<EquipmentStats>(abilityObject.Stats)
    const baseequip = abilityObject;
    const [_keyvar, setkeyvar] = useState(0);

    
    useEffect(() => {
        async function SetModelOptions() {
            
            /* stats */
            if (props.facrelObject != undefined) {
                const result_upgrades = await props.facrelObject.getFactionEquipmentStats();
                setstatlist(result_upgrades);
            }
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);


    /** Range */
    let RangeVal = ""
    if (baseequip.Distance > 0) {RangeVal += baseequip.Distance.toString() + "\""}
    if (statlist.melee == true) {RangeVal += "Melee"}

    /** Hands */
    let HandValMelee = ""
    if (statlist.hands_melee != undefined) {HandValMelee += statlist.hands_melee.toString() + " Hands"}

    let HandValRange = ""
    if (statlist.hands_ranged != undefined) {HandValRange += statlist.hands_ranged.toString() + " Hands"}

    return (
        <>
            {statlist && (RangeVal != "" || (HandValMelee != "" || HandValRange != "") || abilityObject.Modifiers.length > 0) &&
                <table key={_keyvar} className={'rules-equipment-stats-table'}>
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
                                    {abilityObject.Modifiers.map((item) => (
                                        <div className='' key={"equipment_modifier_"+abilityObject.ID+"_modifier_id_"+item}>
                                            {item}
                                        </div>
                                    )) /* Modifiers */}
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            }
        </>

    )
};


export default RulesEquipmentStats;
