import React from "react";
import { useWarband } from "../../../context/WarbandContext";
import WbbRoundNumber from "./micro-elements/WbbRoundNumber";


interface WbbRoundIndicatorProps {
    detailsOpen?: string | null;
}

const WbbRoundIndicator: React.FC<WbbRoundIndicatorProps> = ({detailsOpen}) => {
    const { warband } = useWarband();

    if (!warband) {
        return null;
    }

    const handleRoundClick = (roundNumber: number) => {
        alert(`Clicked round ${roundNumber}`);
    };

    const currentRound = warband.warband_data?.GetCampaignCycleView();

    return (
        <div className={`WbbRoundIndicator ${detailsOpen ? 'details-open' : ''}`}>
            <div className="container">
                <div className="WbbRoundIndicator-scroll">
                    <div className="WbbRoundIndicator-scroll-inner">
                        {Array.from({ length: currentRound + 1 }, (_, i) => {
                            const roundNumber = i + 1;
                            let state: "previous" | "current" | "next" = "previous";

                            if (roundNumber === currentRound) {
                                state = "current";
                            } else if (roundNumber === currentRound + 1) {
                                state = "next";
                            }

                            return (
                                <WbbRoundNumber
                                    key={roundNumber}
                                    round={roundNumber}
                                    state={state}
                                    onClick={handleRoundClick}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WbbRoundIndicator;
