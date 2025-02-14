import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../classes/feature/model/Model';
import { Ability } from '../../../../classes/feature/ability/Ability';

const AbilityDisplay = (props: any) => {
    const abilityObject: Ability = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with AbilityDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div>
                    {returnDescription(abilityObject, abilityObject.Description)}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default AbilityDisplay;