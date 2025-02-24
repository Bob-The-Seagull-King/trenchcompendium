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
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import { Scenario } from '../../../../classes/feature/scenario/Scenario';
import GenericDisplay from '../../generics/GenericDisplay';
import RuleDisplay from '../faction/RuleDisplay';
import GloriousDeedDisplay from './GloriousDeedDisplay';
import GenericPopup from '../../generics/GenericPopup';
import ItemStat from '../../subcomponents/description/ItemStat';
import { getMoveType, getPotential, getBaseSize } from '../../../../utility/functions';

const ScenarioDisplay = (props: any) => {
    const scenarioObject: Scenario = props.data

    
    function ReturnStats(statlist : Scenario) {
        return (
            <div>
                <div className="verticalspacerbig"/>
                <div className="row row-cols-3 justify-content-center">
                <ItemStat title={"Players"} value={(statlist.EvenMatch == true? "Even Match" : "Attack / Defend")}/>
                <ItemStat title={"Infiltrators"} value={(statlist.InfiltratorType == 0? "Not Allowed" : statlist.InfiltratorType == 1? "Allowed" : "Special")}/>
                <ItemStat title={"Battle Length"} value={(statlist.BattleMin == statlist.BattleMax? statlist.BattleMin : (statlist.BattleMin + "-" + statlist.BattleMax)) + " Turns"}/>
                <ItemStat title={"Standard Terrain"} value={(statlist.StandardTerrain == true? "Yes" : "No")}/>
                <ItemStat title={"Staggered Deployment"} value={(statlist.StaggeredDeployment == true? "Yes" : "No")}/>
                </div>
                <div className="verticalspacerbig"/>
            </div>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ScenarioDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                
                <div className='row row-cols-md-2 row-cols-1'>
                    <div className='col'>
                        <img src={scenarioObject.ImgLink} style={{width:"100%"}}/>
                    </div>
                    <div className='col'>
                        
                        <div className='row'>
                            {returnDescription(scenarioObject, scenarioObject.Description)}
                        </div>
                        <div className='row'>
                            {ReturnStats(scenarioObject)}
                        </div>
                        <div className='separator bodytext tagboxpad colordefault'>Glorious Deeds</div>
                        <div className="row">
                            {returnDescription(scenarioObject, scenarioObject.DeedsDesc)}

                            {scenarioObject.Deeds.map((item) => ( 
                                <span key={"faction_rule_"+scenarioObject.ID+"_rule_id_"+item.ID}>
                                    <GenericPopup titlename={item.Name}  d_colour={"default"} d_name={item.Name} d_type={""} d_method={() => <GloriousDeedDisplay data={item} />}/>
                                </span>
                            )) }

                            {scenarioObject.OptionalDeeds.length > 0 &&
                            <div>
                                {"If agreed by the players prior to starting the game, you may replace one of the Glory Deeds above for one of the following options:"}
                            </div>
                            }
                            
                            {scenarioObject.OptionalDeeds.map((item) => ( 
                                <div key={"faction_rule_"+scenarioObject.ID+"_rule_id_"+item.ID}>
                                    <GenericPopup titlename={item.Name}  d_colour={"default"}  d_name={item.Name} d_type={"sub"} d_method={() => <GloriousDeedDisplay data={item} />}/>
                                    <div className="verticalspacerbig"/>
                                </div>
                            )) }
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {"Forces and Infiltrators"}
                </div>
                <div className='row'>
                    {"Battlefield and Deployment"}
                </div>
                <div className='row'>
                    {"Victory and Battle Length"}
                </div>
                {scenarioObject.SpecialRules.length > 0 &&
                    <>
                        <div className='separator bodytext tagboxpad colordefault'>Special Rules</div>
                        <div className="verticalspacerbig"/>
                        <div className="row">
                            {scenarioObject.SpecialRules.map((item) => ( 
                                <div key={"faction_rule_"+scenarioObject.ID+"_rule_id_"+item.ID}>
                                    <GenericDisplay  d_colour={"default"} d_name={item.Name} d_type={"sub"} d_method={() => <RuleDisplay data={item} />}/>
                                    <div className="verticalspacerbig"/>
                                </div>
                            )) }
                        </div>
                    </>
                }
                
            </div>
        </ErrorBoundary>
    )
}

export default ScenarioDisplay;