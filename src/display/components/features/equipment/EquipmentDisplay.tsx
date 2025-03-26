import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../classes/feature/model/Model';
import { Ability } from '../../../../classes/feature/ability/Ability';
import { Equipment, EquipmentStats } from '../../../../classes/feature/equipment/Equipment';
import GenericHover from '../../../components/generics/GenericHover';
import KeywordDisplay from '../glossary/KeywordDisplay';
import ItemStat from '../../../components/subcomponents/description/ItemStat';
import { makestringpresentable } from '../../../../utility/functions';
import DisplayFactionEquipmenWideDisplay from './DisplayFactionEquipmentWideDisplay';
import ItemRow from '../../../components/subcomponents/description/ItemRow';

const EquipmentDisplay = (props: any) => {
    const abilityObject: Equipment = props.data

    function ReturnStats(statlist : EquipmentStats, baseequip : Equipment) {

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
            <div className="">
                <ItemRow title={"Category"} value={() => <div>{makestringpresentable(baseequip.Category)}</div>}/>
                {RangeVal != "" &&
                <ItemRow title={"Range"} value={() => <div>{RangeVal}</div>}/>
                }
                {HandValMelee != "" &&
                <ItemRow title={"Hands(Melee)"} value={() => <div>{HandValMelee}</div>}/>
                }
                {HandValRange != "" &&
                <ItemRow title={"Hands(Ranged)"} value={() => <div>{HandValRange}</div>}/>
                }
            </div>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with EquipmentDisplay.tsx</div>}>
            <div className='backgroundBgCard'>
                <div className="">
                    {ReturnStats(abilityObject.Stats, abilityObject)  /* Stats */}
                </div>
                {abilityObject.Modifiers.length > 0 &&
                    <>
                        <ItemRow title={"Modifiers"} value={() => 
                            <div>
                                <span>
                                    {abilityObject.Modifiers.map((item) => ( 
                                        <span className='tagItem smallgapright' key={"equipment_modifier_"+abilityObject.ID+"_modifier_id_"+item}>
                                            <span className='glossaryMain'>{item}</span>
                                        </span>
                                    )) /* Keywords */}
                                </span>
                            </div>}/>
                    </>
                }
                {abilityObject.KeyWord.length > 0 &&
                    <>
                     <ItemRow title={"Keywords"} value={() => 
                            <div>
                                <span>
                                {abilityObject.KeyWord.map((item) => ( 
                                    <span className='tagItem smallgapright' key={"equipment_keyword_"+abilityObject.ID+"_keyword_id_"+item.ID}>
                                        <GenericHover  d_colour={'grey'} titlename={item.Name} d_name={item.Name} d_type={""} d_method={() => <KeywordDisplay data={item} />}/>
                                    </span>
                                )) /* Keywords */}
                                </span>
                            </div>}/>
                    </>
                }
                
                {abilityObject.Description.length > 0 &&
                <div className="borderstyler borderthin bordergrey">
                    <div className="totalmarginsml  size-default colourBasicText font-default">
                    {returnDescription(abilityObject, abilityObject.Description)}
                    </div>
                </div>
                }
                
                {abilityObject.Lore.length > 0 &&
                <div className="borderstyler borderthin bordergrey">
                    <div className="totalmarginsml colourBasicText font-default size-smaller">
                    {returnDescription(abilityObject, abilityObject.Lore)}
                    </div>
                </div>
                }
                
            </div>
        </ErrorBoundary>
    )

    /**
     * 
                
                <ItemRow title={"Found In"} value={() => 
                            <div>
                                <span>
                                {abilityObject.EquipmentItems.map((item) => ( 
                                    <span className='tagItem' key={"faction_rule_"+abilityObject.ID+"_rule_id_"+item.ID} >
                                        <DisplayFactionEquipmenWideDisplay data={item} />
                                    </span>
                                ))}
                                </span>
                            </div>}/>
     */
}

export default EquipmentDisplay;