import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../utility/util'
import { Model } from '../../../classes/feature/model/Model';
import GenericHover from '../generics/GenericHover';
import KeywordDisplay from '../features/glossary/KeywordDisplay';
import ItemStat from '../subcomponents/description/ItemStat';
import { ModelStatistics, PresentModelStatistics } from '../../../classes/feature/model/ModelStats';
import {getBaseSize, getColour, getCostType, getMoveType, getPotential} from '../../../utility/functions';
import RulesModelDisplayCollapse from '../../components/rules-content/RulesModelDisplayCollapse';
import {FactionModelRelationship} from "../../../classes/relationship/faction/FactionModelRelationship";
import RulesModelUpgrade from "./RulesModelUpgrade";
import RulesModelDisplayAbility from "./RulesModelDisplayAbility";
import {useGlobalState} from "../../../utility/globalstate";
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import ModelEquipmentDisplay from '../features/equipment/ModelEquipmentDisplay';
import SynodModelImage from "../../../utility/SynodModelImage";
import SynodModelImageSource from "../../../utility/SynodModelImageSource";
import { ModelUpgradeRelationship } from '../../../classes/relationship/model/ModelUpgradeRelationship';
import { Faction } from '../../../classes/feature/faction/Faction';
import { Ability } from '../../../classes/feature/ability/Ability';

