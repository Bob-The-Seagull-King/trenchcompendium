import React, { useState } from "react";

interface Fighter {
    id: string;
    name: string;
    modelName: string;
}

interface WbbExploration_Selection_HolyDNA_Props {
    onChange?: (selected: Fighter | null) => void;
}

const WbbExploration_Selection_HolyDNA: React.FC<
    WbbExploration_Selection_HolyDNA_Props
> = ({ onChange }) => {

    // @TODO: list of fighters that have Holy DNA equipped
    const fighters: Fighter[] = [
        { id: "f1", name: "Sergeant Alaric", modelName: "Janissary" },
        { id: "f2", name: "Brother Malrick", modelName: "Azeb" },
        { id: "f3", name: "Scout Elena", modelName: "Janissary" },
        { id: "f4", name: "Initiate Corvus", modelName: "Azeb" },
        { id: "f5", name: "Veteran Kael", modelName: "Janissary" },
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
        <div className="WbbExploration_Selection_HolyDNA mb-3">
            <div className="fw-bold mb-2">Choose One Fighter</div>

            {fighters.map((fighter) => {
                const isSelected = selectedFighter?.id === fighter.id;

                return (
                    <div className="form-check" key={fighter.id}>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="holy-dna-fighter"
                            checked={isSelected}
                            onClick={() => handleSelect(fighter)}
                            readOnly
                        />
                        <label
                            className="form-check-label"
                            onClick={() => handleSelect(fighter)}
                            style={{ cursor: "pointer" }}
                        >
                            {fighter.name !== '' && (
                                <>
                                    {fighter.name}{" - "}
                                </>
                            )}
                            {fighter.modelName}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

export default WbbExploration_Selection_HolyDNA;
