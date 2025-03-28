import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { Form } from 'react-bootstrap';
import { getColour, makestringpresentable } from '../../../../utility/functions';
import { FactionCollection } from '../../../../classes/feature/faction/FactionCollection';
import FactionDisplay from './FactionDisplay';

const FactionCollectionDisplay = (props: any) => {
    const factioncollectionObject: FactionCollection = props.data

    const [selectedModel, setSelectedModel] = useState(GetBase());
    const [_keyvar, setkeyvar] = useState(0);

    function GetBase() {
        for (let i = 0; i < factioncollectionObject.SubModelsList.length; i++) {
            if (factioncollectionObject.SubModelsList[i].var_name == "base") {
                return factioncollectionObject.SubModelsList[i]
            }
        }

        return (factioncollectionObject.SubModelsList[0])
    }

    function updateItem(value: string) {
        
        for (let i = 0; i < factioncollectionObject.SubModelsList.length; i++) {
            if (factioncollectionObject.SubModelsList[i].var_name == value) {
                setSelectedModel(factioncollectionObject.SubModelsList[i])
                setkeyvar(_keyvar + 1);
            }
        }
        
    }

    function GetBaseName(factioncol : FactionCollection) {
        for (let i = 0; i < factioncol.SubModelsList.length; i++) {
            if (factioncol.SubModelsList[i].var_name == 'base') {
                return factioncol.SubModelsList[i].faction.Name;
            }
        }
        return ""
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelCollectionDisplay.tsx</div>}>
            <div className=''>
                <div className="colorBasicText size-section font-seriftext">
                    {GetBaseName(factioncollectionObject)}
                </div>
                {factioncollectionObject.SubModelsList.length > 1 &&
                <div>
                    <Form.Control className={"borderstyler hovermouse bordergrey overcomeradius" } as="select" aria-label="Default select example"  placeholder="Member Type" onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } } >
                        {factioncollectionObject.SubModelsList.map((item) => ( 
                            <option key="modeloption" value={item.var_name}>{makestringpresentable((item.var_name == "base")? (item.faction.Name != undefined? item.faction.Name : "") : item.var_name)}</option> 
                        ))}
                    </Form.Control>
                    <div className="verticalspacermed"/>
                </div>
                }
                
            </div>
            <div className="">
                <div key={_keyvar}>
                    <FactionDisplay data={selectedModel.faction}/>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default FactionCollectionDisplay;