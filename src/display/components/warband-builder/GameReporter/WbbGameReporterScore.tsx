// components/WbbGameReporterScore.tsx
import React from "react";
import { useWbbGameReportDetailView } from "../../../../context/WbbGameReportDetailViewContext";
import AlertCustom from "../../generics/AlertCustom";

const WbbGameReporterScore: React.FC = () => {
    const { state, setWarbandVictoryPoints } = useWbbGameReportDetailView();

    return (
        <div className="WbbGameReporterScore my-3">
            <h3 className="mb-3">{"Victory Points"}</h3>

            {state.warbands.length > 0 ? (
                <>
                    <p>{"Assign the victory points earned by each warband in this game."}</p>

                    <div className="row">
                        {state.warbands.length === 0 && (
                            <div className="col-12 text-muted">
                                {"No warbands selected yet. Please add warbands first."}
                            </div>
                        )}

                        {state.warbands.map((w) => (
                            <div className="col-6 mb-3" key={w.id}>
                                <label htmlFor={`vp-${w.id}`} className="form-label fw-bold">
                                    {w.name}
                                </label>
                                <input
                                    type="number"
                                    id={`vp-${w.id}`}
                                    className="form-control"
                                    min={0}
                                    step={1}
                                    value={w.victoryPoints ?? 0}
                                    onChange={(e) =>
                                        setWarbandVictoryPoints(w.id, parseInt(e.target.value, 10) || 0)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <AlertCustom
                    type={'warning'}
                >
                    <div>
                        {'You need to select at least one warband to submit a game'}
                    </div>
                </AlertCustom>
            )}

        </div>
    );
};

export default WbbGameReporterScore;
