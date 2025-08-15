import React, { useState } from "react";
import { useWarband } from "../../../../context/WarbandContext";
import { useWbbMode } from "../../../../context/WbbModeContext";
import AlertCustom from "../../generics/AlertCustom";
import {WarbandMember} from "../../../../classes/saveitems/Warband/Purchases/WarbandMember";

const WbbPostGameDetailTroopInjuries: React.FC = () => {
    const { warband } = useWarband();
    const { edit_mode } = useWbbMode();

    const [killedPermanently, setKilledPermanently] = useState<{ [key: string]: boolean }>({});

    if (!warband) return <div>Loading...</div>;

    const handleToggleKilled = (fighterId: string) => {
        setKilledPermanently((prev) => ({
            ...prev,
            [fighterId]: !prev[fighterId],
        }));
    };

    const anyKilled = Object.values(killedPermanently).some(Boolean);

    return (
        <div className="WbbPostGameDetailTroopInjuries WbbPostGameDetail-Element">
            <div className="WbbPostGameDetail-Element-title">
                {"Troop Injury Rolls"}
            </div>

            <p>
                {"Which fighters have been permanently killed?"}
            </p>

            {warband.warband_data.GetFighters().map((fighter) => {
                if (
                    (fighter.model.IsTroop() || fighter.model.IsMercenary()) &&
                    fighter.model.State === "active"
                ) {
                    const fighterId = fighter.model.ID;
                    return (
                        <div key={fighterId} className="mb-2">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`killed-${fighterId}`}
                                    checked={!!killedPermanently[fighterId]}
                                    onChange={() => handleToggleKilled(fighterId)}
                                />
                                <label className="form-check-label" htmlFor={`killed-${fighterId}`}>
                                    {fighter.model.CurModel.GetName()}
                                    {fighter.model.GetFighterName() !== fighter.model.CurModel.GetName() && (
                                        <>{" - "}{fighter.model.GetFighterName()}</>
                                    )}
                                </label>
                            </div>
                        </div>
                    );
                }
                return null;
            })}

            {anyKilled && (
                <AlertCustom
                    type={'danger'}
                    className={'my-3'}
                >
                    {'The selected fighters will be retired.'}
                </AlertCustom>
            )}
        </div>
    );
};

export default WbbPostGameDetailTroopInjuries;
