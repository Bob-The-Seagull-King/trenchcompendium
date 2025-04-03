import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'

const GlossaryDisplay = (props: any) => {
    const ruleObject: GlossaryRule = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with GlossaryDisplay.tsx</div>}>
            <div className=''>
                <div className="colourBasicText   size-default">
                    {returnDescription(ruleObject, ruleObject.Description)}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default GlossaryDisplay;