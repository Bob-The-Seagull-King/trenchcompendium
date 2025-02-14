import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { Upgrade } from '../../../../classes/feature/ability/Upgrade';

const UpgradeDisplay = (props: any) => {
    const abilityObject: Upgrade = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with UpgradeDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div>
                    {returnDescription(abilityObject, abilityObject.Description)}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default UpgradeDisplay;