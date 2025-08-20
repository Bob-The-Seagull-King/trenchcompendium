import React from 'react';
import { toRoman } from "../../../../utility/functions";

interface WbbRoundNumberProps {
    round: number;
    state: "previous" | "current" | "next";
    onClick?: (round: number) => void;
}

const WbbRoundNumber: React.FC<WbbRoundNumberProps> = ({ round, state, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(round);
        }
    };

    return (
        <div
            className={`WbbRoundNumber smaller state-${state}`}
            onClick={handleClick}
            role="button"
        >
            {toRoman(round)}
        </div>
    );
};

export default WbbRoundNumber;