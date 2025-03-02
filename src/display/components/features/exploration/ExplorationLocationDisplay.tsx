import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ExplorationLocation } from '../../../../classes/feature/exploration/ExplorationLocation';
import OptionSetStaticDisplay from '../../../components/subcomponents/description/OptionSetStaticDisplay';

const ExplorationLocationDisplay = (props: any) => {
    const explorationLocationObject: ExplorationLocation = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationLocationDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div className='row'>
                    {returnDescription(explorationLocationObject, explorationLocationObject.Description)}
                </div>
                <div className='row'>
                    {
                        <OptionSetStaticDisplay data={explorationLocationObject.MyOptions} />
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ExplorationLocationDisplay;