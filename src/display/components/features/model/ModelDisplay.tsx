import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../../utility/util'
import { Model } from '../../../../classes/feature/model/Model';
import GenericDisplay from '../../generics/GenericDisplay';
import AbilityDisplay from '../ability/AbilityDisplay';
import GenericHover from '../../generics/GenericHover';
import KeywordDisplay from '../glossary/KeywordDisplay';
import ItemStat from '../../subcomponents/description/ItemStat';
import { ModelStatistics } from '../../../../classes/feature/model/ModelStats';
import { getBaseSize, getColour, getMoveType, getPotential } from '../../../../utility/functions';
import ModelUpgradeDisplay from '../ability/ModelUpgradeDisplay';
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { IChoice } from '../../../../classes/options/StaticOption';
import ModelEquipmentDisplay from '../equipment/ModelEquipmentDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import { Form } from 'react-bootstrap';
import DisplayFactionModelDisplay from './DisplayFactionModelDisplay';

const ModelDisplay = (props: any) => {
    const modelcollectionObject: Model = props.data

    const [equiprestrictions, setEquipRestrictions] = useState([])
    const [equiplimits, setEquipLimits] = useState([])
    const [statchoices, setstatchoices] = useState([])
    const [_keyvar, setkeyvar] = useState(0);


    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner();
    
            /**
             * MODEL EQUIPMENT RESTRICTIONS
             */
            if (modelcollectionObject.RestrictedEquipment != null) {
                const result_presentation = await EventProc.runEvent(
                    "getEquipmentRestrictionPresentable",
                    modelcollectionObject,
                    [],
                    [],
                    modelcollectionObject.RestrictedEquipment
                );
                setEquipRestrictions(result_presentation);
                setkeyvar((prev) => prev + 1);
            } else {
                const result = await EventProc.runEvent(
                    "getEquipmentRestriction",
                    modelcollectionObject,
                    [],
                    [],
                    null
                );
                modelcollectionObject.RestrictedEquipment = result;
                const result_presentation = await EventProc.runEvent(
                    "getEquipmentRestrictionPresentable",
                    modelcollectionObject,
                    [],
                    [],
                    modelcollectionObject.RestrictedEquipment
                );
                setEquipRestrictions(result_presentation);
                setkeyvar((prev) => prev + 1);
            }
    
            /**
             * MODEL EQUIPMENT LIMITS
             */
            if (modelcollectionObject.LimitedEquipment != null) {
                const result_presentation = await EventProc.runEvent(
                    "getEquipmentLimitPresentable",
                    modelcollectionObject,
                    [],
                    [],
                    modelcollectionObject.LimitedEquipment
                );
                setEquipLimits(result_presentation);
                setkeyvar((prev) => prev + 1);
            } else {
                const result = await EventProc.runEvent(
                    "getEquipmentLimit",
                    modelcollectionObject,
                    [],
                    [],
                    null
                );
                modelcollectionObject.LimitedEquipment = result;
                const result_presentation = await EventProc.runEvent(
                    "getEquipmentLimitPresentable",
                    modelcollectionObject,
                    [],
                    [],
                    modelcollectionObject.LimitedEquipment
                );
                setEquipLimits(result_presentation);
                setkeyvar((prev) => prev + 1);
            }
    
            /**
             * MODEL STAT CHOICES
             */
            if (modelcollectionObject.StatChoices != null) {
                setstatchoices(modelcollectionObject.StatChoices as any);
                setkeyvar((prev) => prev + 1);
            } else {
                const result = await EventProc.runEvent(
                    "getModelStatOptions",
                    modelcollectionObject,
                    [],
                    [],
                    null
                );
                setstatchoices(result);
                setkeyvar((prev) => prev + 1);
            }
        }
    
        SetModelOptions();
    }, []);

    function ReturnStatOption(statchoice : ModelStatistics[]) {
        return (
            <>
            <Form.Control className={"borderstyler subborder" + getColour('default') } as="select" aria-label="Default select example"  placeholder="Member Type" >
                {statchoice.map((item) => ( 
                    <option key={"modeloption"+(statchoice.indexOf(item).toString())} >{ReturnStatProfileAsString(item)}</option> 
                ))}
            </Form.Control>
            </>
        )
    }

    function ReturnStatProfileAsString(stats : ModelStatistics) {
        const ProfileString : string[] = []
        if (stats.movement != undefined) {
            ProfileString.push( "Movement:" + (stats.movement?.toString() || "") + "\"" )
        }
        if (stats.movetype != undefined) {
            ProfileString.push("Move-Type:" + stats.movetype? getMoveType(stats.movetype) : "Infantry")
        }
        if (stats.melee != undefined) {
            ProfileString.push("Melee:" + (stats.melee? (stats.melee > 0? "+": "") : "") + (stats.melee?.toString() || ""))
        }
        if (stats.ranged != undefined) {
            ProfileString.push("Ranged:" + (stats.ranged? (stats.ranged > 0? "+": "") : "") + (stats.ranged?.toString() || ""))
        }
        if (stats.armour != undefined) {
            ProfileString.push("Armour:" + (stats.armour?.toString() || ""))
        }
        if (stats.potential != undefined) {
            ProfileString.push("Potential:" + (stats.potential? getPotential(stats.potential) : "Standard"))
        }
        if (stats.base != undefined) {
            ProfileString.push("Base:" + (stats.base? getBaseSize(stats.base) : "25mm"))
        }
        
        return ProfileString.join(' ')
    }

    function ReturnStats(statlist : ModelStatistics) {
        return (
            <div>
                <div className="verticalspacerbig"/>
                <div className="row row-cols-sm-7 row-cols-xs-4 justify-content-center">
                    {statlist.movement != undefined &&
                        <ItemStat title={"Movement"} value={(statlist.movement?.toString() || "") + "\""}/>
                    }
                    {statlist.movetype != undefined &&
                        <ItemStat title={"Move Type"} value={statlist.movetype? getMoveType(statlist.movetype) : "Infantry"}/>
                    }
                    {statlist.melee != undefined &&
                        <ItemStat title={"Melee"} value={(statlist.melee? (statlist.melee > 0? "+": "") : "") + (statlist.melee?.toString() || "")}/>
                    }
                    {statlist.ranged != undefined &&
                        <ItemStat title={"Ranged"} value={(statlist.ranged? (statlist.ranged > 0? "+": "") : "") + (statlist.ranged?.toString() || "")}/>
                    }
                    {statlist.armour != undefined &&
                        <ItemStat title={"Armour"} value={statlist.armour?.toString() || ""}/>
                    }
                    {statlist.potential != undefined &&
                        <ItemStat title={"Potential"} value={statlist.potential? getPotential(statlist.potential) : "Standard"}/>
                    }
                    {statlist.base != undefined &&
                        <ItemStat title={"Base"} value={statlist.base? getBaseSize(statlist.base) : "25mm"}/>
                    }
                </div>
                <div className="verticalspacerbig"/>
            </div>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelDisplay.tsx</div>}>
            <div className=''>
                <div className="row">
                    <span className="colordefault contentpacklabel complextext">
                        {modelcollectionObject.Name  /* Name */}
                    </span>
                </div>
                <div className="row">
                    {returnDescription(modelcollectionObject, modelcollectionObject.Lore) /* Lore */}
                </div>
                {modelcollectionObject.KeyWord.length > 0 &&
                <>
                    <div className="verticalspacerbig"/>
                    <div className="row">
                        <span className="">
                            <span className='bodytext colordefault'>{"Keywords: "}</span>
                            {modelcollectionObject.KeyWord.map((item) => ( 
                                <span className='tagItem' key={"model_keyword_"+modelcollectionObject.ID+"_keyword_id_"+item.ID}>
                                    <GenericHover  d_colour={modelcollectionObject.Team} titlename={item.Name} d_name={item.Name} d_type={""} d_method={() => <KeywordDisplay data={item} />}/>
                                </span>
                            )) /* Keywords */}
                        </span>
                    </div>
                </>
                }
                <div className="row">
                    {ReturnStats(modelcollectionObject.Stats)  /* Stats */}
                </div>
                <div className="row">
                {returnDescription(modelcollectionObject, modelcollectionObject.Description) /* Description */}
                </div>
                {statchoices.length > 0 &&
                <div>
                    <div className="row">
                        {statchoices.map((item) => ( 
                            <>
                            
                                <div className="verticalspacerbig"/>

                                <div className="colordefault bodytext complextext">
                                    {
                                        "Choose from the following stat profiles"
                                    }
                                </div>
                                
                                <span key={item} className="colordefault bodytext complextext">
                                    {
                                        ReturnStatOption(item)
                                    }
                                </span>
                            </>
                        ))} 
                    </div>
                </div>
                }
                 
                <div key={_keyvar}>
                {((modelcollectionObject.EquipmentList.length > 0) || (equiprestrictions.length > 0) || (equiplimits.length > 0)) &&
                    <>
                        <div className='separator bodytext tagboxpad colordefault'>Equipment</div>
                        {((equiprestrictions.length > 0) || (equiplimits.length > 0)) && 
                            <div>
                                <div className="row">
                                    {equiprestrictions.map((item) => ( 
                                        <span key={item} className="colordefault bodytext complextext">
                                            {
                                                item
                                            }
                                        </span>
                                    ))}  
                                    {equiplimits.map((item) => ( 
                                        <span key={item} className="colordefault bodytext complextext">
                                            {
                                                item
                                            }
                                        </span>
                                    ))}                                   
                                </div>
                            </div>
                        }
                        {(modelcollectionObject.EquipmentList.length > 0) &&
                            <>
                                <div className="verticalspacerbig"/>
                                <div className="row">
                                    {modelcollectionObject.EquipmentList.map((item) => ( 
                                        <>
                                        <div key={"model_equipment_"+modelcollectionObject.ID+"_equipment_id_"+item.ID}>
                                            <ModelEquipmentDisplay team_col={modelcollectionObject.Team} data={item} />
                                            <div className="verticalspacerbig"/>
                                        </div>
                                        {modelcollectionObject.EquipmentList.length > 1 &&                                     
                                            <div className='separator bodytext tagboxpad colordefault'></div>
                                        }
                                        </>
                                    )) /* Abilities */}
                                </div>
                            </>
                        }
                    </>
                }
                </div>
                {modelcollectionObject.Abilities.length > 0 &&
                    <>
                        <div className='separator bodytext tagboxpad colordefault'>Abilities</div>
                        <div className="verticalspacerbig"/>
                        <div className="row">
                            {modelcollectionObject.Abilities.map((item) => ( 
                                <div key={"model_ability_"+modelcollectionObject.ID+"_ability_id_"+item.ID}>
                                    <GenericDisplay  d_colour={modelcollectionObject.Team} d_name={item.Name} d_type={"sub"} d_method={() => <AbilityDisplay data={item} />}/>
                                    <div className="verticalspacerbig"/>
                                </div>
                            )) /* Abilities */}
                        </div>
                    </>
                }
                {modelcollectionObject.UpgradeList.length > 0 &&
                    <>
                        <div className='separator bodytext tagboxpad colordefault'>Upgrades</div>
                        <div className="verticalspacerbig"/>
                        <div className="row">
                            {modelcollectionObject.UpgradeList.map((item) => ( 
                                <div key={"model_ability_"+modelcollectionObject.ID+"_ability_id_"+item.ID}>
                                    <GenericDisplay d_state={false}  d_colour={modelcollectionObject.Team} d_name={item.UpgradeObject.Name} d_type={"sub"} d_method={() => <ModelUpgradeDisplay data={item} />}/>
                                    <div className="verticalspacerbig"/>
                                </div>
                            )) /* Abilities */}
                        </div>
                    </>
                }
                <div className="row">
                    <div className='separator bodytext tagboxpad colordefault'>Found In</div>
                            <div className="row textmaxwidth">
                                {modelcollectionObject.Models.map((item) => ( 
                                    <div key={"faction_rule_"+modelcollectionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                        <DisplayFactionModelDisplay data={item} />
                                    </div>
                                )) /* Abilities */}
                            </div>
                        
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ModelDisplay;