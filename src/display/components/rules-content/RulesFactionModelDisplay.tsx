import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import { FactionModelRelationship } from '../../../classes/relationship/faction/FactionModelRelationship';
import RulesModelDisplay from "./RulesModelDisplay";

const RulesFactionModelDisplay = (props: any) => {
    const factionmodelObject: FactionModelRelationship = props.data

    const [minimum, setminimum] = useState("")
    const [maximum, setmaximum] = useState("")
    const [_keyvar, setkeyvar] = useState(0);


    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner();

            const result = await EventProc.runEvent(
                "getModelLimitPresentation",
                factionmodelObject,
                [],
                [factionmodelObject.Maximum.toString()],
                true
            );

            setmaximum(result.join(", "));

            setkeyvar((prev) => prev + 1);

            const result_min = await EventProc.runEvent(
                "getModelLimitPresentation",
                factionmodelObject,
                [],
                [factionmodelObject.Minimum.toString()],
                false
            );
            setminimum(result_min.join(", "));
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);

    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionModelDisplay.tsx</div>}>
            <RulesModelDisplay data={factionmodelObject} />
        </ErrorBoundary>
    )
}

export default RulesFactionModelDisplay;
