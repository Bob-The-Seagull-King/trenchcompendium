import React, { useState } from "react";

interface Fighter {
    id: string;
    name: string;
    elName: string;
    armourName: string;
}

interface WbbExploration_Selection_GolgothaTektites_Props {
    onChange?: (selected: Fighter | null) => void;
}

const WbbExploration_Selection_GolgothaTektites: React.FC<
    WbbExploration_Selection_GolgothaTektites_Props
> = ({ onChange }) => {

    // @TODO: list of Armour elements equipped by fighters or in the stash
    const fighters: Fighter[] = [
        { id: "el1", name: "Sergeant Alaric", elName: "Janissary", armourName: "Reinforced Armour" },
        { id: "el2", name: "Brother Malrick", elName: "Azeb", armourName: "Reinforced Armour" },
        { id: "el3", name: "Scout Elena", elName: "Janissary", armourName: "Standard Armour" },
        { id: "el4", name: "", elName: "Azeb", armourName: "Damascus Armour" },
        { id: "el5", name: "", elName: "Stash", armourName: "Standard Armour" },
    ];

    const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);

    const handleSelect = (fighter: Fighter) => {
        const updated = selectedFighter?.id === fighter.id ? null : fighter;
        setSelectedFighter(updated);
        if (onChange) {
            onChange(updated);
        }
    };

    return (
        <div className="WbbExploration_Selection_GolgothaTektites mb-3">
            <div className="fw-bold mb-2">Choose One Fighter</div>

            {fighters.map((fighter) => {
                const isSelected = selectedFighter?.id === fighter.id;

                return (
                    <div className="form-check" key={fighter.id}>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="golgotha-tektites-fighter"
                            checked={isSelected}
                            onClick={() => handleSelect(fighter)}
                            readOnly
                        />
                        <label
                            className="form-check-label"
                            onClick={() => handleSelect(fighter)}
                            style={{ cursor: "pointer" }}
                        >
                            {fighter.armourName}

                            {" ("}

                            {fighter.name !== '' && (
                                <>
                                    {fighter.name}{" - "}
                                </>
                            )}
                            {fighter.elName}
                            {")"}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

export default WbbExploration_Selection_GolgothaTektites;
