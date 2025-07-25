import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../utility/util'
import { Model } from '../../../classes/feature/model/Model';
import GenericHover from '../generics/GenericHover';
import KeywordDisplay from '../features/glossary/KeywordDisplay';
import ItemStat from '../subcomponents/description/ItemStat';
import {
    getModelStatArmour,
    getModelStatMelee,
    getModelStatMove,
    getModelStatRanged,
    ModelStatistics,
    PresentModelStatistics
} from '../../../classes/feature/model/ModelStats';
import {getBaseSize, getColour, getCostType, getMoveType, getPotential, isNumber, makestringpresentable} from '../../../utility/functions';
import RulesModelDisplayCollapse from '../../components/rules-content/RulesModelDisplayCollapse';
import {FactionModelRelationship} from "../../../classes/relationship/faction/FactionModelRelationship";
import RulesModelUpgrade from "./RulesModelUpgrade";
import RulesModelDisplayAbility from "./RulesModelDisplayAbility";
import {useGlobalState} from "../../../utility/globalstate";
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import ModelEquipmentDisplay from '../features/equipment/ModelEquipmentDisplay';
import SynodModelImage from "../../../utility/SynodModelImage";
import SynodModelImageSource from "../../../utility/SynodModelImageSource";
import { ModelUpgradeRelationship, UpgradesGrouped } from '../../../classes/relationship/model/ModelUpgradeRelationship';
import { Faction } from '../../../classes/feature/faction/Faction';
import { Ability } from '../../../classes/feature/ability/Ability';
import FighterCardTitle from "./FighterCard/FighterCardTitle";
import FighterCardImageWrap from "./FighterCard/FighterCardImageWrap";
import FighterCardMetaEntry from "./FighterCard/FighterCardMetaEntry";
import FighterCardStats from "./FighterCard/FighterCardStats";
import FighterCardMetaEntryKeywords from "./FighterCard/FighterCardMetaEntryKeywords";
import {useSynodModelImageData} from "../../../utility/useSynodModelImageData";
import { ContextObject } from '../../../classes/contextevent/contextobject';
import { IChoice } from '../../../classes/options/StaticOption';
import { Keyword } from '../../../classes/feature/glossary/Keyword';
import { KeywordFactory } from '../../../factories/features/KeywordFactory';

