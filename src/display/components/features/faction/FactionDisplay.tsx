import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ToastContainer, toast } from 'react-toastify';
import { returnDescription } from '../../../../utility/util'
import { Model } from '../../../../classes/feature/model/Model';
import { containsTag, getBaseSize, getColour, getMoveType, getPotential } from '../../../../utility/functions';
import { Faction } from '../../../../classes/feature/faction/Faction';
import RuleDisplay from './RuleDisplay';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import ContentsComponentAnchor, { ContentsLink } from '../../../components/subcomponents/informationpanel/ContentsComponentAnchor';
import RulesHeadlineDisplay from "../../rules-content/RulesHeadlineDisplay";
import RulesArmouryElement from "../../rules-content/RulesArmouryElement";
import RulesAnchorLinks from "../../rules-content/RulesAnchorLinks";
import RulesLoreSection from "../../rules-content/RulesLoreSection";
import RulesFactionModelDisplay from "../../rules-content/RulesFactionModelDisplay";
import RulesFactionRule from "../../rules-content/RulesFactionRule";
import RulesModelDisplay from '../../rules-content/RulesModelDisplay';

const FactionDisplay = (props: any) => {
    const factionObject: Faction = props.data

    const [selections, setSelections] = useState<Record<string, any>>({});
    const [usekey, setusekey] = useState(0);

    function ModelIsElite(model : Model) {
        for (let i = 0; i < model.KeyWord.length; i++) {
            if (model.KeyWord[i].ID == "kw_elite") {
                return true;
            }
        }

        return false
    }
    
    const UpdateForSelection = (optionSetId: string, selectedModel: any) => {
        setSelections(prev => ({ ...prev, [optionSetId]: selectedModel }));
        setusekey(usekey + 1);
    };
    
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
                        />


            {GetContents(factionObject)}

            <RulesLoreSection faction={factionObject} />

            {factionObject.Rules.length > 0 &&
                <div className={'rules-faction-rules-wrap'}>
                    <RulesHeadlineDisplay
                        content="Faction Rules"
                        level={2}
                        className=""
                    />

                    {factionObject.Rules.map((item) => (

                        <RulesFactionRule key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}
                            headline={item.Name}
                            content={<RuleDisplay data={item} show_simple={true} />}
                        />

                    ))}
                </div>
            }

            {factionObject.MyOptions.length > 0 &&
                <>
                    <RulesHeadlineDisplay
                        content="Warband Options"
                        level={2}
                        className=""
                    />
                    {
                        <OptionSetStaticDisplay data={factionObject.MyOptions} onSelectionChange={UpdateForSelection}/>
                    }
                </>
            }

            <div key={usekey}>
            {factionObject.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).length > 0 &&
                <>
                    <RulesHeadlineDisplay
                        content="Captains"
                        level={2}
                        className=""
                    />

                    {factionObject.Models.filter((item) => (item.Captain == true && item.Mercenary == false)).map((item) => (
                        <RulesModelDisplay  key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} data={item} faction={factionObject} optionselections={selections}/>

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
                        <RulesModelDisplay  key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} data={item} faction={factionObject} optionselections={selections} />

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
                        <RulesModelDisplay  key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} data={item} faction={factionObject} optionselections={selections} />
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
                        <RulesModelDisplay  key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID} data={item} faction={factionObject} />
                    )) /* Abilities */}


                </>
                }
            </div>
            {factionObject.EquipmentItems.length > 0 &&
                <>
                    <RulesHeadlineDisplay
                        content="Armoury"
                        level={2}
                        className=""
                    />

                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "melee" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                        <RulesArmouryElement
                            headline="Melee Weapons"
                            items={factionObject.EquipmentItems.filter(
                                (item) => item.EquipmentItem.Category === "melee" && !containsTag(item.Tags, "exploration_only")
                            )}
                        />
                    }

                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "ranged" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                        <RulesArmouryElement
                            headline="Ranged Weapons"
                            items={factionObject.EquipmentItems.filter(
                                (item) => item.EquipmentItem.Category === "ranged" && !containsTag(item.Tags, "exploration_only")
                            )}
                        />
                    }

                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "armour" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                        <RulesArmouryElement
                            headline="Armour"
                            items={factionObject.EquipmentItems.filter(
                                (item) => item.EquipmentItem.Category === "armour" && !containsTag(item.Tags, "exploration_only")
                            )}
                        />
                    }
                    {factionObject.EquipmentItems.filter((item) => (item.EquipmentItem.Category == "equipment" && (containsTag(item.Tags, "exploration_only") == false))).length > 0 &&
                        <RulesArmouryElement
                            headline="Equipment"
                            items={factionObject.EquipmentItems.filter(
                                (item) => item.EquipmentItem.Category === "equipment" && !containsTag(item.Tags, "exploration_only")
                            )}
                        />
                    }
                    {factionObject.EquipmentItems.filter((item) => ((containsTag(item.Tags, "exploration_only") == true))).length > 0 &&
                        <RulesArmouryElement
                            headline="Exploration Only"
                            items={factionObject.EquipmentItems.filter(
                                (item) => containsTag(item.Tags, "exploration_only")
                            )}
                        />
                    }

                </>
            }
        </ErrorBoundary>
    )
}

export default FactionDisplay;