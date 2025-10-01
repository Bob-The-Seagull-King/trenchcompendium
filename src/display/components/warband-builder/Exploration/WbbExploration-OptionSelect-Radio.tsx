import { ISelectedOption } from "../../../../classes/saveitems/Warband/WarbandProperty";
import { ExplorationLocation } from "../../../../classes/feature/exploration/ExplorationLocation";
import { FilteredLocation, FilteredOptions } from "../../../../classes/saveitems/Warband/CoreElements/WarbandExplorationSet";
import React, { useState } from "react";
import { StaticOption } from "../../../../classes/options/StaticOption";

interface Option {
    option: ISelectedOption;
    name: string;
    available: boolean;
}

interface WbbExploration_OptionSelect_Radio_Props {
    onChange?: (newoption : ISelectedOption) => void;
    options : FilteredOptions;
}

const WbbExploration_OptionSelect_Radio: React.FC<
    WbbExploration_OptionSelect_Radio_Props
> = ({ onChange, options }) => {
    
    const combinedoptions: Option[] = GetFullListOfOptions();

    function GetFullListOfOptions() {
        const list : Option[] = []

        for (let i = 0; i < options.baseopt.Selections.length; i++) {
            const item_spec = options.baseopt.Selections[i]
            const item_ids = options.selection_valid.map(obj => obj.id)
            list.push(
                {
                    option: {
                        option_refID: options.baseopt.RefID,
                        selection_ID: item_spec.id
                    },
                    name: item_spec.display_str,
                    available: item_ids.includes(item_spec.id)
                }
            )
        }

        return list;
    }

    const [selected, setSelected] = useState<ISelectedOption | null>(null);
    const [keyvar, setkeyvar] = useState(0);

    const handleSelect = (opt : ISelectedOption) => {
        setSelected(opt);
        if (onChange) {
            onChange(opt);
        }
        setkeyvar(keyvar + 1)
    };

    return (
        <div className="WbbExploration_OptionSelect_Radio" key={keyvar}>
            <div className="fw-bold mb-2">Choose Option</div>

            {combinedoptions.map((opt) => (
                <div className="form-check" key={opt.option.selection_ID}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="exploration-option"
                        value={opt.name}
                        checked={selected?.selection_ID === opt.option.selection_ID}
                        disabled={!opt.available}
                        onClick={() => handleSelect(opt.option)}
                        readOnly // verhindert React warning bei controlled input
                    />
                    <label
                        className={`form-check-label `}
                        onClick={() => handleSelect(opt.option)}
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
