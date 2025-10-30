import React, {useContext, useEffect, useState} from 'react';
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import { useWarband  } from '../../../context/WarbandContext';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExport, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
interface WbbEditViewWarbandProps {
    onClick?: () => void;
    isActive?: boolean;
}


const WbbEditViewWarband: React.FC<WbbEditViewWarbandProps> = ({
       onClick,
       isActive
   }) => {

    const { warband, updateKey } = useWarband();



    if (warband == null) return (<div>Loading...</div>);

    const [warbandErrors, setwarbanderrors] = useState<string[]>([])
    const [keyvar, setkeyvar] = useState(0)

    useEffect(() => {
        async function RunErrorCheck() {
            const Errors = await warband?.warband_data.GetValidationErrors()
            if (Errors) {
                setwarbanderrors(Errors )
                setkeyvar(keyvar + 1)
            }
        }
        RunErrorCheck();
    }, [updateKey])

    const r = Number(warband.warband_data.GetNumReserved() ?? 0);
    const l = Number(warband.warband_data.GetNumLost() ?? 0);
    const d = Number(warband.warband_data.GetNumDead() ?? 0);

    const otherList = [
        r > 0 && `Reserved: ${r}`,
        l > 0 && `Lost: ${l}`,
        d > 0 && `Dead: ${d}`,
    ].filter(Boolean).join(', ');

    return (
        <div className={`WbbEditViewWarband warband-meta ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className={'meta-headline'}>{'Warband'}</div>
            <div className="meta-item"><strong>Faction:</strong> {warband.warband_data.GetFactionName()}</div>
            <div className="meta-item"><strong>Rating:</strong> {warband.warband_data.GetRatingDucats()} Ducats
                | {warband.warband_data.GetRatingGlory()} Glory
            </div>
            <div className="meta-item">
                <strong>{'Fielded: '}</strong>
                {'Elite: '}{warband.warband_data.GetNumElite()}
                {', '}
                {'Troop: '}{warband.warband_data.GetNumTroop()}
                {', '}
                {'Mercenary: '}{warband.warband_data.GetNumMercenary()}
                {', '}
                {'Total: '}{warband.warband_data.GetNumFielded()}
            </div>
            {otherList && (
                <div className="meta-item">
                    <strong>Other: </strong>{otherList}
                </div>
            )}
            <div key={keyvar}>
                { warbandErrors.length > 0 &&
                    <div className="meta-item meta-item-vaidation-error">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="icon-inline-left-l"/>
                        {'The warband is not valid'}
                    </div>
                }
            </div>
        </div>
    );
};

export default WbbEditViewWarband;
