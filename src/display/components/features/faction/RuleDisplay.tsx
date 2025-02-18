import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
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

const RuleDisplay = (props: any) => {
    const ruleObject: Rule = props.data
    
    const [upgradeoptions, setupgradeoptions] = useState([])
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
            <div key={_keyvar} className='abilityInternalStructure'>
                <div className='row'>
                    {returnDescription(ruleObject, ruleObject.Description)}
                </div>
                <div className='row'>
                    {
                        <OptionSetStaticDisplay data={ruleObject.MyOptions} />
                    }
                </div>
                {upgradeoptions.length > 0 &&
                <div className='row'>
                    <div className='separator bodytext tagboxpad colordefault'>Upgrades</div>
                    <div className="verticalspacerbig"/>
                    <div className="row">
                        {upgradeoptions.map((item : ModelUpgradeRelationship) => ( 
                            <div key={"model_ability_"+ruleObject.ID+"_ability_id_"+item.ID}>
                                <GenericDisplay d_state={false}  d_colour={"default"} d_name={item.UpgradeObject.Name} d_type={"sub"} d_method={() => <ModelUpgradeDisplay data={item} />}/>
                                <div className="verticalspacerbig"/>
                            </div>
                        )) /* Abilities */}
                    </div>
                </div>
                }
            </div>
        </ErrorBoundary>
    )
}

export default RuleDisplay;