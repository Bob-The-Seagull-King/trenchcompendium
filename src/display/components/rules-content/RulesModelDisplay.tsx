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
import {getBaseSize, getColour, getCostType, getMoveType, getPotential, makestringpresentable} from '../../../utility/functions';
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

const RulesModelDisplay = (props: any) => {
    const factionmodelObject: FactionModelRelationship = props.data
    const modelcollectionObject: Model = props.data.Model
    const parentfaction : Faction = props.faction;
    const bonusselections = props.optionselections

    const [statchoices, setstats] = useState({})
    const [upgrades, setupgrades] = useState<UpgradesGrouped>({})
    const [abilities, setabilities] = useState<Ability[]>([])
    const [BaseString, setBaseString] = useState('')
    const [minimum, setminimum] = useState("")
    const [maximum, setmaximum] = useState("")
    const [_keyvar, setkeyvar] = useState(0);

    const sourceData = useSynodModelImageData(modelcollectionObject.GetSlug());


    // Render no lore if loreshow !== 'true'
    const [loreshow] = useGlobalState('loreshow');

    function getAvailabilityString() {
        if (minimum == maximum) {
            if (minimum == "0") {
                return "Unlimited"
            } else {
                return minimum
            }
        }
        return minimum + "-" + maximum
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
                console.log(modelcollectionObject.Name)
                console.log(bonusselections);
                if (bonusselections != undefined && (Object.entries(bonusselections).length > 0)) {
                    for (const [optionSetId, selectedObject] of Object.entries(bonusselections)) {
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
                } else {
                    setupgrades(SplitUpgrades(result_upgrades));
                }
            } else {
                setupgrades(modelcollectionObject.GetSplitUpgrades())
            }

            /* ABILITIES */
            if (parentfaction != undefined) {
                const result_abilities = await factionmodelObject.getContextuallyAvailableAbilities(parentfaction);
                if (bonusselections != undefined && (Object.entries(bonusselections).length > 0)) {
                    for (const [optionSetId, selectedObject] of Object.entries(bonusselections)) {
                        if ((selectedObject as IChoice).value instanceof ContextObject) {
                        const Events : EventRunner = new EventRunner();
                        const result = await Events.runEvent(
                            "getContextuallyAddedAbilities",
                            (selectedObject as IChoice).value,
                            [],
                            result_abilities,
                            modelcollectionObject
                        )
                        setabilities(result)
                        }
                    }
                } else {
                    setabilities(result_abilities);
                }
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
                            value={getAvailabilityString()}
                        />
                    </div>

                    <FighterCardStats
                        movement={getModelStatMove(statchoices)}
                        melee={getModelStatRanged(statchoices)}
                        ranged={getModelStatMelee(statchoices)}
                        armour={getModelStatArmour(statchoices)}
                    />

                    <div className="fighter-card-meta fighter-card-meta-below">
                        <FighterCardMetaEntry
                            className="fighter-base"
                            label="Base"
                            value={BaseString}
                        />

                        <FighterCardMetaEntryKeywords
                            keywords={factionmodelObject.getKeywords()}
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