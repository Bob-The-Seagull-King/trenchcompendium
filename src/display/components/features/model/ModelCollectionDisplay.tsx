import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import ModelDisplay from './ModelDisplay';
import { Form } from 'react-bootstrap';
import { getColour, makestringpresentable } from '../../../../utility/functions';

const ModelCollectionDisplay = (props: any) => {
    const modelcollectionObject: ModelCollection = props.data

    const [selectedModel, setSelectedModel] = useState(GetBase());
    const [_keyvar, setkeyvar] = useState(0);

    function GetBase() {
        for (let i = 0; i < modelcollectionObject.SubModelsList.length; i++) {
            if (modelcollectionObject.SubModelsList[i].var_name == "base") {
                return modelcollectionObject.SubModelsList[i]
            }
        }

        return (modelcollectionObject.SubModelsList[0])
    }

    function updateItem(value: string) {
        
        for (let i = 0; i < modelcollectionObject.SubModelsList.length; i++) {
            if (modelcollectionObject.SubModelsList[i].var_name == value) {
                setSelectedModel(modelcollectionObject.SubModelsList[i])
                setkeyvar(_keyvar + 1);
            }
        }
        
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelCollectionDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div className={"row sidebarriers"}>
                    <Form.Control className={"borderstyler subborder" + getColour(selectedModel.model.Team) } as="select" aria-label="Default select example"  placeholder="Member Type" onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } } >
                        {modelcollectionObject.SubModelsList.map((item) => ( 
                            <option key="modeloption" value={item.var_name}>{makestringpresentable(item.var_name)}</option> 
                        ))}
                    </Form.Control>
                </div>
                <div className="verticalspacerbig"/>
                <div className="row">
                    <div key={_keyvar}>
                        <ModelDisplay data={selectedModel.model}/>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ModelCollectionDisplay;