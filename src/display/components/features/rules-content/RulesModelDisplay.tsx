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
import {getBaseSize, getColour, getCostType, getMoveType, getPotential} from '../../../../utility/functions';
import ModelUpgradeDisplay from '../ability/ModelUpgradeDisplay';
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { IChoice } from '../../../../classes/options/StaticOption';
import ModelEquipmentDisplay from '../equipment/ModelEquipmentDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import { Form } from 'react-bootstrap';
import DisplayFactionModelDisplay from '../model/DisplayFactionModelDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import RulesModelDisplayCollapse from '../../../components/features/rules-content/RulesModelDisplayCollapse';
import ItemRow from '../../../components/subcomponents/description/ItemRow';
import {FactionModelRelationship} from "../../../../classes/relationship/faction/FactionModelRelationship";
import RulesModelUpgrade from "./RulesModelUpgrade";

const RulesModelDisplay = (props: any) => {
    const factionmodelObject: FactionModelRelationship = props.data
    const modelcollectionObject: Model = props.data.Model

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
            <ItemRow
                title={"Stat Options"}
                value={() =>
                    <div className="maxwidth">
                        <Form.Control className={"borderstyler bordergrey overcomeradius hovermouse maxwidth" } as="select" aria-label="Default select example"  placeholder="Member Type" >
                            {statchoice.map((item) => (
                                <option key={"modeloption"+(statchoice.indexOf(item).toString())} >{ReturnStatProfileAsString(item)}</option>
                            ))}
                        </Form.Control>
                    </div>
                }
            />
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
            <>
                {statlist.movement != undefined &&
                    <>
                        <ItemStat title={"Movement"} ratio="rectangle" value={(statlist.movement?.toString() || "") + "\"" + (statlist.movetype? " " + getMoveType(statlist.movetype) : " Infantry")}/>
                    </>
                }
                {statlist.melee != undefined &&
                    <>
                        <ItemStat title={"Melee"} value={(statlist.melee? (statlist.melee > 0? "+": "") : "") + (statlist.melee?.toString() || "")}/>
                    </>
                }
                {statlist.ranged != undefined &&
                    <>
                        <ItemStat title={"Ranged"} value={(statlist.ranged? (statlist.ranged > 0? "+": "") : "") + (statlist.ranged?.toString() || "")}/>
                    </>
                }
                {statlist.armour != undefined &&
                    <>
                        <ItemStat title={"Armour"} value={statlist.armour?.toString() || ""}/>
                    </>
                }
            </>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelDisplay.tsx</div>}>
            <div className='fighter-card' key={_keyvar}>
                <div className="fighter-card-title">
                    {modelcollectionObject.Name}
                </div>

                <div className="fighter-card-meta fighter-card-meta-above">
                    <div className="fighter-meta-entry-simple fighter-cost">
                        <span className="fighter-meta-label">
                            Cost:
                        </span>
                        <span className="fighter-meta-value">
                            {factionmodelObject.Cost + " " + getCostType(factionmodelObject.CostType)}
                        </span>
                    </div>
                    <div className="fighter-meta-entry-simple fighter-availability">
                        <span className="fighter-meta-label">
                            Availability:
                        </span>
                        <span className="fighter-meta-value">
                            {factionmodelObject.Minimum.toString() + "-"+ factionmodelObject.Maximum.toString()}
                        </span>
                    </div>
                </div>


                <div className="fighter-card-stats">
                    {ReturnStats(modelcollectionObject.Stats)  /* Stats */}
                </div>

                {/* Abilities */}
                {modelcollectionObject.Abilities.length > 0 &&
                    <RulesModelDisplayCollapse
                        name={"Abilities"}
                        state={false}
                        has_children={modelcollectionObject.Abilities.length > 0}
                        method={() => <>
                            {modelcollectionObject.Abilities.map((item) => (
                                <RulesModelDisplayCollapse
                                    key={"model_ability_" + modelcollectionObject.ID + "_ability_id_" + item.ID}
                                    name={item.Name}
                                    state={true}
                                    method={() => <>
                                        <AbilityDisplay data={item} />
                                    </>
                                    }
                                />
                            ))}
                        </>
                        }
                    />
                }

                {/* Equipment Rules */}
                {modelcollectionObject.Description &&
                    <RulesModelDisplayCollapse
                        name={"Equipment"}
                        state={false}
                        method={() => <>
                            {returnDescription(modelcollectionObject, modelcollectionObject.Description)}
                        </>
                        }
                    />
                }

                {/* Upgrades */}
                {modelcollectionObject.UpgradeList.length > 0 &&
                    <RulesModelDisplayCollapse
                        name={"Upgrades"}
                        state={false}
                        has_children={modelcollectionObject.UpgradeList.length > 0}
                        method={() => <>
                            {modelcollectionObject.UpgradeList.map((item) => (
                                <RulesModelDisplayCollapse
                                    key={"model_upgrade_" + modelcollectionObject.ID + "_upgrade_id_" + item.ID}
                                    name={item.UpgradeObject.Name}
                                    state={true}
                                    method={() => <>
                                        <RulesModelUpgrade item={item}/>
                                    </>
                                    }
                                />
                            ))}
                        </>
                        }
                    />
                }

                {/* Lore Text */}
                {modelcollectionObject.Lore &&
                    <RulesModelDisplayCollapse
                        name={"Lore"}
                        state={false}
                        method={() => <>
                            {returnDescription(modelcollectionObject, modelcollectionObject.Lore)}
                        </>
                        }
                    />
                }

                <div className="fighter-card-meta fighter-card-meta-below">
                    <div className="fighter-meta-entry-simple fighter-base">
                        <span className="fighter-meta-label">
                            Base:
                        </span>
                        <span className="fighter-meta-value">
                            {/* @TODO: @Bob: How do we connect a base option like with the Lion of Jabir? Basically it should just be the string "[Option1]/[Option2]" */}
                            {modelcollectionObject.Stats.base + "mm"}
                        </span>
                    </div>

                    <div className="fighter-meta-entry-simple fighter-keywords">
                        <span className="fighter-meta-label">
                            Keywords:
                        </span>
                        <span className="fighter-meta-value">
                            {modelcollectionObject.KeyWord.map((item, index) => (
                                <span className=''
                                      key={"model_keyword_" + modelcollectionObject.ID + "_keyword_id_" + item.ID}>
                                    <GenericHover
                                        d_colour={modelcollectionObject.Team}
                                        titlename={item.Name}
                                        d_name={item.Name}
                                        d_type={""}
                                        d_method={() => <KeywordDisplay data={item}/>}
                                    />
                                    {index < modelcollectionObject.KeyWord.length - 1 && ", "}
                                </span>
                            )) /* Keywords */}
                        </span>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default RulesModelDisplay;