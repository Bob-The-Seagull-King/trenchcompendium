import React, { useState } from "react";

interface Fighter {
    id: string;
    name: string;
    modelName: string;
    currentXP: number;
    maxXP: number;
}

interface WbbExploration_Selection_MoonshineStash_Destroy_Props {
    onChange?: (selected: Fighter[]) => void;
}

const WbbExploration_Selection_MoonshineStash_Destroy: React.FC<
    WbbExploration_Selection_MoonshineStash_Destroy_Props
> = ({ onChange }) => {
    const fighters: Fighter[] = [
        { id: "f1", name: "Alaric", modelName: "Yüzbasi Captain",currentXP: 5, maxXP: 24 },
        { id: "f2", name: "Malrick", modelName: "Jaberian Alchemist",currentXP: 2, maxXP: 24 },
        { id: "f3", name: "Elena", modelName: "Assassin",currentXP: 7, maxXP: 24 },
        { id: "f4", name: "Corvus", modelName: "Janissary",currentXP: 0, maxXP: 24 },
        { id: "f5", name: "Kael", modelName: "Brazen Bull", currentXP: 10, maxXP: 7 },
    ];

    const [selectedFighters, setSelectedFighters] = useState<Fighter[]>([]);

    const handleSelect = (fighter: Fighter) => {
        setSelectedFighters((prev) => {
            const exists = prev.find((f) => f.id === fighter.id);
            let updated: Fighter[];

            if (exists) {
                // remove fighter if already selected
                updated = prev.filter((f) => f.id !== fighter.id);
            } else {
                // only add if less than 4 selected
                if (prev.length >= 4) return prev;
                updated = [...prev, fighter];
            }

            if (onChange) {
                onChange(updated);
            }
            return updated;
        });
    };

    return (
        <div className="WbbExploration_Selection_MoonshineStash_Destroy mb-3">
            <div className="fw-bold mb-2">Choose up to 4 Fighters</div>
            {fighters.map((fighter) => {
                const isSelected = selectedFighters.some((f) => f.id === fighter.id);
                const disableOthers = selectedFighters.length >= 4 && !isSelected;

                return (
                    <div className="form-check" key={fighter.id}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name={`fighter-${fighter.id}`}
                            checked={isSelected}
                            disabled={disableOthers}
                            onClick={() => handleSelect(fighter)}
                            readOnly
                        />
                        <label
                            className={`form-check-label`}
                            onClick={() => !disableOthers && handleSelect(fighter)}
                            style={{ cursor: disableOthers ? "not-allowed" : "pointer" }}
                        >
                            {fighter.name != '' &&
                                <>
                                    {fighter.name}{' - '}
                                </>
                            }

                            {fighter.modelName} (XP: {fighter.currentXP}/{fighter.maxXP})
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

export default WbbExploration_Selection_MoonshineStash_Destroy;
