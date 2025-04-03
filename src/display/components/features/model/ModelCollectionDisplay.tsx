import '../../../../resources/styles/vendor/bootstrap.css'
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
            <div className=''>
                {modelcollectionObject.SubModelsList.length > 1 &&
                <div className="borderthin bordergrey">
                    <div className="totalmarginmed">
                        <div className={"row horizontalspacermed"}>
                            <Form.Control className={"borderstyler hovermouse bordergrey overcomeradius"} as="select" aria-label="Default select example"  placeholder="Member Type" onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } } >
                                {modelcollectionObject.SubModelsList.map((item) => ( 
                                    <option  key="modeloption" value={item.var_name}>
                                        <div>{makestringpresentable(item.var_name) + " - " + makestringpresentable(item.model.Name != undefined? item.model.Name : "")}</div>
                                    </option> 
                                ))}
                            </Form.Control>
                        </div>
                    </div>
                </div>
                }
                <div key={_keyvar}>
                    <ModelDisplay data={selectedModel.model}/>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ModelCollectionDisplay;