import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { StaticOption } from '../../../../classes/options/StaticOption';
import { makestringpresentable } from '../../../../utility/functions';
import { Form } from 'react-bootstrap';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import ItemRow from './ItemRow';

const SingleOptionSetDisplay = (props: any) => {
    const OptionSet : StaticOption = props.data
    
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

            <div className="colordefault size-subtitle font-seriftext">
                { OptionSet.Name }
            </div>
            
            <Form.Control className={"borderstyler bordergrey overcomeradius hovermouse" } as="select" aria-label="Default select example"  placeholder="Member Type" onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } } >
                {OptionSet.Selections.map((selec) => ( 
                    <option value={selec.id} key={"modeloption"+(OptionSet.Selections.indexOf(selec).toString())} >{makestringpresentable(selec.display_str)}</option> 
                ))}
            </Form.Control>
            
            <div className="row" key={_keyvar}>
                <div className="col">
                    {displayState}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default SingleOptionSetDisplay;