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
import GenericDisplay from '../../generics/GenericDisplay';
import ModelUpgradeDisplay from '../ability/ModelUpgradeDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';

const RuleDisplay = (props: any) => {
    const ruleObject: Rule = props.data
    
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
            <div key={_keyvar} className='single-rule-element'>

                <div className={'single-rule-element-description'}>
                    {returnDescription(ruleObject, ruleObject.Description)}
                </div>

                {/* @TODO: @Bob - what is this?*/}
                {ruleObject.MyOptions.length > 0 &&
                    <div className={'option-static-display'}>
                        <OptionSetStaticDisplay data={ruleObject.MyOptions} />
                    </div>
                }

                {/* @TODO: @Bob - what is this?*/}
                {upgradeoptions.length > 0 &&
                    <div className="single-rule-element-upgradeoptions">
                        <GenericCollapsableBlockDisplay
                            d_name={"Upgrades"}
                            d_colour={"grey"}
                            d_state={false}
                            d_margin={"sml"}
                            bordertype={2}
                            d_method={() => <div className="borderthintop bordergrey">
                                {upgradeoptions.map((item : ModelUpgradeRelationship) => (
                                        <div className="" key={"model_ability_"+ruleObject.ID+"_ability_id_"+item.ID}>
                                            <GenericCollapsableBlockDisplay
                                                d_name={item.UpgradeObject.Name}
                                                d_colour={"grey"}
                                                d_state={false}
                                                d_margin={"sml"}
                                                d_col={"default"}
                                                d_border={false}
                                                bordertype={(upgradeoptions.indexOf(item) < (upgradeoptions.length - 1))? 1 : 2}
                                                d_method={() => <div className={"bordergrey " + ((upgradeoptions.indexOf(item) < (upgradeoptions.length - 1))? "borderthinnosides" : "borderthicktop")}>
                                                    <div className="totalmarginsml">
                                                        <ModelUpgradeDisplay data={item} />
                                                    </div>
                                                </div>} />
                                        </div>
                                    )) /* Abilities */}

                            </div>} />
                    </div>
                }
            </div>
        </ErrorBoundary>
    )
}

export default RuleDisplay;