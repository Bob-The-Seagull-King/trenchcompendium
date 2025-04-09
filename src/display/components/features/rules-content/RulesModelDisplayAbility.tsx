import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../classes/feature/model/Model';
import { Ability } from '../../../../classes/feature/ability/Ability';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import AdvancedDescriptionItemDisplay from "../../subcomponents/description/AdvancedDescriptionItemDisplay";

const RulesModelDisplayAbility = (props: any) => {
    const abilityObject: Ability = props.data
    const ability_id = abilityObject.ID;

    return (
        <ErrorBoundary fallback={<div>Something went wrong with AbilityDisplay.tsx</div>}>
            <div className='ability'>
                <span className={'ability-name'}>
                    {abilityObject.Name + ": "}
                </span>

                <p className={'ability-description'}>
                    {abilityObject.Description.map((item) => (
                        <React.Fragment key={ability_id+"descriptionDisplay"}>
                            <AdvancedDescriptionItemDisplay data={item} parent={abilityObject}/>
                        </React.Fragment>
                    ))}
                </p>
            </div>
        </ErrorBoundary>
    )
}

export default RulesModelDisplayAbility;