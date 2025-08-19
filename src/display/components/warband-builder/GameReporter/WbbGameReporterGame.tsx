// components/WbbGameReporterGame.tsx
import React from "react";
import {useWbbGameReportDetailView} from "../../../../context/WbbGameReportDetailViewContext";
// Example scenario and deployment options
const scenarios = [
    { id: "s1", name: "Seize the Relic" },
    { id: "s2", name: "Hold the Ground" },
    { id: "s3", name: "Ambush" },
];

const deployments = [
    { id: "d1", name: "Standard Deployment" },
    { id: "d2", name: "Flank Attack" },
    { id: "d3", name: "Encirclement" },
];

const WbbGameReporterGame: React.FC = () => {
    const { state, setGameDetails } = useWbbGameReportDetailView();

    return (
        <div className="WbbGameReporterGame my-3">
            <h3>{"Game Details"}</h3>

            <div className="row">
                <div className="col-6">
                    {/* Scenario Selection */}
                    <div className="mb-3">
                        <label htmlFor="scenario-select" className="form-label fw-bold">
                            Scenario
                        </label>
                        <select
                            id="scenario-select"
                            className="form-select"
                            value={state.gameDetails.scenario}
                            onChange={(e) => setGameDetails({ scenario: e.target.value })}
                        >
                            <option value="">-- Select a Scenario --</option>
                            {scenarios.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    {/* Deployment Selection */}
                    <div className="mb-3">
                        <label htmlFor="deployment-select" className="form-label fw-bold">
                            Deployment
                        </label>
                        <select
                            id="deployment-select"
                            className="form-select"
                            value={state.gameDetails.deployment}
                            onChange={(e) => setGameDetails({ deployment: e.target.value })}
                        >
                            <option value="">-- Select Deployment --</option>
                            {deployments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    {/* Winner Selection */}
                    <div className="mb-3">
                        <label htmlFor="winner-select" className="form-label fw-bold">
                            Winner
                        </label>
                        <select
                            id="winner-select"
                            className="form-select"
                            value={state.gameDetails.winnerId}
                            onChange={(e) => setGameDetails({ winnerId: e.target.value })}
                        >
                            <option value="">-- Select Winner --</option>
                            {state.warbands.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-6">
                    {/* Date Selection */}
                    <div className="mb-3">
                        <label htmlFor="game-date" className="form-label fw-bold">
                            Date of Game
                        </label>
                        <input
                            type="date"
                            id="game-date"
                            className="form-control"
                            value={state.gameDetails.date}
                            onChange={(e) => setGameDetails({ date: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WbbGameReporterGame;