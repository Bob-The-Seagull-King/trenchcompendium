import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';

const ModelCollectionDisplay = (props: any) => {
    const modelcollectionObject: ModelCollection = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelCollectionDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ModelCollectionDisplay;