const RulesModelDisplay = (props: any) => {
    const factionmodelObject: FactionModelRelationship = props.data
    const modelcollectionObject: Model = props.data.Model
    const parentfaction : Faction = props.faction;
    const bonusselections = props.optionselections

    const [statchoices, setstats] = useState({})
    const [upgrades, setupgrades] = useState<UpgradesGrouped>({})
    const [abilities, setabilities] = useState<Ability[]>([])
    const [keywordsList, setkeywords] = useState<Keyword[]>([])
    const [BaseString, setBaseString] = useState('')
    const [minimum, setminimum] = useState("")
    const [maximum, setmaximum] = useState("")
    const [_keyvar, setkeyvar] = useState(0);

    async function getKeywords(abilities: Ability[]) {
        
        setkeyvar(_keyvar + 1);
    }

    // Render no lore if loreshow !== 'true'
    const [loreshow] = useGlobalState('loreshow');

    function getAvailabilityString() {
        if ((minimum[0] == undefined) || (maximum[0] == undefined)) {
            return "";
        }
        if (minimum[0] == maximum[0]) {
            if (minimum[0] == "0") {
                return "Unlimited"
            } else {
                return minimum[0]
            }
        }
        if (isNumber(maximum[0]) && isNumber(maximum[0])) {
            return minimum[0] + "-" + maximum[0]
        } else if (isNumber(minimum[0])) {
            if (Number(minimum[0]) == 0) {
                return "";
            }
            return minimum[0]
        } else {
            return "";
        }
    }

    function getAvailabilityExtra() {
        const infostring : string[] = [];
        for (let i = 0; i < minimum.length; i++) {
            if (!isNumber(minimum[i])) {
                infostring.push(minimum[i])
            }
        }
        for (let i = 0; i < maximum.length; i++) {
            if (!isNumber(maximum[i])) {
                infostring.push(maximum[i])
            }
        }
        return infostring.join(", ")
    }

    function getAvailabilityDOM() {
        const Numbers = getAvailabilityString();
        const Extras = getAvailabilityExtra();
        return (
                <>
                {Numbers.length > 0 &&
                    <>
                        {Numbers}
                    </>
                }
                {Extras.length > 0 &&
                    <>
                    {(Numbers.length > 0) && 
                        <>
                            <br/>
                            <span className="fighter-meta-subval">{Extras}</span>
                        </>
                    }
                    {(Numbers.length == 0) && 
                        <>
                            {Extras}
                        </>
                    }
                    </>
                }
            </>
        )
    }

    function SplitUpgrades(UpgradeListFull : ModelUpgradeRelationship[]) : UpgradesGrouped {

        const groups : UpgradesGrouped = {}

        for (let i = 0; i < UpgradeListFull.length; i++) {
            const special_cat = UpgradeListFull[i].GetSpecialCategory()
            if (groups[special_cat]) {
                groups[special_cat].push(UpgradeListFull[i])
            } else {
                groups[special_cat] = [UpgradeListFull[i]]
            }
        }
        return groups;
    }

    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner();
                            
            /* UPGRADES */
            if (parentfaction != undefined) {
                const result_upgrades = await factionmodelObject.getContextuallyAvailableUpgrades(parentfaction);
                if (bonusselections != undefined && (Object.entries(bonusselections).filter((item) => (item[1] != null)).length > 0)) {
                    for (const [optionSetId, selectedObject] of Object.entries(bonusselections)) {
                        if (selectedObject != null && selectedObject != undefined) {
                            if ((selectedObject as IChoice).value instanceof ContextObject) {
                            const Events : EventRunner = new EventRunner();
                            const result = await Events.runEvent(
                                "getContextuallyAddedUpgrades",
                                (selectedObject as IChoice).value,
                                [],
                                result_upgrades,
                                modelcollectionObject
                            )
                            setupgrades(SplitUpgrades(result))
                            }
                        }
                    }
                } else {
                    setupgrades(SplitUpgrades(result_upgrades));
                }
            } else {
                setupgrades(modelcollectionObject.GetSplitUpgrades())
            }

            /* ABILITIES */
            let cur_abilities = modelcollectionObject.Abilities
            if (parentfaction != undefined) {
                const result_abilities = await factionmodelObject.getContextuallyAvailableAbilities(parentfaction);
                if (bonusselections != undefined && (Object.entries(bonusselections).filter((item) => (item[1] != null)).length > 0)) {
                    for (const [optionSetId, selectedObject] of Object.entries(bonusselections)) {
                        if (selectedObject != null && selectedObject != undefined) {
                        if ((selectedObject as IChoice).value instanceof ContextObject) {
                        const Events : EventRunner = new EventRunner();
                        const result = await Events.runEvent(
                            "getContextuallyAddedAbilities",
                            (selectedObject as IChoice).value,
                            [],
                            result_abilities,
                            modelcollectionObject
                        )
                        cur_abilities = result
                        setabilities(result)
                        }}
                    }
                } else {
                    cur_abilities = result_abilities
                    setabilities(result_abilities);
                }
            } else {
                cur_abilities = modelcollectionObject.Abilities
                setabilities(modelcollectionObject.Abilities)
            }

            /* KEYWORDS */
            const KeywordsList : Keyword[] = []

            const BaseKeywords : Keyword[] = factionmodelObject.getKeywords();
            let IDString : string[] = []

            for (let i = 0; i < BaseKeywords.length; i++) {
                IDString.push(BaseKeywords[i].ID)
            }

            for (let i = 0; i < cur_abilities.length; i++) {
                const Events : EventRunner = new EventRunner();
                IDString = await Events.runEvent(
                    "getContextuallyRelevantKeywordsByID",
                    cur_abilities[i],
                    [],
                    IDString,
                    modelcollectionObject
                )
            }

            for (let i = 0; i < IDString.length; i++) {
                const Keyword = await KeywordFactory.CreateNewKeyword(IDString[i], null)
                KeywordsList.push(Keyword);
            }

            setkeywords(KeywordsList)
            await getKeywords(abilities);

            /* MODEL MIN/MAX */                
            const result_max = await EventProc.runEvent(
                "getModelLimitPresentation",
                factionmodelObject,
                [],
                [factionmodelObject.Maximum.toString()],
                true
            );
            setmaximum(result_max);

            const result_min = await EventProc.runEvent(
                "getModelLimitPresentation",
                factionmodelObject,
                [],
                [factionmodelObject.Minimum.toString()],
                false
            );
            setminimum(result_min);

            /* MODEL STAT CHOICES */
            const result = await modelcollectionObject.GetPresentableStatistics()
            setstats(result);

            const baseresult = await factionmodelObject.getBaseSizeString();
            setBaseString(baseresult);
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);



    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelDisplay.tsx</div>}>
            <section className='RulesModelDisplay fighter-card' key={_keyvar}>
                <FighterCardTitle
                    name={factionmodelObject.getName()}
                />

                <div className={'fighter-card-main-area'}>
                    <FighterCardImageWrap
                        model_slug={modelcollectionObject.GetSlug()}
                    />

                    <div className="fighter-card-meta fighter-card-meta-above">
                        <FighterCardMetaEntry
                            className="fighter-cost"
                            label="Cost"
                            value={factionmodelObject.getCostString()}
                        />

                        <FighterCardMetaEntry
                            className="fighter-availability"
                            label="Availability"
                            value={getAvailabilityDOM()}
                        />
                    </div>

                    <FighterCardStats
                        movement={getModelStatMove(statchoices)}
                        melee={getModelStatMelee(statchoices)}
                        ranged={getModelStatRanged(statchoices)}
                        armour={getModelStatArmour(statchoices)}
                    />

                    <div className="fighter-card-meta fighter-card-meta-below" key={_keyvar}>
                        <FighterCardMetaEntry
                            className="fighter-base"
                            label="Base"
                            value={BaseString}
                        />

                        <FighterCardMetaEntryKeywords
                            key={_keyvar}
                            keywords={keywordsList}
                            modelId={modelcollectionObject.ID}
                        />

                        <FighterCardMetaEntry
                                className="synod-image-source-wrap"
                                label="Image"
                                value={<SynodModelImageSource
                                    modelSlug={modelcollectionObject.GetSlug()}
                                />}
                            />

                    </div>
                </div>


                <div className={'fighter-card-collapse-wrap'} key={_keyvar}>
                    {/* Abilities */}
                    {abilities.length > 0 &&
                        <RulesModelDisplayCollapse
                            name={"Abilities"}
                            state={false}
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
                                <div className={'description-wrap'}>
                                    {returnDescription(modelcollectionObject, modelcollectionObject.Description)}
                                </div>

                                {(modelcollectionObject.getUniqueEquipment().length > 0) &&
                                    <>
                                        {modelcollectionObject.getUniqueEquipment().map((item) => (
                                            <ModelEquipmentDisplay
                                                team_col={modelcollectionObject.Team}
                                                key={item.ID}
                                                data={item}
                                            />
                                        ))}
                                    </>

                                }
                            </>
                            }
                        />
                    }

                    {/* Upgrades */}
                    {Object.keys(upgrades).length > 0 &&
                    <>
                    {
                        Object.keys(upgrades).map((item) => (
                            <RulesModelDisplayCollapse
                                key={item}
                                name={makestringpresentable(item)}
                                state={false}
                                has_children={factionmodelObject.hasUpgrades()}
                                method={() => <>
                                    {upgrades[item].map((subitem : ModelUpgradeRelationship) => (
                                        <React.Fragment
                                            key={"model_upgrade_" + modelcollectionObject.ID + "_upgrade_id_" + subitem.ID}>
                                            <RulesModelUpgrade item={subitem}/>
                                        </React.Fragment>
                                    ))}
                                </>
                                }
                            />
                        ))
                    }
                    </>
                        
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