import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../../utility/util'
import { Keyword } from '../../../../classes/feature/glossary/Keyword';

const KeywordDisplay = (props: any) => {
    const ruleObject: Keyword = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with KeywordDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div>
                    {returnDescription(ruleObject, ruleObject.Description)}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default KeywordDisplay;