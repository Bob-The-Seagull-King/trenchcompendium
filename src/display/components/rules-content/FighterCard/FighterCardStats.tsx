// FighterCardStats.tsx
import React from 'react';

interface FighterCardStatsProps {
    movement: string;
    ranged: string;
    melee: string;
    armour: string;
}

const FighterCardStats: React.FC<FighterCardStatsProps> = ({ movement, ranged, melee, armour }) => {
    return (
        <div className="fighter-card-stats">
            <div className="fighter-card-stat">
                <div className="stat-label">Movement</div>
                <div className="stat-value">{movement}</div>
            </div>
            <div className="fighter-card-stat">
                <div className="stat-label">Melee</div>
                <div className="stat-value">{melee}</div>
            </div>
            <div className="fighter-card-stat">
                <div className="stat-label">Ranged</div>
                <div className="stat-value">{ranged}</div>
            </div>
            <div className="fighter-card-stat">
                <div className="stat-label">Armour</div>
                <div className="stat-value">{armour}</div>
            </div>
        </div>
    );
};

export default FighterCardStats;
