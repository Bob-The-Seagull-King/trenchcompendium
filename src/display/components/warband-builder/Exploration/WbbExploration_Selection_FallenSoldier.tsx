import React, { useState } from "react";

interface Option {
    id: string;
    name: string;
}

interface WbbExploration_Selection_FallenSoldier_Props {
    onChange?: (selected: string) => void;
}

const WbbExploration_Selection_FallenSoldier: React.FC<
    WbbExploration_Selection_FallenSoldier_Props
> = ({ onChange }) => {
    const options: Option[] = [
        { id: "none", name: "None" },
        { id: "first_aid", name: "First Aid Kit" },
        { id: "mountaineers_kit", name: "Mountaineers Kit" },
        { id: "shovel", name: "Shovel" },
    ];

    const [selected, setSelected] = useState<string>(options[0].id);

    const handleSelect = (id: string) => {
        setSelected(id);
        if (onChange) {
            onChange(id);
        }
    };

    return (
        <div className="WbbExploration_Selection_FallenSoldier mb-3">
            <div className="fw-bold mb-2">Choose equipment to loot</div>

            {options.map((opt) => (
                <div className="form-check" key={opt.id}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="fallen-soldier-option"
                        value={opt.id}
                        checked={selected === opt.id}
                        onClick={() => handleSelect(opt.id)}
                        readOnly
                    />
                    <label
                        className={`form-check-label`}
                        onClick={() => handleSelect(opt.id)}
                    >
                        {opt.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default WbbExploration_Selection_FallenSoldier;