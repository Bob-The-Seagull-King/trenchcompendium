import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { IChoice, StaticOption } from '../../../../classes/options/StaticOption';
import { makestringpresentable } from '../../../../utility/functions';
import { Form } from 'react-bootstrap';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import ItemRow from './ItemRow';
import { returnDescription } from '../../../../utility/util';
import WbbOptionBox from '../../../components/warband-builder/WbbOptionBox';
import RulesOptionSelection from '../../rules-content/RulesOptionSelectionModal';

const SingleOptionSetDisplay = (props: any) => {
    const OptionSet : StaticOption = props.data
    const OptionUpdate = props.onSelectionChange;
    
    const [showModal, setshowModal] = useState(false);
    const [selectedModel, setSelectedModel] = useState<IChoice | null>(null);
    const [displayState, setDisplayState] = useState( <></> );
    const [_keyvar, setkeyvar] = useState(0);

    function updateItem(foundOption : IChoice | null) {
        setSelectedModel(foundOption)
    }

    async function SetModelOptions() {
        if (OptionSet.MyStaticObject != null) {

            if (OptionUpdate) {
                OptionUpdate(OptionSet.RefID, selectedModel);
            }

            const EventProc: EventRunner = new EventRunner();
            
            const result = await EventProc.runEvent(
                "returnOptionDisplay",
                OptionSet.MyStaticObject,
                [],
                null,
                selectedModel
            );
            if (result != null) {
                setDisplayState(result)
                setkeyvar((prev) => prev + 1);
            }
        }

    }

    useEffect(() => {
            SetModelOptions();
        }, [selectedModel]);


    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with OptionSetStaticDisplay.tsx</div>}>
            <div className={'SingleOptionSetDisplay'}>
                {OptionSet.Selections.length > 0 &&
                    <>
                    
                        <WbbOptionBox
                            title={OptionSet.Name}
                            value={selectedModel.display_str}
                            onClick={() => setshowModal(true)}
                        />


                        <RulesOptionSelection
                            show={showModal}
                            onClose={() => setshowModal(false)}
                            currentChoice={selectedModel}
                            onSubmit={updateItem}
                            choiceparent={OptionSet}
                        />

                        <div key={_keyvar} className="SingleOptionSetDisplay-Details">
                            {displayState}
                        </div>
                    </>
                }
            </div>
        </ErrorBoundary>
    )
}

export default SingleOptionSetDisplay;