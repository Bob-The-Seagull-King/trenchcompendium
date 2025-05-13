    import '../../../../resources/styles/vendor/bootstrap.css'
    import React, { useEffect, useState } from 'react'
    import { ErrorBoundary } from "react-error-boundary";

    // Classes
    import GenericPopup from '../../../components/generics/GenericPopup';
    import { FactionEquipmentRelationship } from '../../../../classes/relationship/faction/FactionEquipmentRelationship';
    import FactionDisplay from '../faction/FactionDisplay';

    const DisplayFactionEquipmenWideDisplay = (props: any) => {
        const factionequipmentObject: FactionEquipmentRelationship = props.data

        const [_keyvar, setkeyvar] = useState(0);        

        return (
            <ErrorBoundary fallback={<div>Something went wrong with FactionModelDisplay.tsx</div>}>
                <span key={_keyvar}>
                    {factionequipmentObject.Factions.map((item) => (
                        <span className='' key={item.ID}>
                            <GenericPopup  d_colour={"grey"} titlename={item.Name + (factionequipmentObject.Factions.indexOf(item) < factionequipmentObject.Factions.length-1 ? ", " : "")} d_name={item.Name} d_type={""} d_method={() => 
                                <FactionDisplay data={item} />}/>
                        </span>
                    ))}
                
                </span>
            </ErrorBoundary>
        )
    }

    export default DisplayFactionEquipmenWideDisplay;