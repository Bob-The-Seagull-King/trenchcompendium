import React from "react";
import {useWbbGameReportDetailView} from "../../../../context/WbbGameReportDetailViewContext";

// Example list of glorious deeds (replace with real source later)
const availableDeeds = [
    { id: "d1", name: "Reaper" },
    { id: "d2", name: "Sharpshooter" },
    { id: "d3", name: "Bloodletting" },
    { id: "d4", name: "Feigned Retreat" },
    { id: "d5", name: "Fickle Luck" },
    { id: "d6", name: "Head-hunter" },
];

const WbbGameReporterDeeds: React.FC = () => {
    const { state, setDeeds } = useWbbGameReportDetailView();

    // Update a deed at a specific index
    const handleDeedChange = (index: number, deedId: string) => {
        const updated = [...state.deeds];
        updated[index] = { ...updated[index], deedId };
        setDeeds(updated);
    };

    // Update the warband that achieved the deed
    const handleWarbandChange = (index: number, warbandId: string) => {
        const updated = [...state.deeds];
        updated[index] = { ...updated[index], warbandId };
        setDeeds(updated);
    };

    return (
        <div className="WbbGameReporterDeeds my-3">
            <h3 className="mb-3">{"Glorious Deeds"}</h3>

            <p>{"Select up to 6 glorious deeds and assign the warband that achieved each."}</p>

            {[...Array(6)].map((_, idx) => {
                const deed = state.deeds[idx] || { deedId: "", warbandId: "" };

                return (
                    <div className="row g-2 align-items-end mb-2" key={idx}>
                        {/* Left column: deed selection */}
                        <div className="col-6">
                            <label className="form-label">{`Deed ${idx + 1}`}</label>
                            <select
                                className="form-select"
                                value={deed.deedId}
                                onChange={(e) => handleDeedChange(idx, e.target.value)}
                            >
                                <option value="">-- Select a deed --</option>
                                {availableDeeds.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Right column: warband selection */}
                        <div className="col-6">
                            <label className="form-label">{"Warband"}</label>
                            <select
                                className="form-select"
                                value={deed.warbandId}
                                onChange={(e) => handleWarbandChange(idx, e.target.value)}
                            >
                                <option value="">-- Select a warband --</option>
                                {state.warbands.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WbbGameReporterDeeds;