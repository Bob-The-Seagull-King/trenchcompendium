import React, {useContext, useState} from 'react';
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

    const { warband } = useWarband();



    if (warband == null) return (<div>Loading...</div>);

    return (
        <div className={`WbbEditViewWarband warband-meta ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className={'meta-headline'}>{'Warband'}</div>
            <div className="meta-item"><strong>Faction:</strong> {warband.warband_data.GetFactionName()}</div>
            <div className="meta-item"><strong>Name:</strong> {warband.warband_data.GetWarbandName()}</div>
            <div className="meta-item"><strong>Rating:</strong> {warband.warband_data.GetCostDucats()} Ducats
                | {warband.warband_data.GetCostGlory()} Glory
            </div>
            <div className="meta-item">
                <strong>{'Fighters: '}</strong>
                {'Elite: '}{warband.warband_data.GetNumElite()}
                {' | '}
                {'Troop: '}{warband.warband_data.GetNumTroop()}
                {' | '}
                {'Mercenary: '}{warband.warband_data.GetNumMercenary()}

            </div>

            { warband.warband_data.HasValidationErrors() &&
                <div className="meta-item meta-item-vaidation-error">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="icon-inline-left-l"/>
                    {'Your warband is not valid'}
                </div>
            }
        </div>
    );
};

export default WbbEditViewWarband;
