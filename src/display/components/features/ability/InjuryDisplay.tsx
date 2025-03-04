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
import { Injury } from '../../../../classes/feature/ability/Injury';

const InjuryDisplay = (props: any) => {
    const injuryObject: Injury = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with InjuryDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div className='row'>
                    {returnDescription(injuryObject, injuryObject.Description)}
                </div>
                <div className='row'>
                    {
                        <OptionSetStaticDisplay data={injuryObject.MyOptions} />
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default InjuryDisplay;