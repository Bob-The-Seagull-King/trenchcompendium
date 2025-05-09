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
import {
    getModelStatArmour,
    getModelStatMelee,
    getModelStatMove,
    getModelStatRanged,
    ModelStatistics
} from '../../../../classes/feature/model/ModelStats';
import {getBaseSize, getColour, getCostType, getMoveType, getPotential} from '../../../../utility/functions';
import ModelUpgradeDisplay from '../ability/ModelUpgradeDisplay';
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { IChoice } from '../../../../classes/options/StaticOption';
import ModelEquipmentDisplay from '../equipment/ModelEquipmentDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import { Form } from 'react-bootstrap';
import DisplayFactionModelDisplay from './DisplayFactionModelDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import RulesModelDisplayCollapse from '../../../components/rules-content/RulesModelDisplayCollapse';
import ItemRow from '../../../components/subcomponents/description/ItemRow';
import {FactionModelRelationship} from "../../../../classes/relationship/faction/FactionModelRelationship";
import FighterCardTitle from "../../rules-content/FighterCard/FighterCardTitle";
import FighterCardImageWrap from "../../rules-content/FighterCard/FighterCardImageWrap";
import FighterCardMetaEntry from "../../rules-content/FighterCard/FighterCardMetaEntry";
import FighterCardStats from "../../rules-content/FighterCard/FighterCardStats";
import FighterCardMetaEntryKeywords from "../../rules-content/FighterCard/FighterCardMetaEntryKeywords";
import SynodModelImageSource from "../../../../utility/SynodModelImageSource";
import {useSynodModelImageData} from "../../../../utility/useSynodModelImageData";
import RulesEquipmentEntry from "../../rules-content/RulesEquipmentEntry";
import RulesModelDisplayAbility from "../../rules-content/RulesModelDisplayAbility";

