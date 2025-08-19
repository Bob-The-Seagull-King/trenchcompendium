import React from "react";
import {useWarband} from "../../../../context/WarbandContext";
import {useWbbMode} from "../../../../context/WbbModeContext";
import {GloriousDeed, usePostGame} from "../../../../context/PostGameContext";

const WbbPostGameDetailKnighthood: React.FC = () => {
    const { warband } = useWarband();
    const { edit_mode } = useWbbMode();

    if (!warband) return <div>Loading...</div>;

    // @TODO: check if knighthood is unlocked or return null
    // @TODO: add glory to post game result

    return (
        <div className="WbbPostGameDetailKnighthood WbbPostGameDetail-Element">
            <div className="WbbPostGameDetail-Element-title">
                {"Knighthood"}
            </div>

            <p>
                {"At the end of each battle, your Warband gains an additional Glory Point."}
            </p>
        </div>
    );
};

export default WbbPostGameDetailKnighthood;