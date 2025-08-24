import React, { useState } from "react";

interface Option {
    id: string;
    name: string;
    available: boolean;
}

interface WbbExploration_OptionSelect_Radio_Props {
    onChange?: (selected: string) => void;
}

const WbbExploration_OptionSelect_Radio: React.FC<
    WbbExploration_OptionSelect_Radio_Props
> = ({ onChange }) => {
    const options: Option[] = [
        { id: "surplus", name: "Surplus", available: true },
        { id: "distribute", name: "Distribute", available: true },
        { id: "indulge", name: "Indulge", available: false },
    ];

    const [selected, setSelected] = useState<string>(options[0].id);

    const handleSelect = (id: string) => {
        if (!options.find((o) => o.id === id)?.available) return;
        setSelected(id);
        if (onChange) {
            onChange(id);
        }
    };

    return (
        <div className="WbbExploration_OptionSelect_Radio">
            <div className="fw-bold mb-2">Choose Option</div>

            {options.map((opt) => (
                <div className="form-check" key={opt.id}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="exploration-option"
                        value={opt.id}
                        checked={selected === opt.id}
                        disabled={!opt.available}
                        onClick={() => handleSelect(opt.id)}
                        readOnly // verhindert React warning bei controlled input
                    />
                    <label
                        className={`form-check-label `}
                        onClick={() => handleSelect(opt.id)}
                        style={{ cursor: opt.available ? "pointer" : "not-allowed" }}
                    >
                        {opt.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default WbbExploration_OptionSelect_Radio;
