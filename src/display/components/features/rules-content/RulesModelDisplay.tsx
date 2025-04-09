import '../../../../resources/styles/vendor/bootstrap.css'
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
import { ModelStatistics, PresentModelStatistics } from '../../../../classes/feature/model/ModelStats';
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
import RulesModelDisplayAbility from "./RulesModelDisplayAbility";
import AdvancedDescriptionItemDisplay from "../../subcomponents/description/AdvancedDescriptionItemDisplay";
import {useGlobalState} from "../../../../utility/globalstate";

const RulesModelDisplay = (props: any) => {
    const factionmodelObject: FactionModelRelationship = props.data
    const modelcollectionObject: Model = props.data.Model

    const [statchoices, setstats] = useState({})
    const [_keyvar, setkeyvar] = useState(0);

    // Render no lore if loreshow !== 'true'
    const [loreshow] = useGlobalState('loreshow');

    useEffect(() => {
        async function SetModelOptions() {
            /**
             * MODEL STAT CHOICES
             */
            const result = await modelcollectionObject.GetPresentableStatistics()
            setstats(result);
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);

    function ReturnStatOption(statchoice : ModelStatistics[]) {

        return (
            <ItemRow
                title={"Stat Options"}
                value={() =>
                    <div className="">
                        <Form.Control className={"borderstyler bordergrey overcomeradius " } as="select" aria-label="Default select example"  placeholder="Member Type" >
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
            ProfileString.push( "Movement:" + (stats.movement? stats.movement.toString() : "") + "\"" )
        }
        if (stats.movetype != undefined) {
            ProfileString.push("Move-Type:" + getMoveType(stats.movetype))
        }
        if (stats.melee != undefined) {
            ProfileString.push("Melee:" + ((stats.melee > 0? "+": "") ) + (stats.melee?.toString() || ""))
        }
        if (stats.ranged != undefined) {
            ProfileString.push("Ranged:" + ((stats.ranged > 0? "+": "") ) + (stats.ranged?.toString() || ""))
        }
        if (stats.armour != undefined) {
            ProfileString.push("Armour:" + stats.armour.toString())
        }
        if (stats.potential != undefined) {
            ProfileString.push("Potential:" + (stats.potential? getPotential(stats.potential) : "Standard"))
        }
        if (stats.base != undefined) {
            ProfileString.push("Base:" + (stats.base? getBaseSize(stats.base) : "25mm"))
        }

        return ProfileString.join(' ')
    }

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

        if (stats.melee != undefined) {
            for (let i = 0; i < stats.melee?.length; i++) {
                meleestats.push(((stats.melee[i] > 0? "+": stats.melee[i] < 0? "-" :"") ) + (stats.melee?.toString() || ""))
            }
        }
        if (stats.ranged != undefined) {
            for (let i = 0; i < stats.ranged?.length; i++) {
                rangedstats.push(((stats.ranged[i] > 0? "+": stats.ranged[i] < 0? "-" :"") ) + (stats.melee?.toString() || ""))
            }
        }
        if (stats.armour != undefined) {
            for (let i = 0; i < stats.armour?.length; i++) {
                armourstats.push(stats.armour[i].toString())
            }
        }
        return (
            <>
                {stats.movement != undefined &&
                    <>
                        <ItemStat title={"Movement"} ratio="rectangle" value={(movestats.join('/'))}/>
                    </>
                }
                {stats.movetype != undefined &&
                    <>
                        <ItemStat title={"Move Type"} ratio="rectangle" value={(typestats.join('/'))}/>
                    </>
                }
                {stats.melee != undefined &&
                    <>
                        <ItemStat title={"Melee"} value={meleestats.join('/')}/>
                    </>
                }
                {stats.ranged != undefined &&
                    <>
                        <ItemStat title={"Ranged"} value={rangedstats.join('/')}/>
                    </>
                }
                {stats.armour != undefined &&
                    <>
                        <ItemStat title={"Armour"} value={armourstats.join('/')}/>
                    </>
                }
            </>
        )
    }

    function returnBaseSize(stats : PresentModelStatistics) {
        
        const basestats: string[] = []

        if (stats.base != undefined) {
            for (let i = 0; i < stats.base?.length; i++) {
                const curstats : string[] = []
                for (let j = 0; j < stats.base[i].length; j++) {
                    curstats.push(stats.base[i][j].toString());
                }
                basestats.push(curstats.join('x') + "mm")
            }
        }

        return basestats.join('/')
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelDisplay.tsx</div>}>
            <section className='fighter-card' key={_keyvar}>
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
                            {factionmodelObject.Minimum.toString() + "-" + factionmodelObject.Maximum.toString()}
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
                            {returnBaseSize(statchoices)}
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

                <div className={'fighter-card-collapse-wrap'}>
                    {/* Abilities */}
                    {modelcollectionObject.Abilities.length > 0 &&
                        <RulesModelDisplayCollapse
                            name={"Abilities"}
                            state={false}
                            has_children={modelcollectionObject.Abilities.length > 0}
                            method={() => <>
                                {modelcollectionObject.Abilities.map((item) => (
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
                    {modelcollectionObject.Lore && loreshow !== 'false' &&
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