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
import { ExplorationTable } from '../../../../classes/feature/exploration/ExplorationTable';
import ExplorationLocationDisplay from './ExplorationLocationDisplay';

const ExplorationTableDisplay = (props: any) => {
    const explorationTableObject: ExplorationTable = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                {explorationTableObject.ExplorationLocations.map((item) => (
                    <div key={item.ID}>
                    <div className='abilityInternalStructure'>
                        {"Exploration Score: " + item.TableValue + " - " + item.Name  /* Name */}
                    </div>
                    <ExplorationLocationDisplay data={item}/>
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default ExplorationTableDisplay;