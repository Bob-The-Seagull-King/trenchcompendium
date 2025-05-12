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

    useEffect(() => {
            SetModelOptions();
        }, [selectedModel]);

    async function SetModelOptions() {
        if (OptionSet.MyStaticObject != null) {

            OptionUpdate(OptionSet.RefID, selectedModel);

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

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with OptionSetStaticDisplay.tsx</div>}>
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
                        <Form.Control
                                      as="select"
                                      onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } }
                        >
                            {OptionSet.Selections.map((selec) => (
                                <option value={selec.id} key={"modeloption"+(OptionSet.Selections.indexOf(selec).toString())} >{makestringpresentable(selec.display_str)}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <p>
                        <div className="col">
                            {displayState}
                        </div>
                    </p>
                </>
            }
        </ErrorBoundary>
    )
}

export default SingleOptionSetDisplay;