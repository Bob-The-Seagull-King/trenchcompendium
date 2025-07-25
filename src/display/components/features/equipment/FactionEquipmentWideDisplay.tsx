import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { getBaseSize, getColour, getCostType, getMoveType, getPotential } from '../../../../utility/functions';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import EquipmentDisplay from './EquipmentDisplay';
import GenericPopup from '../../../components/generics/GenericPopup';
import { FactionEquipmentRelationship } from '../../../../classes/relationship/faction/FactionEquipmentRelationship';

const FactionEquipmenWideDisplay = (props: any) => {
    const factionequipmentObject: FactionEquipmentRelationship = props.data

    const [equiprestrictions, setEquipRestrictions] = useState([])
    const [_keyvar, setkeyvar] = useState(0);

    
        useEffect(() => {
            async function SetModelOptions() {
                const EventProc: EventRunner = new EventRunner();
                
            if (factionequipmentObject.RestrictedEquipment != null) {
                const result_presentation = await EventProc.runEvent(
                    "getEquipmentRestrictionPresentable",
                    factionequipmentObject,
                    [],
                    [],
                    factionequipmentObject.RestrictedEquipment
                );
                setEquipRestrictions(result_presentation);
                setkeyvar((prev) => prev + 1);
            } else {
                const result = await EventProc.runEvent(
                    "getEquipmentRestriction",
                    factionequipmentObject,
                    [],
                    [],
                    null
                );
                factionequipmentObject.RestrictedEquipment = result;
                const result_presentation = await EventProc.runEvent(
                    "getEquipmentRestrictionPresentable",
                    factionequipmentObject,
                    [],
                    [],
                    factionequipmentObject.RestrictedEquipment
                );
                setEquipRestrictions(result_presentation);
                setkeyvar((prev) => prev + 1);
            }
    
            }
        
            SetModelOptions();
        }, []);

    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionModelDisplay.tsx</div>}>
            <div key={_keyvar}>
            <div className='textmaxwidth row alignleft'>
                <div className="col-md-4 col-8">
                    <GenericPopup  d_colour={"default"} titlename={factionequipmentObject.EquipmentItem.Name} d_name={factionequipmentObject.EquipmentItem.Name} d_type={""} d_method={() => 
                        <EquipmentDisplay data={factionequipmentObject.EquipmentItem} />}/>
                </div>
                <div className="col-md-2 col-4">
                    <span className=" headersubtext boldtext colourgrey">
                        {
                            factionequipmentObject.Cost + " " + 
                            getCostType(factionequipmentObject.CostType)
                        }
                    </span>
                </div>
                
                <div className="col-md-6 col-12" key={_keyvar}>
                    {factionequipmentObject.Limit != 0 &&
                        <>
                        <span className="headersubtext boldtext colourgrey">
                            {
                                   "LIMIT: " +  factionequipmentObject.Limit + " " +  equiprestrictions.join(', ') 
                            }
                        </span>
                        </>
                    }
                </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default FactionEquipmenWideDisplay;