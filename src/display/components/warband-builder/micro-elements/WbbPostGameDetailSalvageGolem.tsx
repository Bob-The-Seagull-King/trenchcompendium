import React, {useState} from "react";
import {useWarband} from "../../../../context/WarbandContext";
import {useWbbMode} from "../../../../context/WbbModeContext";
import {GloriousDeed, usePostGame} from "../../../../context/PostGameContext";

const WbbPostGameDetailSalvageGolem: React.FC = () => {
    const { warband } = useWarband();
    const { edit_mode } = useWbbMode();

    if (!warband) return <div>Loading...</div>;

    const [additionalDucats, setAdditionalDucats] = useState<number>(0);

    const handleFocusSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    // @TODO: check if salvage golem is unlocked or return null
    // @TODO: add ducats to post game result

    return (
        <div className="WbbPostGameDetailSalvageGolem WbbPostGameDetail-Element">
            <div className="WbbPostGameDetail-Element-title">
                {"Salvage Golem"}
            </div>

            <p>
                {"At the end of each battle, your Warband gains an additional D6x5 ducats"}
            </p>

            <label htmlFor="salvage-golem-ducats" className="form-label fw-bold">
                Additional Ducats
            </label>
            <input
                type="number"
                className="form-control"
                id="salvage-golem-ducats"
                min={0}
                step={1}
                value={additionalDucats}
                onChange={(e) => setAdditionalDucats(Number(e.target.value))}
                onFocus={handleFocusSelectAll}
            />
        </div>
    );
};

export default WbbPostGameDetailSalvageGolem;