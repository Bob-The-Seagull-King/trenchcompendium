import {useWarband} from "../../../../context/WarbandContext";
import {useWbbMode} from "../../../../context/WbbModeContext";
import {GloriousDeed, usePostGame} from "../../../../context/PostGameContext";
import React, {useEffect, useState} from "react";

// Dummy Deeds
const availableDeeds: GloriousDeed[] = [
    { id: "d1", name: "Reaper" },
    { id: "d2", name: "Sharpshooter" },
    { id: "d3", name: "Bloodletting" },
    { id: "d4", name: "Feigned Retreat" },
    { id: "d5", name: "Fickle Luck" },
    { id: "d6", name: "Head-hunter" },
    { id: "d7", name: "Risk It Al" },
];

const WbbPostGameDetailGame: React.FC = () => {
    const { warband } = useWarband();
    const { edit_mode } = useWbbMode();
    const { gloriousDeeds, setGloriousDeeds, hasWon, setHasWon } = usePostGame();

    // Lokaler State für die 6 Auswahlfelder (IDs speichern)
    const [selectedIds, setSelectedIds] = useState<string[]>(Array(6).fill(""));

    // Wenn sich Auswahl ändert, in Context übertragen
    useEffect(() => {
        const deeds = selectedIds
            .filter((id) => id !== "")
            .map((id) => {
                const deed = availableDeeds.find((d) => d.id === id);
                return deed ? deed : { id, name: "Unknown" };
            });
        setGloriousDeeds(deeds);
    }, [selectedIds, setGloriousDeeds]);

    if (!warband) return <div>Loading...</div>;

    const handleChange = (index: number, value: string) => {
        const newSelections = [...selectedIds];
        newSelections[index] = value;
        setSelectedIds(newSelections);
    };

    return (
        <div className="WbbPostGameDetailGame WbbPostGameDetail-Element">
            <div className="WbbPostGameDetail-Element-title">
                {'Game Settings'}
            </div>

            {/* @TODO: Let user connect a game here */}
            {/* - This will set the glorious Deeds as they are set in the game */}

            <div className="WbbPostGameDetail-Element-sub-headline">
                {'Winner'}
            </div>
            <div className="mb-3">
                <label className="form-label d-block">Did you win the game?</label>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="gameWinner"
                        id="winnerYes"
                        checked={hasWon === true}
                        onChange={() => setHasWon(true)}
                    />
                    <label className="form-check-label" htmlFor="winnerYes">
                        Yes
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="gameWinner"
                        id="winnerNo"
                        checked={hasWon === false}
                        onChange={() => setHasWon(false)}
                    />
                    <label className="form-check-label" htmlFor="winnerNo">
                        No
                    </label>
                </div>
            </div>

            <div className="WbbPostGameDetail-Element-sub-headline">
                {'Glorious Deeds'}
            </div>
            <div className={'mb-3'}>
                {'Select the glorious deeds you warband has achieved during this game.'}
            </div>

            <div className={'row'}>
                {selectedIds.map((selectedId, idx) => (
                    <div className={'col-6'} key={idx}>
                        <div className="mb-3">
                            <label className="form-label">Deed {idx + 1}</label>
                            <select
                                className="form-select"
                                value={selectedId}
                                onChange={(e) => handleChange(idx, e.target.value)}
                            >
                                <option value="">-- Select a deed --</option>
                                {availableDeeds.map((deed) => (
                                    <option key={deed.id} value={deed.id}>
                                        {deed.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default WbbPostGameDetailGame;
