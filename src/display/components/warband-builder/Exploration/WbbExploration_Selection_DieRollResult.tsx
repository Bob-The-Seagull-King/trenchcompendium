import React, { useState } from "react";

interface WbbExploration_Selection_DieRollResult_Props {
    label: string;
    onChange?: (result: number) => void;
}

const WbbExploration_Selection_DieRollResult: React.FC<
    WbbExploration_Selection_DieRollResult_Props
> = ({ label,  onChange }) => {

    const [result, setResult] = useState<number | undefined>(undefined);



    return (
        <div className="WbbExploration_Selection_DieRollResult mb-3">
            <div className="fw-bold mb-2">{label}</div>

            <input
                type="number"
                className="form-control"
                min={0}
                value={result  ?? ''}
                onChange={(e) => {
                    const val = e.target.value;
                    setResult(val === '' ? undefined : parseInt(val));
                }}
                onFocus={(e) => e.target.select()}
            />
        </div>
    );
};

export default WbbExploration_Selection_DieRollResult;
