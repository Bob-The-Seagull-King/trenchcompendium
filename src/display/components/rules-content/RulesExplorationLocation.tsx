import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../utility/util'
import { ExplorationLocation } from '../../../classes/feature/exploration/ExplorationLocation';
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';

const RulesExplorationLocation = (props: any) => {
    const explorationLocationObject: ExplorationLocation = props.data

    const [useLimits, setUseLimits] = useState([])
    const [_keyvar, setkeyvar] = useState(0);

    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner();

            if (explorationLocationObject.RestrictedSelection != null) {
                const result_presentation = await EventProc.runEvent(
                    "getLocationRestrictionsPresentable",
                    explorationLocationObject,
                    [],
                    [],
                    explorationLocationObject.RestrictedSelection
                );
                setUseLimits(result_presentation);
                setkeyvar((prev) => prev + 1);
            } else {
                const result = await EventProc.runEvent(
                    "getLocationRestrictions",
                    explorationLocationObject,
                    [],
                    [],
                    null
                );
                explorationLocationObject.RestrictedSelection = result;
                const result_presentation = await EventProc.runEvent(
                    "getLocationRestrictionsPresentable",
                    explorationLocationObject,
                    [],
                    [],
                    explorationLocationObject.RestrictedSelection
                );
                setUseLimits(result_presentation);
                setkeyvar((prev) => prev + 1);
            }
        }

        SetModelOptions();
    }, []);

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationLocationDisplay.tsx</div>}>
            <div className='RulesExplorationLocation exploration-location' key={_keyvar}>
                <div className={'exploration-location-name'}>{explorationLocationObject.Name}</div>

                <p  className={'exploration-location-description'}>
                    {returnDescription(explorationLocationObject, explorationLocationObject.Description)}
                </p>

                {explorationLocationObject.MyOptions.length > 0 &&
                    <ul className={'exploration-location-options'}>
                        {explorationLocationObject.MyOptions.map((item) => (
                            <React.Fragment key={explorationLocationObject.Name + "-" + item.RefID}>

                                {/* @TODO: Output the options as strings here. */}
                                {/* - I don't know how to do that */}

                                {item.Selections.map((selec) => (
                                    <li key={item.Selections.indexOf(selec).toString()} className={'exploration-location-option'}>
                                        <strong>{selec.value.Name + ": "}</strong>
                                        {returnDescription(selec.value, selec.value.Description)}
                                        {/* Option Text goes here */}
                                    </li>
                                ))}
                            </React.Fragment>
                        ))}
                    </ul>
                }

                {useLimits.length > 0 &&
                <div className={'exploration-location-limits'}>
                    {
                        useLimits.join(", ")
                    }
                </div>
                }
            </div>
        </ErrorBoundary>
    )
}

export default RulesExplorationLocation;