const RulesModelDisplay = (props: any) => {
    const factionmodelObject: FactionModelRelationship = props.data
    const modelcollectionObject: Model = props.data.Model
    const parentfaction : Faction = props.faction;

    const [statchoices, setstats] = useState({})
    const [upgrades, setupgrades] = useState<ModelUpgradeRelationship[]>([])
    const [abilities, setabilities] = useState<Ability[]>([])
    const [BaseString, setBaseString] = useState('')
    const [minimum, setminimum] = useState("")
    const [maximum, setmaximum] = useState("")
    const [_keyvar, setkeyvar] = useState(0);

    // Render no lore if loreshow !== 'true'
    const [loreshow] = useGlobalState('loreshow');

    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner();
                            
            /* UPGRADES */
            if (parentfaction != undefined) {
                const result_upgrades = await factionmodelObject.getContextuallyAvailableUpgrades(parentfaction);
                setupgrades(result_upgrades);
            } else {
                setupgrades(modelcollectionObject.UpgradeList)
            }

            /* ABILITIES */
            if (parentfaction != undefined) {
                const result_abilities = await factionmodelObject.getContextuallyAvailableAbilities(parentfaction);
                setabilities(result_abilities);
            } else {
                setabilities(modelcollectionObject.Abilities)
            }


            /* MODEL MIN/MAX */                
            const result_max = await EventProc.runEvent(
                "getModelLimitPresentation",
                factionmodelObject,
                [],
                [factionmodelObject.Maximum.toString()],
                true
            );
            setmaximum(result_max.join(", "));

            const result_min = await EventProc.runEvent(
                "getModelLimitPresentation",
                factionmodelObject,
                [],
                [factionmodelObject.Minimum.toString()],
                false
            );
            setminimum(result_min.join(", "));

            /* MODEL STAT CHOICES */
            const result = await modelcollectionObject.GetPresentableStatistics()
            setstats(result);

            const baseresult = await factionmodelObject.getBaseSizeString();
            setBaseString(baseresult);
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);



    function ReturnStats(stats : PresentModelStatistics) {
        const movestats: string[] = []   
        const typestats: string[] = []
        const meleestats: string[] = []
        const rangedstats: string[] = []
        const armourstats: string[] = []

        if (stats.movement != undefined) {
            for (let i = 0; i < stats.movement?.length; i++) {
                movestats.push(stats.movement[i].toString())
            }
        }
        if (stats.movetype != undefined) {
            for (let i = 0; i < stats.movetype?.length; i++) {
                typestats.push(getMoveType(stats.movetype[i]))
            }
        }

        if (stats.melee  != undefined) {
            for (let i = 0; i < stats.melee.length; i++) {
                const val = stats.melee[i];
                const prefix = val > 0 ? "+" : val < 0 ? "-" : "";
                meleestats.push(prefix + Math.abs(val));
            }
        } else {
            meleestats.push('0');
        }

        if (stats.ranged != undefined) {
            for (let i = 0; i < stats.ranged?.length; i++) {
                const val = stats.ranged[i];
                const prefix = val > 0 ? "+" : val < 0 ? "-" : "";
                rangedstats.push(prefix + Math.abs(val));
            }
        } else {
            rangedstats.push('0');
        }

        if (stats.armour != undefined) {
            for (let i = 0; i < stats.armour?.length; i++) {
                armourstats.push(stats.armour[i].toString())
            }
        } else {
            armourstats.push('0');
        }

        return (
            <>
                {stats.movement != undefined &&
                    <>
                        <ItemStat title={"Movement"} value={(movestats.join('/') + '"/' + (typestats.join('/')))}/>
                    </>
                }
                {meleestats.length >= 0 &&
                    <>
                        <ItemStat title={"Melee"} value={meleestats.join('/')}/>
                    </>
                }
                {rangedstats.length >= 0 &&
                    <>
                        <ItemStat title={"Ranged"} value={rangedstats.join('/')}/>
                    </>
                }
                {armourstats.length >= 0 != undefined &&
                    <>
                        <ItemStat title={"Armour"} value={armourstats.join('/')}/>
                    </>
                }
            </>
        )
    }

    // function returnBaseSize(stats : PresentModelStatistics) {
    //
    //     const basestats: string[] = []
    //
    //     if (stats.base != undefined) {
    //         for (let i = 0; i < stats.base?.length; i++) {
    //             const curstats : string[] = []
    //             for (let j = 0; j < stats.base[i].length; j++) {
    //                 curstats.push(stats.base[i][j].toString());
    //             }
    //             basestats.push(curstats.join('x') + "mm")
    //         }
    //     }
    //
    //     return basestats.join('/')
    // }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelDisplay.tsx</div>}>
            <section className='fighter-card' key={_keyvar}>
                <div className="fighter-card-title">
                    {factionmodelObject.getName()}
                </div>

                <div className={'fighter-card-main-area'}>
                    <div className={'fighter-image-wrap'}>
                        <SynodModelImage
                            modelSlug={modelcollectionObject.GetSlug()}
                            size="medium"
                            className="fighter-image"
                        />
                    </div>
                    <div className="fighter-card-meta fighter-card-meta-above">
                        <div className="fighter-meta-entry-simple fighter-cost">
                        <span className="fighter-meta-label">
                            Cost:
                        </span>
                            <span className="fighter-meta-value">
                            {factionmodelObject.getCostString()}
                        </span>
                        </div>
                        <div className="fighter-meta-entry-simple fighter-availability">
                        <span className="fighter-meta-label">
                            Availability:
                        </span>
                            <span className="fighter-meta-value">
                            {minimum + "-" + maximum}
                        </span>
                        </div>
                    </div>

                    <div className="fighter-card-stats">
                        {ReturnStats(statchoices)  /* Stats */}
                    </div>

                    <div className="fighter-card-meta fighter-card-meta-below">
                        <div className="fighter-meta-entry-simple fighter-base">
                            <span className="fighter-meta-label">
                                Base:
                            </span>
                            <span className="fighter-meta-value">
                                {BaseString}
                            </span>
                        </div>

                        {factionmodelObject.hasKeywords() &&
                            <div className="fighter-meta-entry-simple fighter-keywords">
                                <span className="fighter-meta-label">
                                    Keywords:
                                </span>
                                <span className="fighter-meta-value">
                                    {factionmodelObject.getKeywords().map((item, index) => (
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
                        }

                        <div className="fighter-meta-entry-simple synod-image-source-wrap">
                            {'Image: '}

                            <SynodModelImageSource
                                modelSlug={factionmodelObject.GetSlug()}
                            />
                        </div>

                    </div>
                </div>


                <div className={'fighter-card-collapse-wrap'} key={_keyvar}>
                    {/* Abilities */}
                    {abilities.length > 0 &&
                        <RulesModelDisplayCollapse
                            name={"Abilities"}
                            state={false}
                            has_children={factionmodelObject.hasAbilities()}
                            method={() => <>
                                {abilities.map((item) => (
                                    <React.Fragment
                                        key={"model_ability_" + modelcollectionObject.ID + "_ability_id_" + item.ID}>
                                        <RulesModelDisplayAbility data={item}/>
                                    </React.Fragment>
                                ))}
                            </>
                            }
                        />
                    }

                    {/* Equipment Rules */}
                    {factionmodelObject.hasDescription() &&
                        <RulesModelDisplayCollapse
                            name={"Equipment"}
                            state={false}
                            method={() => <>
                                {returnDescription(modelcollectionObject, modelcollectionObject.Description)}
                                {(modelcollectionObject.EquipmentList.length > 0) &&

                                    <div className={'container bordergrey'}>
                                        <div className={"backgroundgrey"}/>
                                        <div className="content">
                                            <div>
                                                {modelcollectionObject.EquipmentList.map((item) => (
                                                    <div key={item.ID}>
                                                        <ModelEquipmentDisplay team_col={modelcollectionObject.Team}
                                                                               data={item}/>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                }
                            </>
                            }
                        />
                    }

                    {/* Upgrades */}
                    {upgrades.length > 0 &&
                        <RulesModelDisplayCollapse
                            name={"Upgrades"}
                            state={false}
                            has_children={factionmodelObject.hasUpgrades()}
                            method={() => <>
                                {upgrades.map((item) => (
                                    <React.Fragment
                                        key={"model_upgrade_" + modelcollectionObject.ID + "_upgrade_id_" + item.ID}>
                                        <RulesModelUpgrade item={item}/>
                                    </React.Fragment>
                                ))}
                            </>
                            }
                        />
                    }

                    {/* Lore Text */}
                    {factionmodelObject.hasLore() && loreshow !== 'false' &&
                        <RulesModelDisplayCollapse
                            name={"Lore"}
                            state={false}
                            method={() => <>
                                {returnDescription(modelcollectionObject, modelcollectionObject.Lore)}
                            </>
                            }
                        />
                    }
                </div>
            </section>
        </ErrorBoundary>
    )
}

export default RulesModelDisplay;