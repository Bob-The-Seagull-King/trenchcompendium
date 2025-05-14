import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { StaticOption } from '../../../../classes/options/StaticOption';
import { makestringpresentable } from '../../../../utility/functions';
import { Form } from 'react-bootstrap';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import ItemRow from './ItemRow';
import { returnDescription } from '../../../../utility/util';

const SingleOptionSetDisplay = (props: any) => {
    const OptionSet : StaticOption = props.data
    const OptionUpdate = props.onSelectionChange;
    
    const [selectedModel, setSelectedModel] = useState(OptionSet.Selections[0]);
    const [displayState, setDisplayState] = useState( <></> );
    const [_keyvar, setkeyvar] = useState(0);

    function updateItem(value: string) {
        for (let i = 0; i < OptionSet.Selections.length; i++) {
            if (OptionSet.Selections[i].id == Number.parseInt(value)) {
                setSelectedModel(OptionSet.Selections[i])
            }
        }
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
                        <h3>
                            { OptionSet.Name }
                        </h3>

                        <p>
                            {
                                returnDescription(OptionSet, OptionSet.Description)
                            }
                        </p>

                        <Form.Group controlId={OptionSet.RefID+'-select'} className={'mb-3'}>
                            <Form.Label>{'Choose Option'}</Form.Label>
                            <Form.Select
                                onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } }
                            >
                                {OptionSet.Selections.map((selec) => (
                                    <option value={selec.id} key={"modeloption"+(OptionSet.Selections.indexOf(selec).toString())} >{makestringpresentable(selec.display_str)}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

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