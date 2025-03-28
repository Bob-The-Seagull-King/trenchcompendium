import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ToastContainer, toast } from 'react-toastify';
import { returnDescription } from '../../../../utility/util'
import { Model } from '../../../../classes/feature/model/Model';
import GenericDisplay from '../../generics/GenericDisplay';
import AbilityDisplay from '../ability/AbilityDisplay';
import GenericHover from '../../generics/GenericHover';
import KeywordDisplay from '../glossary/KeywordDisplay';
import ItemStat from '../../subcomponents/description/ItemStat';
import { ModelStatistics } from '../../../../classes/feature/model/ModelStats';
import { containsTag, getBaseSize, getColour, getMoveType, getPotential } from '../../../../utility/functions';
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
import FactionEquipmentWideDisplay from '../equipment/FactionEquipmentWideDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import ContentsComponentAnchor, { ContentsLink } from '../../../components/subcomponents/informationpanel/ContentsComponentAnchor';
import ModelDisplay from '../model/ModelDisplay';

const FactionDisplay = (props: any) => {
    const factionObject: Faction = props.data

    console.log(factionObject);

    function ModelIsElite(model : Model) {
        for (let i = 0; i < model.KeyWord.length; i++) {
            if (model.KeyWord[i].ID == "kw_elite") {
                return true;
            }
        }

        return false
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
    
    function GetContents(factionobj: Faction) {
        const ContentsList : ContentsLink[] = [];

        ContentsList.push({ name: "Description", route: "lore"})
        if (factionobj.Rules.length > 0) {
            ContentsList.push({ name: "Rules", route: "rules"})
        }
        if (factionobj.MyOptions.length > 0) {
            ContentsList.push({ name: "Warband Options", route: "options"})
        }
        if (factionobj.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).length > 0) {
            ContentsList.push({ name: "Captains", route: "captains"})
        }
        if (factionobj.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == true))).length > 0) {
            ContentsList.push({ name: "Elite Units", route: "elite"})
        }
        if (factionobj.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == false))).length > 0) {
            ContentsList.push({ name: "Infantry Units", route: "infantry"})
        }
        if (factionobj.Models.filter((item) => (item.Mercenary == true)).length > 0) {
            ContentsList.push({ name: "Mercenaries", route: "mercenary"})
        }
        ContentsList.push({ name: "Armoury", route: "armoury"})

        return ( <ContentsComponentAnchor title={"Contents"} showheader={true} listofcontents={ContentsList}/> )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionDisplay.tsx</div>}>
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

                <div>
                    <div>
                        {GetContents(factionObject)}
                    </div>
                    <div>
                        <div id={"lore"} className="verticalspacermed"/>
                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                            <div className='centered-div width-content'>
                                {"Description"}
                                <div className='horizontalspacermed hovermouse'>
                                    <FontAwesomeIcon icon={faLink} onClick={() => (
                                        runToast()
                                        )}/>
                                </div>
                            </div>
                        </div>
                        <div className="borderthin bordergrey">
                        <GenericCollapsableBlockDisplay 
                            d_name={"Lore"} 
                            d_colour={"grey"} 
                            d_state={false}  
                            bordertype={0}
                            d_border={false}
                            d_margin={"sml"}
                            d_method={() => <>
                                <div className="borderthin backgroundBgCard bordergrey">
                                    <div className="totalmarginsml">
                                        {returnDescription(factionObject, factionObject.Description) /* Description */}
                                    </div>
                                </div>
                            </>} />
                        </div>
                        
                    </div>
                    {factionObject.Rules.length > 0 &&
                        <>
                            <div id={"rules"} className="verticalspacermed"/>
                            <div className={'size-subtitle colorBasicText font-seriftext'}>
                                <div className='centered-div width-content'>
                                    {"Rules"}
                                    <div className='horizontalspacermed hovermouse'>
                                        <FontAwesomeIcon icon={faLink} onClick={() => (
                                            runToast()
                                            )}/>
                                    </div>
                                </div>
                            </div>
                            <div>
                            <div className="borderthin bordergrey">
                                {factionObject.Rules.map((item) => ( 
                                    <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}>
                                    <GenericCollapsableBlockDisplay 
                                    d_name={item.Name} 
                                    d_colour={"grey"} 
                                    d_state={false}  
                                    bordertype={0}
                                    d_border={false}
                                    d_margin={"sml"}
                                    d_method={() => <>
                                        <div className="borderthin backgroundBgCard bordergrey">
                                            <div>
                                                <RuleDisplay data={item} />
                                            </div>
                                        </div>
                                    </>} />
                                    </div>
                                )) /* Abilities */}
                            </div>
                            </div>
                        </>
                    }
                    
                    {factionObject.MyOptions.length > 0 &&
                        <div>
                            <div id={"options"} className="verticalspacermed"/>
                            <div className={'size-subtitle colorBasicText font-seriftext'}>
                                <div className='centered-div width-content'>
                                    {"Warband Options"}
                                    <div className='horizontalspacermed hovermouse'>
                                        <FontAwesomeIcon icon={faLink} onClick={() => (
                                            runToast()
                                            )}/>
                                    </div>
                                </div>
                            </div>
                            {
                                <OptionSetStaticDisplay data={factionObject.MyOptions} />
                            }
                        </div>
                    }
                </div>
                    
                {factionObject.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).length > 0 &&
                        <>
                            <div className="verticalspacermed"/>
                            <div className="borderthin bordergrey">
                                <div className="borderthin bordergrey backgroundBgCard">
                                    <div className="totalmarginsml">
                                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                                            <div id={"captains"} className='centered-div width-content'>
                                                {"Captains"}
                                                <div className='horizontalspacermed hovermouse'>
                                                    <FontAwesomeIcon icon={faLink} onClick={() => (
                                                        runToast()
                                                        )}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {factionObject.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}>
                                            <FactionModelDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </div>                     
                        </>
                    }    
                {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == true))).length > 0 &&
                    <>
                        <div className="verticalspacermed"/>
                        <div className="borderthin bordergrey">
                            <div className="borderthin bordergrey backgroundBgCard">
                                <div className="totalmarginsml">
                                    <div className={'size-subtitle colorBasicText font-seriftext'}>
                                        <div id={"elite"} className='centered-div width-content'>
                                            {"Elite Units"}
                                            <div className='horizontalspacermed hovermouse'>
                                                <FontAwesomeIcon icon={faLink} onClick={() => (
                                                    runToast()
                                                    )}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == true))).map((item) => ( 
                                    <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}>
                                        <FactionModelDisplay data={item} />
                                    </div>
                                )) /* Abilities */}
                            </div>
                        </div>
                    </>
                    } 
                {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == false))).length > 0 &&
                    <>
                        <div className="verticalspacermed"/>
                        <div className="borderthin bordergrey">
                            <div className="borderthin bordergrey backgroundBgCard">
                                <div className="totalmarginsml">
                                    <div className={'size-subtitle colorBasicText font-seriftext'}>
                                        <div id={"infantry"} className='centered-div width-content'>
                                            {"Infantry Units"}
                                            <div className='horizontalspacermed hovermouse'>
                                                <FontAwesomeIcon icon={faLink} onClick={() => (
                                                    runToast()
                                                    )}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == false))).map((item) => ( 
                                    <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}>
                                        <FactionModelDisplay data={item} />
                                    </div>
                                )) /* Abilities */}
                            </div>
                        </div>                          
                    </>
                    }
                
                {factionObject.Models.filter((item) => (item.Mercenary == true)).length > 0 &&
                    <>
                        <div className="verticalspacermed"/>
                        <div className="borderthin bordergrey">
                            <div className="borderthin bordergrey backgroundBgCard">
                                <div className="totalmarginsml">
                                    <div className={'size-subtitle colorBasicText font-seriftext'}>
                                        <div id={"mercenary"} className='centered-div width-content'>
                                            {"Mercenaries"}
                                            <div className='horizontalspacermed hovermouse'>
                                                <FontAwesomeIcon icon={faLink} onClick={() => (
                                                    runToast()
                                                    )}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                {factionObject.Models.filter((item) => (item.Mercenary == true)).map((item) => ( 
                                    <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}>
                                        <FactionModelDisplay data={item} />
                                    </div>
                                )) /* Abilities */}
                            </div>
                        </div>  
                        
                    </>
                    }
                
                {factionObject.EquipmentItems.length > 0 &&
                    <>
                        <div id={"armoury"} className="verticalspacermed"/>
                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                            <div className='centered-div width-content'>
                                {"Armoury"}
                                <div className='horizontalspacermed hovermouse'>
                                    <FontAwesomeIcon icon={faLink} onClick={() => (
                                        runToast()
                                        )}/>
                                </div>
                            </div>
                        </div>
                        
                    <div className='abilityInternalStructure'>
                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "melee" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                        <>
                            <div className="verticalspacermed"/>
                            <div className="borderthin bordergrey">
                                <div className="borderthin bordergrey backgroundBgCard">
                                    <div className="totalmarginsml">
                                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                                            <div className='centered-div width-content'>
                                                {"Melee"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "melee" && (containsTag(item.Tags, "exploration_only") == false))).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </div> 
                        </>
                    }
                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "ranged" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                        <>
                            <div className="verticalspacermed"/>
                            <div className="borderthin bordergrey">
                                <div className="borderthin bordergrey backgroundBgCard">
                                    <div className="totalmarginsml">
                                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                                            <div className='centered-div width-content'>
                                                {"Ranged"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "ranged" && (containsTag(item.Tags, "exploration_only") == false))).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </div> 
                        </>
                    }
                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "armour" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                        <>
                            <div className="verticalspacermed"/>
                            <div className="borderthin bordergrey">
                                <div className="borderthin bordergrey backgroundBgCard">
                                    <div className="totalmarginsml">
                                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                                            <div className='centered-div width-content'>
                                                {"Armour"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "armour" && (containsTag(item.Tags, "exploration_only") == false))).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </div> 
                        </>
                    }
                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "equipment" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                        <>
                            <div className="verticalspacermed"/>
                            <div className="borderthin bordergrey">
                                <div className="borderthin bordergrey backgroundBgCard">
                                    <div className="totalmarginsml">
                                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                                            <div className='centered-div width-content'>
                                                {"Equipment"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "equipment" && (containsTag(item.Tags, "exploration_only") == false))).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </div> 
                        </>
                    }
                    {factionObject.EquipmentItems.filter((item) => ((containsTag(item.Tags, "exploration_only") == true))).length > 0 &&
                        <>
                            <div className="verticalspacermed"/>
                            <div className="borderthin bordergrey">
                                <div className="borderthin bordergrey backgroundBgCard">
                                    <div className="totalmarginsml">
                                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                                            <div className='centered-div width-content'>
                                                {"Exploration Only"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                {factionObject.EquipmentItems.filter((item) => ( (containsTag(item.Tags, "exploration_only") == true))).map((item) => ( 
                                        <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} className="textmaxwidth">
                                            <FactionEquipmentDisplay data={item} />
                                        </div>
                                    )) /* Abilities */}
                                </div>
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