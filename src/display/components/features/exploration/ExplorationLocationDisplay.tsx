import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ExplorationLocation } from '../../../../classes/feature/exploration/ExplorationLocation';
import OptionSetStaticDisplay from '../../../components/subcomponents/description/OptionSetStaticDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';

const ExplorationLocationDisplay = (props: any) => {
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
            <div className='abilityInternalStructure' key={_keyvar}>
                <div className='row'>
                    {returnDescription(explorationLocationObject, explorationLocationObject.Description)}
                </div>
                <div className='row'>
                    {
                        <OptionSetStaticDisplay data={explorationLocationObject.MyOptions} />
                    }
                </div>
                <div className='row'>
                    <div className="colordefault bodytext complextext">
                        {
                            useLimits.join(", ")
                        }
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ExplorationLocationDisplay;