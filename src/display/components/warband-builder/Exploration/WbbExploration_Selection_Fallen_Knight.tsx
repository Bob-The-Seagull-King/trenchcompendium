import React, { useState } from "react";

interface Option {
    id: string;
    name: string;
}

interface WbbExploration_Selection_Fallen_Knight_Props {
    onChange?: (selected: string) => void;
}

const WbbExploration_Selection_Fallen_Knight: React.FC<
    WbbExploration_Selection_Fallen_Knight_Props
> = ({ onChange }) => {
    const options: Option[] = [
        { id: "sword", name: "Sword" },
        { id: "polearm", name: "Polearm" },
    ];

    const [selected, setSelected] = useState<string>(options[0].id);

    const handleSelect = (id: string) => {
        setSelected(id);
        if (onChange) {
            onChange(id);
        }
    };

    return (
        <div className="WbbExploration_Selection_Fallen_Knight mb-3">
            <div className="fw-bold mb-2">Choose weapon to loot</div>

            {options.map((opt) => (
                <div className="form-check" key={opt.id}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="fallen-knight-option"
                        value={opt.id}
                        checked={selected === opt.id}
                        onClick={() => handleSelect(opt.id)}
                        readOnly
                    />
                    <label
                        className={`form-check-label `}
                        onClick={() => handleSelect(opt.id)}
                    >
                        {opt.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default WbbExploration_Selection_Fallen_Knight;
