import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../classes/feature/model/Model';
import { Ability } from '../../../../classes/feature/ability/Ability';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import { Rule } from '../../../../classes/feature/faction/Rule';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import { ModelUpgradeRelationship, UpgradesGrouped } from '../../../../classes/relationship/model/ModelUpgradeRelationship';
import RulesCollapsibleContent from "../../rules-content/RulesCollapsibleContent";
import RulesModelUpgrade from "../../rules-content/RulesModelUpgrade";
import { makestringpresentable } from '../../../../utility/functions';

const RuleDisplay = (props: any) => {
    const ruleObject: Rule = props.data

    const showSimple = props.show_simple;
    const showCollapse = props.show_collapse;

    const [upgradeoptions, setupgradeoptions] = useState<any[]>([])
    const [_keyvar, setkeyvar] = useState(0);

    

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
            const EventProc: EventRunner = new EventRunner()

            /**
             * MODEL STAT CHOICES
             */
            if (ruleObject.BonusUpgrades != null) {
                setupgradeoptions(SplitUpgrades(ruleObject.BonusUpgrades as any));
                setkeyvar((prev) => prev + 1);
            } else {
                const result = await EventProc.runEvent(
                    "getFactionRuleUpgrades",
                    ruleObject,
                    [],
                    [],
                    null
                );
                setupgradeoptions(SplitUpgrades(result));
                setkeyvar((prev) => prev + 1);
            }
        }
    
        SetModelOptions();
    }, []);


    return (
        <ErrorBoundary fallback={<div>Something went wrong with AbilityDisplay.tsx</div>}>
            <div key={_keyvar} className='RuleDisplay'>

                <div className={'RuleDisplay-description'}>
                    {returnDescription(ruleObject, ruleObject.Description)}
                </div>

                {/* @TODO: @Bob - what is this?*/}
                {ruleObject.MyOptions.length > 0 &&
                    <div className={'option-static-display'}>
                        <OptionSetStaticDisplay data={ruleObject.MyOptions} />
                    </div>
                }
                {Object.keys(upgradeoptions).length > 0 &&
                    <>
                    {
                        Object.keys(upgradeoptions).map((item) => (
                            <>
                                { ( showCollapse || !showSimple ) &&
                                    <div className="RuleDisplay-upgradeoptions">
                                        {/* @TODO: Change the headline string to a matching headline */}
                                        <RulesCollapsibleContent
                                            headline={makestringpresentable(item)}
                                            content={
                                                <>
                                                    {upgradeoptions[item].map((subitem: ModelUpgradeRelationship) => (
                                                        <React.Fragment
                                                            key={"model_ability_" + ruleObject.ID + "_ability_id_" + subitem.ID}>
                                                            <RulesModelUpgrade item={subitem}/>
                                                        </React.Fragment>
                                                    )) /* Abilities */}
                                                </>
                                            }
                                        />
                                    </div>
                                }

                                { (showSimple ) &&
                                    <>
                                        <hr/>
                                        <div className={'RuleDisplay-Upgrade-Title'}>
                                            {makestringpresentable(item)}
                                        </div>
                                        {upgradeoptions[item].map((subitem: ModelUpgradeRelationship) => (
                                            <React.Fragment
                                                key={"model_ability_" + ruleObject.ID + "_ability_id_" + subitem.ID}>
                                                <RulesModelUpgrade item={subitem}/>
                                            </React.Fragment>
                                        )) /* Abilities */}
                                    </>
                                }
                            </>
                        ))
                    }
                    </>
                        
                    }
                

            </div>
        </ErrorBoundary>
    )
}

export default RuleDisplay;