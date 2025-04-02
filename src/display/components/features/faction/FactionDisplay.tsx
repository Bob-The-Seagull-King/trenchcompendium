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
import RulesHeadlineDisplay from "../rules-content/RulesHeadlineDisplay";
import RulesArmouryElementDisplay from "../rules-content/RulesArmouryElementDisplay";
import RulesAnchorLinks from "../rules-content/RulesAnchorLinks";
import RulesLoreSection from "../rules-content/RulesLoreSection";
import RulesFactionModelDisplay from "../rules-content/RulesFactionModelDisplay";
import RulesFactionRule from "../rules-content/RulesFactionRule";

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

        ContentsList.push({ name: "Lore", route: "lore"})

        if (factionobj.Rules.length > 0) {
            ContentsList.push({ name: "Faction Rules", route: "rules"})
        }
        if (factionobj.MyOptions.length > 0) {
            ContentsList.push({ name: "Warband Options", route: "options"})
        }
        if (factionobj.Models.filter((item) => (item.Captain && !item.Mercenary)).length > 0) {
            ContentsList.push({ name: "Captains", route: "captains"})
        }
        if (factionobj.Models.filter((item) => (!item.Captain && !item.Mercenary && ModelIsElite(item.Model))).length > 0) {
            ContentsList.push({ name: "Elite", route: "elite"})
        }
        if (factionobj.Models.filter((item) => (!item.Captain && !item.Mercenary && !ModelIsElite(item.Model))).length > 0) {
            ContentsList.push({ name: "Infantry", route: "infantry"})
        }
        if (factionobj.Models.filter((item) => item.Mercenary).length > 0) {
            ContentsList.push({ name: "Mercenaries", route: "mercenary"})
        }
        ContentsList.push({ name: "Armoury", route: "armoury"})

        return ( <RulesAnchorLinks title={"Contents"} listofcontents={ContentsList}/> )
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


                {GetContents(factionObject)}

                <RulesLoreSection
                    headline={factionObject.Name + " lore"}
                    content={returnDescription(factionObject, factionObject.Description)}
                />

                {factionObject.Rules.length > 0 &&
                    <>
                        <RulesHeadlineDisplay
                            content="Faction Rules"
                            level={2}
                            className=""
                        />

                        {factionObject.Rules.map((item) => (

                            <RulesFactionRule key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}
                                headline={item.Name}
                                content={<RuleDisplay data={item} />}
                            />

                        ))}
                    </>
                }

                {factionObject.MyOptions.length > 0 &&
                    <div>
                        <div id={"options"} className="verticalspacermed"/>
                        <div className={'subtitle-letterspacing size-subtitle font-seriftext'}>
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
                <div className="verticalspacermed"/>

                {factionObject.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).length > 0 &&
                    <>
                        <RulesHeadlineDisplay
                            content="Captains"
                            level={2}
                            className=""
                        />

                        {factionObject.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).map((item) => (
                            <RulesFactionModelDisplay key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} data={item} />

                        )) /* Abilities */}

                    </>
                }
                {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == true))).length > 0 &&
                    <>
                        <RulesHeadlineDisplay
                            content="Elite"
                            level={2}
                            className=""
                        />

                        {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == true))).map((item) => (
                            <RulesFactionModelDisplay key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} data={item} />

                        )) /* Abilities */}
                    </>
                    } 
                {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == false))).length > 0 &&
                    <>
                        <RulesHeadlineDisplay
                            content="Infantry"
                            level={2}
                            className=""
                        />
                        {factionObject.Models.filter((item) => (item.Captain == false && item.Mercenary == false && (ModelIsElite(item.Model) == false))).map((item) => (
                            <RulesFactionModelDisplay key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} data={item} />
                        )) /* Abilities */}
                    </>
                    }
                
                {factionObject.Models.filter((item) => (item.Mercenary == true)).length > 0 &&
                    <>
                        <RulesHeadlineDisplay
                            content="Mercenaries"
                            level={2}
                            className=""
                        />

                        {factionObject.Models.filter((item) => (item.Mercenary == true)).map((item) => (
                            <RulesFactionModelDisplay key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} data={item} />
                        )) /* Abilities */}

                        
                    </>
                    }
                
                {factionObject.EquipmentItems.length > 0 &&
                    <>

                        <RulesHeadlineDisplay
                            content="Armoury"
                            level={2}
                            className=""
                        />

                        {/* @TODO @Bob - Can we make this filtering easier to use / understand? Like factionObject.EquipmentItems.getItems('melee') or something */}
                        {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "melee" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                            <RulesArmouryElementDisplay
                                headline="Melee Weapons"
                                items={factionObject.EquipmentItems.filter(
                                    (item) => item.EquipmentItem.Category === "melee" && !containsTag(item.Tags, "exploration_only")
                                )}
                            />
                        }

                        {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "ranged" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                            <RulesArmouryElementDisplay
                                headline="Ranged Weapons"
                                items={factionObject.EquipmentItems.filter(
                                    (item) => item.EquipmentItem.Category === "ranged" && !containsTag(item.Tags, "exploration_only")
                                )}
                            />
                        }

                        {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "armour" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                            <RulesArmouryElementDisplay
                                headline="Armour"
                                items={factionObject.EquipmentItems.filter(
                                    (item) => item.EquipmentItem.Category === "armour" && !containsTag(item.Tags, "exploration_only")
                                )}
                            />
                        }
                        {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "equipment" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                            <RulesArmouryElementDisplay
                                headline="Equipment"
                                items={factionObject.EquipmentItems.filter(
                                    (item) => item.EquipmentItem.Category === "equipment" && !containsTag(item.Tags, "exploration_only")
                                )}
                            />
                        }
                        {factionObject.EquipmentItems.filter((item) => ((containsTag(item.Tags, "exploration_only") == true))).length > 0 &&
                            <RulesArmouryElementDisplay
                                headline="Exploration Only"
                                items={factionObject.EquipmentItems.filter(
                                    (item) => containsTag(item.Tags, "exploration_only")
                                )}
                            />
                        }
                        
                    </>
                }
            </div>
        </ErrorBoundary>
    )
}

export default FactionDisplay;