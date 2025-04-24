import React, {useContext} from 'react';
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import { useWarband  } from '../../../context/WarbandContext';
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
            <div className="meta-item"><strong>Faction:</strong> {warband.GetFactionName()}</div>
            <div className="meta-item"><strong>Name:</strong> {warband.GetWarbandName()}</div>
            <div className="meta-item"><strong>Rating:</strong> {warband.GetCostDucats()} Ducats
                | {warband.GetCostGlory()} Glory
            </div>
            <div className="meta-item">
                <strong>{'Fighters: '}</strong>
                {'Elite: '}{warband.GetNumElite()}
                {' | '}
                {'Troop: '}{warband.GetNumTroop()}
                {' | '}
                {'Mercenary: '}{warband.GetNumMercenary()}

            </div>
        </div>
    );
};

export default WbbEditViewWarband;
