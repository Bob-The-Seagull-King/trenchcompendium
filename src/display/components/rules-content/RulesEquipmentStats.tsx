import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import {Equipment, EquipmentStats} from '../../../classes/feature/equipment/Equipment';
import { FactionEquipmentRelationship } from '../../../classes/relationship/faction/FactionEquipmentRelationship';
import { ModelEquipmentRelationship } from '../../../classes/relationship/model/ModelEquipmentRelationship';
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import { getCostType } from '../../../utility/functions';


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
    const [cost, setcost] = useState<number | null>(null)
    const [costtype, setcosttype] = useState<number | null>(null)
    const [limit, setlimit] = useState<number | null>(null)
    const [equiprestrictions, setEquipRestrictions] = useState([])
    const baseequip = abilityObject;
    const [_keyvar, setkeyvar] = useState(0);

    
    useEffect(() => {
        async function SetModelOptions() {
            
            /* stats */
            if (props.facrelObject != undefined) {
                setcost(props.facrelObject.Cost)
                setcosttype(props.facrelObject.CostType)
                setlimit(props.facrelObject.Limit)
                const result_upgrades = await props.facrelObject.getFactionEquipmentStats();
                setstatlist(result_upgrades);
                
                const EventProc: EventRunner = new EventRunner();
                
                if (props.facrelObject.RestrictedEquipment != null) {
                    const result_presentation = await EventProc.runEvent(
                        "getEquipmentRestrictionPresentable",
                        props.facrelObject,
                        [],
                        [],
                        props.facrelObject.RestrictedEquipment
                    );
                    setEquipRestrictions(result_presentation);
                    setkeyvar((prev) => prev + 1);
                } else {
                    const result = await EventProc.runEvent(
                        "getEquipmentRestriction",
                        props.facrelObject,
                        [],
                        [],
                        null
                    );
                    props.facrelObject.RestrictedEquipment = result;
                    const result_presentation = await EventProc.runEvent(
                        "getEquipmentRestrictionPresentable",
                        props.facrelObject,
                        [],
                        [],
                        props.facrelObject.RestrictedEquipment
                    );
                    setEquipRestrictions(result_presentation);
                    setkeyvar((prev) => prev + 1);
                }
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
            {statlist && (RangeVal != "" || (HandValMelee != "" || HandValRange != "") || abilityObject.Modifiers.length > 0 || (cost != null && costtype != null) || (limit != null && equiprestrictions != null)) &&
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

                        {(limit != null && equiprestrictions != null) &&
                        <tr>
                            <td className={'label-cell'}>
                                {'Restrictions'}
                            </td>
                            <td>
                                <span className={'text-limit'}>
                                    LIMIT: {limit}
                                </span>

                                <br/>
                                {(equiprestrictions.length > 0) &&
                                    <span>
                                        {
                                            equiprestrictions.join(', ') + ' only'
                                        }
                                    </span>
                                }
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
