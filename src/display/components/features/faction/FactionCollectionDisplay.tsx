import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { Form } from 'react-bootstrap';
import { makestringpresentable } from '../../../../utility/functions';
import { FactionCollection } from '../../../../classes/feature/faction/FactionCollection';
import FactionDisplay from './FactionDisplay';
import { useLocation } from 'react-router-dom';
import SynodFactionImage from "../../../../utility/SynodFactionImage";

const FactionCollectionDisplay = (props: any) => {
    const factioncollectionObject: FactionCollection = props.data
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');

    const [selectedModel, setSelectedModel] = useState(GetBase());
    const [_keyvar, setkeyvar] = useState(0);

    function GetBase() {
        if (urlSplits.length > 3) {
            const CurItemID = urlSplits.slice(-1)[0]
            for (let i = 0; i < factioncollectionObject.SubModelsList.length; i++) {
                if (factioncollectionObject.SubModelsList[i].faction.ID == CurItemID) {                    
                    return factioncollectionObject.SubModelsList[i]
                }
            }
        }
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

    function GetFactionID () {
        if( selectedModel.var_name == 'base' ) {
            return factioncollectionObject.ID;
        } else {
            return selectedModel.faction.ID;
        }
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionCollectionDisplay.tsx</div>}>
            <div className={'FactionCollectionDisplay'}>
                <div className={'faction-hero'}>
                    <h1>
                        { ((selectedModel.var_name == 'base')? GetBaseName(factioncollectionObject) : selectedModel.faction.Name)}
                    </h1>

                    <SynodFactionImage
                        factionSlug={GetFactionID ()}
                        size={'full'}
                    />
                </div>

                {/* Content Filter for subfactions */}
                {factioncollectionObject.SubModelsList.length > 1 &&  false &&
                    <Form.Group controlId={factioncollectionObject.ID + '-select'} className={'mb-3'}>
                        <Form.Label>{'Choose Option'}</Form.Label>
                        <Form.Select onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } } >
                            {factioncollectionObject.SubModelsList.map((item) => (
                                <option key="modeloption" value={item.var_name}>{makestringpresentable((item.var_name == "base")? (item.faction.Name != undefined? item.faction.Name : "") : item.var_name)}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                }

                {/* Text content for faction */}
                <FactionDisplay data={selectedModel.faction}/>
            </div>
        </ErrorBoundary>
    )
}

export default FactionCollectionDisplay;