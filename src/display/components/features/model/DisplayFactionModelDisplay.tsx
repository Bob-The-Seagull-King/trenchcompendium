import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../../utility/util'
import { Model } from '../../../../classes/feature/model/Model';
import GenericDisplay from '../../generics/GenericDisplay';
import AbilityDisplay from '../ability/AbilityDisplay';
import GenericHover from '../../generics/GenericHover';
import KeywordDisplay from '../glossary/KeywordDisplay';
import ItemStat from '../../subcomponents/description/ItemStat';
import { ModelStatistics } from '../../../../classes/feature/model/ModelStats';
import { getBaseSize, getColour, getCostType, getMoveType, getPotential } from '../../../../utility/functions';
import ModelUpgradeDisplay from '../ability/ModelUpgradeDisplay';
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { IChoice } from '../../../../classes/options/StaticOption';
import ModelEquipmentDisplay from '../equipment/ModelEquipmentDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import { Form } from 'react-bootstrap';
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import ModelDisplay from './ModelDisplay';
import GenericPopup from '../../../components/generics/GenericPopup';
import FactionDisplay from '../faction/FactionDisplay';

const DisplayFactionModelDisplay = (props: any) => {
    const factionmodelObject: FactionModelRelationship = props.data

    const [minimum, setminimum] = useState("")
    const [maximum, setmaximum] = useState("")
    const [_keyvar, setkeyvar] = useState(0);

    
        useEffect(() => {
            async function SetModelOptions() {
                const EventProc: EventRunner = new EventRunner();
                
                const result = await EventProc.runEvent(
                    "getModelLimitPresentation",
                    factionmodelObject,
                    [],
                    [factionmodelObject.Maximum.toString()],
                    true
                );
                setmaximum(result.join(", "));
                setkeyvar((prev) => prev + 1);

                const result_min = await EventProc.runEvent(
                    "getModelLimitPresentation",
                    factionmodelObject,
                    [],
                    [factionmodelObject.Minimum.toString()],
                    false
                );
                setminimum(result_min.join(", "));
                setkeyvar((prev) => prev + 1);
            }
        
            SetModelOptions();
        }, []);

    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionModelDisplay.tsx</div>}>
            <div key={_keyvar}>
                {factionmodelObject.Factions.map((item) => (
                    <span className='smallgapright' key={item.ID}>
                        <GenericPopup  d_colour={"grey"} titlename={item.Name + (factionmodelObject.Factions.indexOf(item) < factionmodelObject.Factions.length-1 ? ", " : "")} d_name={item.Name} d_type={""} d_method={() => 
                            <div className="totalmarginmed">
                                <FactionDisplay data={item} />
                            </div>}/>
                    </span>
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default DisplayFactionModelDisplay;