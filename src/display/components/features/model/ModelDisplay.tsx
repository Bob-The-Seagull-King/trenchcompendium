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
import {getBaseSize, getColour, getCostType, getMoveType, getPotential, makestringpresentable} from '../../../../utility/functions';
import ModelEquipmentDisplay from '../equipment/ModelEquipmentDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import RulesModelDisplayCollapse from '../../../components/rules-content/RulesModelDisplayCollapse';
import FighterCardTitle from "../../rules-content/FighterCard/FighterCardTitle";
import FighterCardImageWrap from "../../rules-content/FighterCard/FighterCardImageWrap";
import FighterCardMetaEntry from "../../rules-content/FighterCard/FighterCardMetaEntry";
import FighterCardStats from "../../rules-content/FighterCard/FighterCardStats";
import FighterCardMetaEntryKeywords from "../../rules-content/FighterCard/FighterCardMetaEntryKeywords";
import SynodModelImageSource from "../../../../utility/SynodModelImageSource";
import {useSynodModelImageData} from "../../../../utility/useSynodModelImageData";
import RulesEquipmentEntry from "../../rules-content/RulesEquipmentEntry";
import RulesModelDisplayAbility from "../../rules-content/RulesModelDisplayAbility";
import {useGlobalState} from "../../../../utility/globalstate";
import { Ability } from '../../../../classes/feature/ability/Ability';
import { UpgradesGrouped, ModelUpgradeRelationship } from '../../../../classes/relationship/model/ModelUpgradeRelationship';
import RulesModelUpgrade from '../../../components/rules-content/RulesModelUpgrade';
import { Keyword } from '../../../../classes/feature/glossary/Keyword';

const ModelDisplay = (props: any) => {
    const ModelObject: Model = props.data
    
    const [statchoices, setstats] = useState({})
    const [upgrades, setupgrades] = useState<UpgradesGrouped>({})
    const [abilities, setabilities] = useState<Ability[]>([])
    const [BaseString, setBaseString] = useState('')
    const [_keyvar, setkeyvar] = useState(0);

    const sourceData = useSynodModelImageData(ModelObject.GetSlug());
    
    // Render no lore if loreshow !== 'true'
    const [loreshow] = useGlobalState('loreshow');

    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner();

            setupgrades(ModelObject.GetSplitUpgrades())

            setabilities(ModelObject.Abilities)

            /* MODEL STAT CHOICES */
            const result = await ModelObject.GetPresentableStatistics()
            setstats(result);

            const baseresult = await ModelObject.getBaseSizeString();
            setBaseString(baseresult);
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);
    



    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelDisplay.tsx</div>}>
            <section className='RulesModelDisplay fighter-card' key={_keyvar}>
                <FighterCardTitle
                    name={ModelObject.getName()}
                />

                <div className={'fighter-card-main-area'}>
                    <FighterCardImageWrap
                        model_slug={ModelObject.GetSlug()}
                    />

                    <FighterCardStats
                        movement={getModelStatMove(statchoices)}
                        melee={getModelStatMelee(statchoices)}
                        ranged={getModelStatRanged(statchoices)}
                        armour={getModelStatArmour(statchoices)}
                    />

                    <div className="fighter-card-meta fighter-card-meta-below">
                        {ModelObject.isVariant() &&
                            <FighterCardMetaEntry
                                className="fighter-variant"
                                label="Variant of"
                                value={ModelObject.GetBaseVariantName()}
                            />
                        }


                        <FighterCardMetaEntry
                            className="fighter-base"
                            label="Base"
                            value={BaseString}
                        />

                        <FighterCardMetaEntryKeywords
                            keywords={ModelObject.getKeywords()}
                            modelId={ModelObject.ID}
                        />

                        {sourceData != undefined && 
                            <>
                                {!sourceData.loading && !sourceData.error && sourceData.sourceUrl &&
                                    <FighterCardMetaEntry
                                        className="synod-image-source-wrap"
                                        label="Image"
                                        value={<SynodModelImageSource
                                            modelSlug={ModelObject.GetSlug()}
                                        />}
                                    />
                                }
                            </>
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
                                        key={"model_ability_" + ModelObject.ID + "_ability_id_" + item.ID}>
                                        <RulesModelDisplayAbility data={item}/>
                                    </React.Fragment>
                                ))}
                            </>
                            }
                        />
                    }

                    {/* Equipment Rules */}
                    {ModelObject.hasDescription() &&
                        <RulesModelDisplayCollapse
                            name={"Rules"}
                            state={false}
                            method={() => <>
                                {returnDescription(ModelObject, ModelObject.Description)}

                                {(ModelObject.getUniqueEquipment().length > 0) &&
                                    <div className={'container bordergrey'}>
                                        <div className={"backgroundgrey"}/>
                                        <div className="content">
                                            <div>
                                                {ModelObject.getUniqueEquipment().map((item) => (
                                                    <div key={item.ID}>
                                                        <ModelEquipmentDisplay team_col={ModelObject.Team}
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
                                has_children={ModelObject.hasUpgrades()}
                                method={() => <>
                                    {upgrades[item].map((subitem : ModelUpgradeRelationship) => (
                                        <React.Fragment
                                            key={"model_upgrade_" + ModelObject.ID + "_upgrade_id_" + subitem.ID}>
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
                    {ModelObject.Lore.length > 0 && loreshow !== 'false' &&
                        <RulesModelDisplayCollapse
                            name={"Lore"}
                            state={false}
                            method={() => <>
                                {returnDescription(ModelObject, ModelObject.Lore)}
                            </>
                            }
                        />
                    }
                </div>
            </section>
        </ErrorBoundary>
    )
}

export default ModelDisplay;