const ModelDisplay = (props: any) => {
    const modelcollectionObject: Model = props.data

    const [equiprestrictions, setEquipRestrictions] = useState([])
    const [equiplimits, setEquipLimits] = useState([])
    const [statchoices, setstatchoices] = useState([])
    const [_keyvar, setkeyvar] = useState(0);

    const sourceData = useSynodModelImageData(modelcollectionObject.GetSlug());

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


    // use Base Size
    const [baseSize, setBaseSize] = useState<string | null>(null);

    useEffect(() => {
        modelcollectionObject.getBaseSizeString().then(setBaseSize);
    }, [modelcollectionObject]);

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelDisplay.tsx</div>}>
            <div className='ModelDisplay fighter-card' key={_keyvar}>
                <FighterCardTitle
                    name={modelcollectionObject.getName()}
                />

                <div className={'fighter-card-main-area'}>
                    <FighterCardImageWrap
                        model_slug={modelcollectionObject.GetSlug()}
                    />

                    <FighterCardStats
                        movement={getModelStatMove(modelcollectionObject.Stats)}
                        melee={getModelStatRanged(modelcollectionObject.Stats)}
                        ranged={getModelStatMelee(modelcollectionObject.Stats)}
                        armour={getModelStatArmour(modelcollectionObject.Stats)}
                    />

                    <div className="fighter-card-meta fighter-card-meta-below">
                        <FighterCardMetaEntry
                            className="fighter-base"
                            label="Base"
                            value={baseSize}
                        />

                        <FighterCardMetaEntryKeywords
                            keywords={modelcollectionObject.getKeywords()}
                            modelId={modelcollectionObject.ID}
                        />

                        {!sourceData.loading && !sourceData.error && sourceData.sourceUrl &&
                            <FighterCardMetaEntry
                                className="synod-image-source-wrap"
                                label="Image"
                                value={<SynodModelImageSource
                                    modelSlug={modelcollectionObject.GetSlug()}
                                />}
                            />
                        }
                    </div>
                </div>

                {/* @TODO: what is this? */}
                {statchoices.length > 0 &&
                    <div className={'findme-5 statchoices'}>
                        {statchoices.map((item) => (
                            <span key={item} className="">
                                {
                                    ReturnStatOption(item)
                                }
                            </span>
                        ))}
                    </div>
                }

                <RulesModelDisplayCollapse
                    name={"Rules"}
                    state={false}
                    method={() => <div>
                        {returnDescription(modelcollectionObject, modelcollectionObject.Description) /* Equipment Description */}
                    </div>
                    }
                />


                {modelcollectionObject.Abilities.length > 0 &&

                    <>
                        <RulesModelDisplayCollapse
                            name={"Abilities"}
                            state={false}
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
                    </>
                }

                {((modelcollectionObject.EquipmentList.length > 0) || (equiprestrictions.length > 0) || (equiplimits.length > 0)) &&

                    <RulesModelDisplayCollapse
                        name={"Equipment"}
                        state={false}
                        method={() => <>

                            {/* @TODO: Is this needed? What is this? Where is it used?*/}
                            {((equiprestrictions.length > 0) || (equiplimits.length > 0)) &&
                                <div className="borderthin bordergrey">
                                    <div className=" ">
                                        <ul className="">
                                            {equiprestrictions.map((item) => (
                                                <li key={item} className=" nowrap">
                                                    {
                                                        item
                                                    }
                                                </li>
                                            ))}
                                            {equiplimits.map((item) => (
                                                <li key={item} className="nowrap">
                                                    {
                                                        item
                                                    }
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            }

                            {/* Equipment list */}
                            {(modelcollectionObject.EquipmentList.length > 0) &&
                                <>
                                    {modelcollectionObject.EquipmentList.map((item) => (
                                        <ModelEquipmentDisplay
                                            key={item.ID}
                                            team_col={modelcollectionObject.Team}
                                            data={item}/>
                                    )) /* Abilities */}
                                </>
                            }
                        </>}
                    />
                }

                {/* @TODO: Is this needed here?*/}
                {modelcollectionObject.UpgradeList.length > 0 &&
                    <div>
                        <GenericCollapsableBlockDisplay
                            d_name={"Upgrades"}
                            d_colour={"grey"}
                            d_state={false}
                            d_margin={"sml"}
                            bordertype={0}
                            d_method={() => <>
                                {modelcollectionObject.UpgradeList.map((item) => (
                                    <div key={"model_upgrade_" + modelcollectionObject.ID + "_upgrade_id_" + item.ID}>
                                        <GenericCollapsableBlockDisplay
                                            d_name={item.UpgradeObject.Name}
                                            d_colour={"grey"}
                                            d_state={false}
                                            d_border={false}
                                            d_margin={"sml"}
                                            bordertype={0}
                                            d_method={() => <div className="borderthin bordergrey">
                                                <div className="">
                                                    <ModelUpgradeDisplay data={item}/>
                                                </div>
                                            </div>}/>
                                    </div>
                                )) /* Abilities */}
                            </>}/>
                    </div>
                }

                {/* @TODO: What is this? */}
                {modelcollectionObject.Models.length > 0 && false &&
                    <>
                        <GenericCollapsableBlockDisplay
                            d_name={"Found In"}
                            d_colour={"grey"}
                            d_state={false}
                            d_border={false}
                            d_margin={"sml"}
                            bordertype={0}
                            d_method={() => <div className="borderthin bordergrey">
                                <div className="">
                                    {modelcollectionObject.Models.map((item) => (
                                        <div key={"faction_rule_" + modelcollectionObject.ID + "_rule_id_" + item.ID}
                                             className="textmaxwidth">
                                            <DisplayFactionModelDisplay data={item}/>
                                        </div>
                                    )) /* Abilities */}
                                </div>
                            </div>}/>
                    </>
                }

                { modelcollectionObject.Lore.length > 0 &&
                    <RulesModelDisplayCollapse
                        name={"Lore"}
                        state={false}
                        method={() =>
                            <>
                                {returnDescription(modelcollectionObject, modelcollectionObject.Lore) /* Lore */}
                            </>
                        }
                    />
                }

            </div>
        </ErrorBoundary>
    )
}

export default ModelDisplay;