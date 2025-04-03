import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { Upgrade } from '../../../../classes/feature/ability/Upgrade';
import { ModelUpgradeRelationship } from '../../../../classes/relationship/model/ModelUpgradeRelationship';
import UpgradeDisplay from './UpgradeDisplay';
import { getCostType } from '../../../../utility/functions';

const ModelUpgradeDisplay = (props: any) => {
    const abilityObject: ModelUpgradeRelationship = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelUpgradeDisplay.tsx</div>}>
            <div>
                <UpgradeDisplay data={abilityObject.UpgradeObject}/>
                <div className=''>
                    <div className="">
                        <span className=" size-strongtext">
                            {
                                abilityObject.Cost + " " + 
                                getCostType(abilityObject.CostType) + 
                                (abilityObject.WarbandLimit != 0? (" " + "(Limit " + abilityObject.WarbandLimit + ")") : "")}
                        </span>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ModelUpgradeDisplay;