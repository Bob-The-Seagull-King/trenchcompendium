// FighterCardStats.tsx
import React from 'react';
import {getModelStatMove} from "../../../../classes/feature/model/ModelStats";
import ItemStat from "../../subcomponents/description/ItemStat";

interface FighterCardStatsProps {
    movement: string;
    ranged: string;
    melee: string;
    armour: string;
}

const FighterCardStats: React.FC<FighterCardStatsProps> = ({ movement, ranged, melee, armour }) => {
    return (
        <div className="fighter-card-stats">
            <ItemStat
                title={"Movement"}
                value={movement}
            />
            <ItemStat
                title={"Melee"}
                value={melee}
            />
            <ItemStat
                title={"Ranged"}
                value={ranged}
            />
            <ItemStat
                title={"Armour"}
                value={armour}
            />
        </div>
    );
};

export default FighterCardStats;
