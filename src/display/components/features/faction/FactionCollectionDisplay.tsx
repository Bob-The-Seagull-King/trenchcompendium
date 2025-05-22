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
import PageMetaInformation from "../../generics/PageMetaInformation";
import {useSynodFactionImageData} from "../../../../utility/useSynodFactionImageData";
import RulesBannerFaction from '../../../components/rules-content/RulesBannerFaction';

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

    function GetFactionID () {
        if( selectedModel.var_name == 'base' ) {
            return factioncollectionObject.ID;
        } else {
            return selectedModel.faction.ID;
        }
    }

    const { url, factionName, error } = useSynodFactionImageData(GetFactionID (), 'medium')

    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionCollectionDisplay.tsx</div>}>
            <PageMetaInformation
                title={factioncollectionObject.GetDisplayName()}
                description={factioncollectionObject.GetDescription()}
                ogImage={url}
            />

            <div className={'FactionCollectionDisplay'}>
                <div className={'faction-hero'}>
                    <h1>
                        { ((selectedModel.var_name == 'base')? factioncollectionObject.GetBaseName() : selectedModel.faction.Name)}
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

                <RulesBannerFaction
                    key={factioncollectionObject.GetBaseFac().ID}
                    slug={factioncollectionObject.GetBaseFac().ID}
                    title={factioncollectionObject.GetBaseFac().GetTrueName()}
                >
                    {(factioncollectionObject).SubModelsList.filter((item : any) => (item.var_name != 'base')).map(sub_item => (
                        <RulesBannerFaction
                            key={sub_item.faction.ID}
                            slug={sub_item.faction.ID}
                            parentSlug={factioncollectionObject.GetBaseFac().ID}
                            title={sub_item.faction.Name? sub_item.faction.Name : ""}
                        />
                    ))}
                </RulesBannerFaction>
            </div>
        </ErrorBoundary>
    )
}

export default FactionCollectionDisplay;