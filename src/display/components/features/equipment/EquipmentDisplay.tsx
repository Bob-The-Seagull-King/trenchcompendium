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

const EquipmentDisplay = (props: any) => {
    const abilityObject: Equipment = props.data

    function ReturnStats(statlist : EquipmentStats, baseequip : Equipment) {

        /** Range */
        let RangeVal = ""
        if (baseequip.Distance > 0) {RangeVal += baseequip.Distance.toString() + "\""}
        if (statlist.melee == true) {RangeVal += "Melee"}
        if (RangeVal == "") { RangeVal = "N/A" }

        /** Hands */
        let HandValMelee = ""
        if (statlist.hands_melee != undefined) {HandValMelee += statlist.hands_melee.toString() + " Hands"}
        if (HandValMelee == "") { HandValMelee = "N/A" }
        
        let HandValRange = ""
        if (statlist.hands_ranged != undefined) {HandValRange += statlist.hands_ranged.toString() + " Hands"}
        if (HandValRange == "") { HandValRange = "N/A" }

        return (
            <>
            <div>
                <div className="verticalspacerbig"/>
                <div className="row row-cols-sm-7 row-cols-xs-4 justify-content-center">
                    <ItemStat title={"Category"} value={makestringpresentable(baseequip.Category)}/>
                    <ItemStat title={"Range"} value={(RangeVal)}/>
                    <ItemStat title={"Hands (Melee)"} value={(HandValMelee)}/>
                    <ItemStat title={"Hands (Ranged)"} value={(HandValRange)}/>
                </div>
                <div className="verticalspacerbig"/>
            </div>
            </>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with EquipmentDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div className="row">
                    {returnDescription(abilityObject, abilityObject.Lore)}
                </div>
                {abilityObject.Modifiers.length > 0 &&
                    <>
                        <div className="verticalspacerbig"/>
                        <div className="row">
                            <span>
                                {abilityObject.Modifiers.map((item) => ( 
                                    <span className='tagItem' key={"equipment_modifier_"+abilityObject.ID+"_modifier_id_"+item}>
                                        <span className='glossaryMain'>{item}</span>
                                    </span>
                                )) /* Keywords */}
                            </span>
                        </div>
                    </>
                }
                <div className="row">
                    {ReturnStats(abilityObject.Stats, abilityObject)  /* Stats */}
                </div>
                <div className="row">
                    {returnDescription(abilityObject, abilityObject.Description)}
                </div>
                {abilityObject.KeyWord.length > 0 &&
                    <>
                        <div className='separator tagboxpad colordefault'></div>
                        <div className="row">
                            <span>
                                {abilityObject.KeyWord.map((item) => ( 
                                    <span className='tagItem' key={"equipment_keyword_"+abilityObject.ID+"_keyword_id_"+item.ID}>
                                        <GenericHover  d_colour={'default'} titlename={item.Name} d_name={item.Name} d_type={""} d_method={() => <KeywordDisplay data={item} />}/>
                                    </span>
                                )) /* Keywords */}
                            </span>
                        </div>
                    </>
                }
            </div>
        </ErrorBoundary>
    )
}

export default EquipmentDisplay;