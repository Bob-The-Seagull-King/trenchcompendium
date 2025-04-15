import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { getCostType } from '../../../../utility/functions';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import { FactionEquipmentRelationship } from '../../../../classes/relationship/faction/FactionEquipmentRelationship';
import RulesOverlay from "../../rules-content/RulesOverlay";
import RulesEquipmentMain from "../../rules-content/RulesEquipmentMain";

const FactionEquipmentDisplay = (props: any) => {
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
                <div className="armoury-element-cell">
                    <RulesOverlay
                        titlename={factionequipmentObject.EquipmentItem.Name}
                        d_name={factionequipmentObject.EquipmentItem.Name}
                        d_method={() =>
                            <RulesEquipmentMain data={factionequipmentObject.EquipmentItem}/>}
                    />
                </div>

                <div className="armoury-element-cell">
                    <div className="armoury-element-price">
                        {
                            factionequipmentObject.Cost + " " +
                            getCostType(factionequipmentObject.CostType)
                        }
                    </div>

                    {(factionequipmentObject.Limit != 0) &&
                        <>
                        <div className="armoury-element-restriction armoury-element-limit">
                            {
                                "LIMIT: " +  factionequipmentObject.Limit
                            }
                        </div>
                        </>
                    }{(equiprestrictions.length > 0) &&
                    <>
                        <div className="armoury-element-restriction">
                            {
                                equiprestrictions.join(', ') + ' only'
                            }
                        </div>
                    </>
                }
                </div>
        </ErrorBoundary>
    )
}

export default FactionEquipmentDisplay;