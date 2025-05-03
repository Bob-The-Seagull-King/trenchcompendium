import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { Ability } from '../../../classes/feature/ability/Ability';
import AdvancedDescriptionItemDisplay from "../subcomponents/description/AdvancedDescriptionItemDisplay";
import OptionSetStaticDisplay from '../subcomponents/description/OptionSetStaticDisplay';

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

                <OptionSetStaticDisplay data={abilityObject.MyOptions} />
                
            </div>
        </ErrorBoundary>
    )
}

export default RulesModelDisplayAbility;