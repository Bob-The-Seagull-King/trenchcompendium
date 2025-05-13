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
import { ModelUpgradeRelationship } from '../../../../classes/relationship/model/ModelUpgradeRelationship';
import RulesCollapsibleContent from "../../rules-content/RulesCollapsibleContent";
import RulesModelUpgrade from "../../rules-content/RulesModelUpgrade";

const RuleDisplay = (props: any) => {
    const ruleObject: Rule = props.data

    const showSimple = props.show_simple;
    const showCollapse = props.show_collapse;

    const [upgradeoptions, setupgradeoptions] = useState<any[]>([])
    const [_keyvar, setkeyvar] = useState(0);

    
    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner()

            /**
             * MODEL STAT CHOICES
             */
            if (ruleObject.BonusUpgrades != null) {
                setupgradeoptions(ruleObject.BonusUpgrades as any);
                setkeyvar((prev) => prev + 1);
            } else {
                const result = await EventProc.runEvent(
                    "getFactionRuleUpgrades",
                    ruleObject,
                    [],
                    [],
                    null
                );
                setupgradeoptions(result);
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

                {/* Upgrade Options - with toggle to show simple inside off collapses or as collapse outside */}
                {upgradeoptions.length > 0 &&
                    <>
                        { ( showCollapse || !showSimple ) &&
                            <div className="RuleDisplay-upgradeoptions">
                                {/* @TODO: Change the headline string to a matching headline */}
                                <RulesCollapsibleContent
                                    headline={'Upgrades'}
                                    content={
                                        <>
                                            {upgradeoptions.map((item: ModelUpgradeRelationship) => (
                                                <React.Fragment
                                                    key={"model_ability_" + ruleObject.ID + "_ability_id_" + item.ID}>
                                                    <RulesModelUpgrade item={item}/>
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
                                    {'Options'}
                                </div>
                                {upgradeoptions.map((item: ModelUpgradeRelationship) => (
                                    <React.Fragment
                                        key={"model_ability_" + ruleObject.ID + "_ability_id_" + item.ID}>
                                        <RulesModelUpgrade item={item}/>
                                    </React.Fragment>
                                )) /* Abilities */}
                            </>
                        }
                    </>

                }

            </div>
        </ErrorBoundary>
    )
}

export default RuleDisplay;