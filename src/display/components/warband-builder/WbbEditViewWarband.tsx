import React from 'react';

interface WbbEditViewWarbandProps {
    faction: string;
    name: string;
    ratingDucats: number;
    ratingGlory: number;
    countElite: number;
    countTroop: number;
}

const WbbEditViewWarband: React.FC<WbbEditViewWarbandProps> = ({
       faction,
       name,
       ratingDucats,
       ratingGlory,
       countElite,
       countTroop
   }) => {

    return (
        <div className="WbbEditViewWarband warband-meta">
            <div className={'meta-headline'}>{'Warband'}</div>
            <div className="meta-item"><strong>Faction:</strong> {faction}</div>
            <div className="meta-item"><strong>Name:</strong> {name}</div>
            <div className="meta-item"><strong>Rating:</strong> {ratingDucats} Ducats | {ratingGlory} Glory</div>
            <div className="meta-item">
                <strong>Fighters:</strong> {'Elite: '}{countElite}{' | '}{'Troop: '}{countTroop}
            </div>
        </div>
    );
};

export default WbbEditViewWarband;
