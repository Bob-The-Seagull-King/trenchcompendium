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

const AbilityDisplay = (props: any) => {
    const abilityObject: Ability = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with AbilityDisplay.tsx</div>}>
            <div className='AbilityDisplay'>
                {returnDescription(abilityObject, abilityObject.Description)}
                <OptionSetStaticDisplay data={abilityObject.MyOptions} />
            </div>
        </ErrorBoundary>
    )
}

export default AbilityDisplay;