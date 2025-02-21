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
            <div className='textmaxwidth row'>
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