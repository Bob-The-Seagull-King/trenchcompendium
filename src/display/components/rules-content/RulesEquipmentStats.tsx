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
            {/* @TODO: also check if restrictions are set and then show the table */}
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
                                    <div>
                                        {abilityObject.Modifiers.join(', ')}
                                    </div>
                                </td>
                            </tr>
                        }

                        <tr>
                            <td className={'label-cell'}>
                                {'Cost'}
                            </td>
                            <td>
                                {/* @TODO: add actual value and cost type*/}
                                8 Glory
                            </td>
                        </tr>

                        <tr>
                            <td className={'label-cell'}>
                                {'Restrictions'}
                            </td>
                            <td>
                                {/* @TODO: add actual Limits here */}

                                {/* @TODO: add Limit number here like in FactionEquipmentDisplay*/}
                                <span className={'text-limit'}>
                                    LIMIT: 1
                                </span>

                                {/* @TODO: break if limit AND other restrictions apply */}
                                <br/>

                                {/* @TODO: add other restrictions here like in FactionEquipmentDisplay */}
                                <span>
                                    Alchemists only
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            }
        </>
    )
};


export default RulesEquipmentStats;
