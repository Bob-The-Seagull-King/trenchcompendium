import '../../../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../../../utility/util'
import { ModelCollection } from '../../../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../../../classes/feature/model/Model';
import { Ability } from '../../../../../../classes/feature/ability/Ability';
import OptionSetStaticDisplay from '../../../../subcomponents/description/OptionSetStaticDisplay';
import { UserWarband } from '../../../../../../classes/saveitems/Warband/UserWarband';
import { WarbandManager } from '../../../../../../classes/saveitems/Warband/WarbandManager';
import { Patron } from '../../../../../../classes/feature/skillgroup/Patron';
import { Form } from 'react-bootstrap';
import { makestringpresentable } from '../../../../../../utility/functions';
import PatronDisplay from '../../../../features/skill/PatronDisplay';
import { WarbandProperty } from '../../../../../../classes/saveitems/Warband/WarbandProperty';
import { EventRunner } from '../../../../../../classes/contextevent/contexteventhandler';
import { SelectedOption } from '../../../../../../classes/options/SelectedOption';
import { IChoice } from '../../../../../../classes/options/StaticOption';

const WarbandSubPropertyDisplay = (props: any) => {
    const Warband: UserWarband = props.wrbnd
    const MyProp: WarbandProperty = props.wbprp
    const MySelection : SelectedOption = props.mysl
    const UpdateFunction = props.updater;

    const [selectedModel, setSelectedModel] = useState<IChoice | null>(null);
    const [displayState, setDisplayState] = useState( <></> );
    const [keyval, setkey] = useState(0);

    useEffect(() => {
        async function SetWarbandOptions() {     
            setSelectedModel(MySelection.SelectedChoice)
            setkey(keyval + 1);
        }
    
        SetWarbandOptions();
    }, []);


    async function SetModelOptions() {
        if (MySelection.Option.MyStaticObject != null) {
            const EventProc: EventRunner = new EventRunner();
            
            const result = await EventProc.runEvent(
                "returnOptionDisplay",
                MySelection.MyParent,
                [],
                null,
                selectedModel
            );
            if (result != null) {
                setDisplayState(result)
                setkey((prev) => prev + 1);
            }
        }
        
    }
    
    useEffect(() => {
            SetModelOptions();
        }, [selectedModel]);

    function updateItem(value: string) {
        let IsFound = false;
        for (let i = 0; i < MySelection.Option.Selections.length; i++) {
            if (MySelection.Option.Selections[i].id == Number.parseInt(value)) {
                MySelection.SelectOption(Number.parseInt(value));
                IsFound = true;
                break;
            }
        }
        if (IsFound == false) {
            MySelection.SelectOption(null);
        }        
        setSelectedModel(MySelection.SelectedChoice)
        
        updateObj();
    }

    async function updateObj() {
        UpdateFunction(Warband);
        setkey(keyval + 1);
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with WarbandPropertyDisplay.tsx</div>}>
            <div className={'WarbandSubPropertyDisplay'} key={keyval}>
                <h1>{MyProp.Name}</h1>

                <Form.Group controlId={MyProp.ID+'-select'} className={'mb-3'}>
                    <Form.Label>{'Choose Option'}</Form.Label>

                    <Form.Select defaultValue={(selectedModel)? selectedModel.id: undefined} onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } } >
                        <option value={"_no_option_selected"} key={"modeloptionnone"} >{"None Selected"}</option>
                        {MySelection.Option.Selections.map((selec) => (
                            <option value={selec.id} key={"modeloption"+(MySelection.Option.Selections.indexOf(selec).toString())} >{makestringpresentable(selec.display_str)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div>
                    {displayState}
                    {selectedModel? selectedModel.id : "None"}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default WarbandSubPropertyDisplay;