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
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import { Scenario } from '../../../../classes/feature/scenario/Scenario';

const ScenarioDisplay = (props: any) => {
    const scenarioObject: Scenario = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ScenarioDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div className='row'>
                    {returnDescription(scenarioObject, scenarioObject.Description)}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ScenarioDisplay;