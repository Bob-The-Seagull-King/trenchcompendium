import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { Upgrade } from '../../../../classes/feature/ability/Upgrade';
import { ModelUpgradeRelationship } from '../../../../classes/relationship/model/ModelUpgradeRelationship';
import UpgradeDisplay from './UpgradeDisplay';
import { getCostType } from '../../../../utility/functions';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';

const ModelUpgradeDisplay = (props: any) => {
    const abilityObject: ModelUpgradeRelationship = props.data

    const [maximum, setmaximum] = useState(abilityObject.WarbandLimit.toString())
    const [_keyvar, setkeyvar] = useState(0);

    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner();

            const result = await EventProc.runEvent(
                "getUpgradeLimitPresentation",
                abilityObject,
                [],
                [abilityObject.WarbandLimit.toString()],
                true
            );

            setmaximum(result.join(", "));
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelUpgradeDisplay.tsx</div>}>
            <div>
                <UpgradeDisplay data={abilityObject.UpgradeObject}/>
                <div className=''>
                    <div className="">
                        <span className=" ">
                            {
                                abilityObject.Cost + " " + 
                                getCostType(abilityObject.CostType) + 
                                (abilityObject.WarbandLimit != 0? (" " + "(Limit " + maximum + ")") : "")}
                        </span>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ModelUpgradeDisplay;