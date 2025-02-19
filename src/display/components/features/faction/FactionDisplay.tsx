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
import { Faction } from '../../../../classes/feature/faction/Faction';
import RuleDisplay from './RuleDisplay';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import FactionModelDisplay from '../model/FactionModelDisplay';
import FactionEquipmentDisplay from '../equipment/FactionEquipmentDisplay';

const FactionDisplay = (props: any) => {
    const factionObject: Faction = props.data

    function ModelIsElite(model : Model) {
        for (let i = 0; i < model.KeyWord.length; i++) {
            if (model.KeyWord[i].ID == "kw_elite") {
                return true;
            }
        }

        return false
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionDisplay.tsx</div>}>
            <div>
                <div className='abilityInternalStructure'>
                    <div className="row">
                        <span className="colordefault contentpacklabel complextext">
                            {factionObject.Name  /* Name */}
                        </span>
                    </div>
                    <div className="row">
                        {returnDescription(factionObject, factionObject.Description) /* Description */}
                    </div>
                    {factionObject.Rules.length > 0 &&
                        <>
                            <div className='separator bodytext tagboxpad colordefault'>Rules</div>
                            <div className="verticalspacerbig"/>
                            <div className="row">
                                {factionObject.Rules.map((item) => ( 
                                    <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}>
                                        <GenericDisplay  d_colour={factionObject.Team} d_name={item.Name} d_type={"sub"} d_method={() => <RuleDisplay data={item} />}/>
                                        <div className="verticalspacerbig"/>
                                    </div>
                                )) /* Abilities */}
                            </div>
                        </>
                    }
                    <div className='row'>
                        {
                            <OptionSetStaticDisplay data={factionObject.MyOptions} />
                        }
                    </div>
                </div>
                    
                {factionObject.Models.length > 0 &&
                    <>                    
                        <div className="row">
                            <div className="verticalspacerbig"/>
                            <div className="verticalspacerbig"/>
                        </div>
                        <div  className={'titleShape titlebody background'+getColour(factionObject.Team)}>
                                {"Units"}
                            </div>
                            
                        <div className='abilityInternalStructure'>
                            {factionObject.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).length > 0 &&
                                <>
                            <div className='separator bodytext tagboxpad colordefault'>Captains</div>
                            <div className="row textmaxwidth">
                                {factionObject.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).map((item) => ( 
                                    <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                        <FactionModelDisplay data={item} />
                                    </div>
                                )) /* Abilities */}
                            </div>
                            
                            </>
                            }
                            {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == true))).length > 0 &&
                            <>
                            
                                <div className="separator bodytext tagboxpad colordefault">
                                    Elite
                                </div>
                                <div className="row textmaxwidth">
                                    {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == true))).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionModelDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </>
                            }
                            {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == false))).length > 0 &&
                            <>
                            <div className='separator bodytext tagboxpad colordefault'>Infantry</div>
                            <div className="row textmaxwidth">
                                {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == false))).map((item) => ( 
                                    <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                        <FactionModelDisplay data={item} />
                                    </div>
                                )) /* Abilities */}
                            </div>
                            </>
                            }
                            {factionObject.Models.filter((item) => (item.Mercenary == true)).length > 0 &&
                                <>
                                <div className='separator bodytext tagboxpad colordefault'>Mercenaries</div>
                                <div className="row textmaxwidth">
                                    {factionObject.Models.filter((item) => (item.Mercenary == true)).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionModelDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </>
                            }
                        </div>
                    </>
                }
                {factionObject.EquipmentItems.length > 0 &&
                    <>
                        <div className="row">
                        <div className="verticalspacerbig"/>
                        <div className="verticalspacerbig"/>
                        </div>
                        <div  className={'titleShape titlebody background'+getColour(factionObject.Team)}>
                            {"Armoury"}
                        </div>
                        
                    <div className='abilityInternalStructure'>
                        {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "melee")).length > 0 &&
                            <>
                                <div className='separator bodytext tagboxpad colordefault'>Melee</div>
                                <div className="row textmaxwidth">
                                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "melee")).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </>
                        }
                        {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "ranged")).length > 0 &&
                            <>
                                <div className='separator bodytext tagboxpad colordefault'>Ranged</div>
                                <div className="row textmaxwidth">
                                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "ranged")).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </>
                        }
                        {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "armor")).length > 0 &&
                            <>
                                <div className='separator bodytext tagboxpad colordefault'>Armor</div>
                                <div className="row textmaxwidth">
                                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "armor")).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </>
                        }
                        {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "equipment")).length > 0 &&
                            <>
                                <div className='separator bodytext tagboxpad colordefault'>Equipment</div>
                                <div className="row textmaxwidth">
                                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "equipment")).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </>
                        }
                    </div>
                    </>
                }
            </div>
        </ErrorBoundary>
    )
}

export default FactionDisplay;