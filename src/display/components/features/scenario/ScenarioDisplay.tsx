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
import { ToastContainer, toast } from 'react-toastify';
import RuleDisplay from '../faction/RuleDisplay';
import GloriousDeedDisplay from './GloriousDeedDisplay';
import GenericPopup from '../../generics/GenericPopup';
import ItemStat from '../../subcomponents/description/ItemStat';
import { getMoveType, getPotential, getBaseSize } from '../../../../utility/functions';
import ItemRow from '../../../components/subcomponents/description/ItemRow';
import { Faction } from '../../../../classes/feature/faction/Faction';
import ContentsComponentAnchor, { ContentsLink } from '../../../components/subcomponents/informationpanel/ContentsComponentAnchor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';

const ScenarioDisplay = (props: any) => {
    const scenarioObject: Scenario = props.data

    function ReturnStats(statlist : Scenario) {
        return (
            <div>
                <ItemRow title={"Players"} value={() => <div>{(statlist.EvenMatch == true? "Even Match" : "Attack / Defend")}</div>}/>
                <ItemRow title={"Infiltrators"} value={() => <div>{(statlist.InfiltratorType == 0? "Not Allowed" : statlist.InfiltratorType == 1? "Allowed" : "Special")}</div>}/>
                <ItemRow title={"Battle Length"} value={() => <div>{(statlist.BattleMin == statlist.BattleMax? statlist.BattleMin : (statlist.BattleMin + "-" + statlist.BattleMax)) + " Turns"}</div>}/>
                <ItemRow title={"Standard Terrain"} value={() => <div>{(statlist.StandardTerrain == true? "Yes" : "No")}</div>}/>
                <ItemRow title={"Staggered Deployment"} value={() => <div>{(statlist.StaggeredDeployment == true? "Yes" : "No")}</div>}/>
            </div>
        )
    }

    
        
    function GetContents(scenarioObj: Scenario) {
        const ContentsList : ContentsLink[] = [];

        ContentsList.push({ name: "Forces", route: "forces"})
        ContentsList.push({ name: "Infiltrators", route: "infiltrators"})
        ContentsList.push({ name: "Battle Length", route: "battlelength"})
        ContentsList.push({ name: "Battlefield", route: "battlefield"})
        ContentsList.push({ name: "Deployment", route: "deployment"})
        ContentsList.push({ name: "Victory Conditions", route: "victory"})
        if (scenarioObj.SpecialRules != undefined) {
            if (scenarioObj.SpecialRules.length > 0) {
                ContentsList.push({ name: "Special Rules", route: "specialrules"})
            }
        }
        ContentsList.push({ name: "Glorious Deeds", route: "deeds"})

        return ( <ContentsComponentAnchor title={"Contents"} showheader={true} listofcontents={ContentsList}/> )
    }

    function runToast() 
    {
        navigator.clipboard.writeText(window.location.href)

        toast.error("Link Copied!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        type: "success"
        });
    }
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with ScenarioDisplay.tsx</div>}>
            
            <div>
                <ToastContainer
                            position="top-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light" 
                            />
                <div className="borderthin bordergrey">
                    <GenericCollapsableBlockDisplay 
                        d_name={"Battle Map"} 
                        d_colour={"grey"} 
                        d_state={false}  
                        d_margin={"sml"}
                        d_col={"default"}
                        d_border={false}
                        bordertype={0}
                        d_method={() => <div className={"bordergrey borderthin"}>
                            <div className="">
                            <img src={scenarioObject.ImgLink} style={{width:"100%"}}/>
                            </div>
                        </div>} />
                </div>
                
                <div className="verticalspacermed" />
                <div className="borderthin bordergrey">
                    {ReturnStats(scenarioObject)}
                </div>
                <div className="verticalspacermed" />
                <div>
                    {GetContents(scenarioObject)}
                </div>

                <div id={"forces"} className="verticalspacermed"/>
                <div className="">
                    <div className={'subtitle-letterspacing size-subtitle font-seriftext'}>
                        <div className='centered-div width-content '>
                            {"Forces"}
                            <div className='horizontalspacermed hovermouse'>
                                <FontAwesomeIcon icon={faLink} onClick={() => (
                                    runToast()
                                    )}/>
                            </div>
                        </div>
                    </div>
                    <div className=" colourBasicText font-default size-default ">
                        <div className="">
                        {returnDescription(scenarioObject, scenarioObject.ForcesDesc)}
                        </div>
                    </div>
                </div>
                
                <div className="verticalspacersml"/>
                <div id={"infiltrators"} className="verticalspacermed"/>
                <div className="">
                    <div className={'subtitle-letterspacing size-subtitle font-seriftext'}>
                        <div className='centered-div width-content '>
                            {"Infiltrators"}
                            <div className='horizontalspacermed hovermouse'>
                                <FontAwesomeIcon icon={faLink} onClick={() => (
                                    runToast()
                                    )}/>
                            </div>
                        </div>
                    </div>
                    <div className=" colourBasicText font-default size-default ">
                        <div className="">
                        {returnDescription(scenarioObject, scenarioObject.InfiltratorDesc)}
                        </div>
                    </div>
                </div>
                
                <div className="verticalspacersml"/>
                <div id={"battlelength"} className="verticalspacermed"/>
                <div className="">
                    <div className={'subtitle-letterspacing size-subtitle font-seriftext'}>
                        <div className='centered-div width-content '>
                            {"Battle Length"}
                            <div className='horizontalspacermed hovermouse'>
                                <FontAwesomeIcon icon={faLink} onClick={() => (
                                    runToast()
                                    )}/>
                            </div>
                        </div>
                    </div>
                    <div className=" colourBasicText font-default size-default ">
                        <div className="">
                        {returnDescription(scenarioObject, scenarioObject.BattlelengthDesc)}
                        </div>
                    </div>
                </div>

                <div className="verticalspacersml"/>
                <div id={"battlefield"} className="verticalspacermed"/>
                <div className={'subtitle-letterspacing size-subtitle font-seriftext'}>
                    <div className='centered-div width-content'>
                        {"Battlefield"}
                        <div className='horizontalspacermed hovermouse'>
                            <FontAwesomeIcon icon={faLink} onClick={() => (
                                runToast()
                                )}/>
                        </div>
                    </div>
                </div>
                <div className="colourBasicText font-default size-default">
                    {returnDescription(scenarioObject, scenarioObject.BattlefieldSize)}
                        <div >
                            {returnDescription(scenarioObject, scenarioObject.BattlefieldExtra)}
                        </div>
                        <div className="verticalspacersml"/>
                        {scenarioObject.StandardTerrain == true &&
                            <>
                                {returnDescription(scenarioObject, scenarioObject.BattlefieldTerrainStandard)}
                            </>
                        }
                </div>

                <div className="verticalspacersml"/>
                <div id={"deployment"} className="verticalspacermed"/>
                <div className={'subtitle-letterspacing size-subtitle font-seriftext'}>
                    <div className='centered-div width-content'>
                        {"Deployment"}
                        <div className='horizontalspacermed hovermouse'>
                            <FontAwesomeIcon icon={faLink} onClick={() => (
                                runToast()
                                )}/>
                        </div>
                    </div>
                </div>
                <div className="colourBasicText font-default size-default">
                {returnDescription(scenarioObject, scenarioObject.DeploymentDesc)}
                </div>

                <div className="verticalspacersml"/>
                <div id={"victory"} className="verticalspacermed"/>
                <div className={'subtitle-letterspacing size-subtitle font-seriftext'}>
                    <div className='centered-div width-content'>
                        {"Victory Conditions"}
                        <div className='horizontalspacermed hovermouse'>
                            <FontAwesomeIcon icon={faLink} onClick={() => (
                                runToast()
                                )}/>
                        </div>
                    </div>
                </div>
                <div className="colourBasicText font-default size-default">
                {returnDescription(scenarioObject, scenarioObject.VictoryDesc)}
                </div>

                {scenarioObject.SpecialRules != undefined && <>
                {scenarioObject.SpecialRules.length > 0 &&
                    <div>
                        <div className="verticalspacersml"/>
                        <div id={"specialrules"} className="verticalspacermed"/>
                        <div className={'size-subtitle font-seriftext'}>
                            <div className='subtitle-letterspacing centered-div width-content'>
                                {"Special Rules"}
                                <div className='horizontalspacermed hovermouse'>
                                    <FontAwesomeIcon icon={faLink} onClick={() => (
                                        runToast()
                                        )}/>
                                </div>
                            </div>
                        </div>
                        <div className="borderthin bordergrey">                                
                                {scenarioObject.SpecialRules.map((item) => ( 
                                    <div key={"faction_rule_"+scenarioObject.ID+"_rule_id_"+item.ID}>
                                        <GenericCollapsableBlockDisplay 
                                            d_name={item.Name} 
                                            d_colour={"grey"} 
                                            d_state={false}  
                                            d_margin={"sml"}
                                            d_col={"default"}
                                            d_border={false}
                                            bordertype={0}
                                            d_method={() => <div className={"bordergrey borderthin"}>
                                                <div className="totalmarginsml">
                                                    <RuleDisplay data={item} />
                                                </div>
                                            </div>} />
                                    </div>
                                )) }
                            </div>
                    </div>
                }</>}
                <div>
                        <div id={"deeds"} className="verticalspacersml"/>
                        <div className={'size-subtitle font-seriftext'}>
                            <div className='subtitle-letterspacing centered-div width-content'>
                                {"Glorious Deeds"}
                                <div className='horizontalspacermed hovermouse'>
                                    <FontAwesomeIcon icon={faLink} onClick={() => (
                                        runToast()
                                        )}/>
                                </div>
                            </div>
                        </div>
                        <div className="">                     
                                <div className="">
                                    <div className="">
                                        {returnDescription(scenarioObject, scenarioObject.DeedsDesc)}
                                    </div>
                                </div>
                                <div className="verticalspacersml"/>
                                <div className="borderthin bordergrey">
                                {scenarioObject.Deeds.map((item) => ( 
                                    
                                    <div key={"faction_rule_"+scenarioObject.ID+"_rule_id_"+item.ID}>
                                        <GenericCollapsableBlockDisplay 
                                            d_name={item.Name} 
                                            d_colour={"grey"} 
                                            d_state={false}  
                                            d_margin={"sml"}
                                            d_col={"default"}
                                            d_border={false}
                                            bordertype={0}
                                            d_method={() => <div className={"bordergrey borderthin"}>
                                                <div className="totalmarginsml">
                                               <GloriousDeedDisplay data={item} />
                                               </div>
                                            </div>} />
                                    </div>
                                )) }
                                </div>

                                {scenarioObject.OptionalDeeds.length > 0 &&
                                <div>
                                <div className="">
                                    <div className="verticalspacersml"/>
                                    {"If agreed by the players prior to starting the game, you may replace one of the Glory Deeds above for one of the following options:"}
                                </div>
                                <div className="borderthin bordergrey">
                                {scenarioObject.OptionalDeeds.map((item) => ( 
                                    <div key={"faction_rule_"+scenarioObject.ID+"_rule_id_"+item.ID}>
                                        <GenericCollapsableBlockDisplay 
                                            d_name={item.Name} 
                                            d_colour={"grey"} 
                                            d_state={false}  
                                            d_margin={"sml"}
                                            d_col={"default"}
                                            d_border={false}
                                            bordertype={0}
                                            d_method={() => <div className={"bordergrey borderthin"}>
                                                <div className="totalmarginsml">
                                               <GloriousDeedDisplay data={item} />
                                               </div>
                                            </div>} />
                                    </div>
                                )) }
                                </div>
                                </div>
                                }

                                
                            </div>
                    </div>
            </div>
        </ErrorBoundary>
    )
}

export default ScenarioDisplay;