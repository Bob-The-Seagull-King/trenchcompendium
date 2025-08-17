import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faSkull,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import { useWarband } from "../../../../context/WarbandContext";
import { useWbbMode } from "../../../../context/WbbModeContext";
import WbbOptionBox from "../WbbOptionBox";
import { GloriousDeed, usePostGame } from "../../../../context/PostGameContext";
import WbbModalAddAdvancement from "../modals/fighter/WbbAddAdvancement";
import WbbModalAddInjury from "../modals/fighter/WbbModalAddInjury";
import {RealWarbandPurchaseModel} from "../../../../classes/saveitems/Warband/Purchases/WarbandPurchase";
import AlertCustom from "../../generics/AlertCustom";

interface WbbPostGameDetailEliteProps {
    fighter: RealWarbandPurchaseModel;
}

const WbbPostGameDetailElite: React.FC<WbbPostGameDetailEliteProps> = ( {fighter}) => {

    const { warband } = useWarband();
    const { gloriousDeeds } = usePostGame();
    const { edit_mode } = useWbbMode();

    const [showAdvancementModal, setshowAdvancementModal] = useState(false);
    const [showInjuryModal, setshowInjuryModal] = useState(false);

    const [fighterDeeds, setFighterDeeds] = useState<string[]>([]);
    const [takingPart, setTakingPart] = useState(false);
    const [customXP, setCustomXP] = useState(0);



    const [battleScars, setBattleScars] = useState<number>(fighter.model.GetBattleScars());
    const initialScars = fighter.model.GetBattleScars();

    // Fighter has gone OOA checkbox
    const [OOAChecked, setOOAChecked] = useState(false);
    const handleChangeOOA = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setOOAChecked(checked);
        if (checked) {
            setBattleScars(initialScars + 1);
        } else {
            setBattleScars(initialScars);
        }
    };

    const xpboldXpIndices = [2, 4, 7, 10, 14, 18];
    const [xp, setXp] = useState<number>(fighter.model.GetExperiencePoints());
    const initialXP = fighter.model.GetExperiencePoints();

    // Checks how many new bold XP indeces the fighter has reached based on XP progression
    const [newlyReachedBold, setNewlyReachedBold] = useState<number[]>([]);
    useEffect(() => {
        // Find all bold xp values above the current xp value
        const reached = xpboldXpIndices.filter(
            (level) => level > initialXP && level <= xp
        );
        setNewlyReachedBold(reached);
    }, [xp, initialXP, xpboldXpIndices]);

    // Sets the value for the modified XP based on selections
    useEffect(() => {
        const calculatedXP =
            initialXP +
            (takingPart ? 1 : 0) +
            fighterDeeds.length +
            (customXP > 0 ? customXP : 0);

        setXp(calculatedXP);
    }, [initialXP, takingPart, fighterDeeds, customXP]);


    /**
     * Adding an advancemnt for a fighter
     * - This should not apply immediately but when the post game is submitted
     */
    const handleAddAdvancement = () => {
        alert('add advancement here');
    }

    /**
     * Adding an injury for a fighter
     * - This should not apply immediately but when the post game is submitted
     */
    const handleAddInjury = () => {
        alert('add injury here');
    }




    const toggleFighterDeed = (deedId: string) => {
        setFighterDeeds((prev) =>
            prev.includes(deedId)
                ? prev.filter((id) => id !== deedId)
                : [...prev, deedId]
        );
    };

    if (!warband) return <div>Loading...</div>;

    const handleFocusSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return (
        <div className="WbbPostGameDetailElite WbbPostGameDetail-Element">
            <div className="WbbPostGameDetail-Element-title">
                {fighter.model.CurModel.GetName()}
                { fighter.model.GetFighterName() != fighter.model.CurModel.GetName() &&
                    <>
                        {' - '}{fighter.model.GetFighterName()}
                    </>
                }
            </div>

            {/* Injuries */}
            <div className="WbbPostGameDetailElite-injuries">
                <div className="WbbPostGameDetail-Element-sub-headline">Injuries</div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`OOACheckbox-${fighter.model.ID}`}
                        checked={OOAChecked}
                        onChange={handleChangeOOA}
                    />
                    <label className="form-check-label" htmlFor={`OOACheckbox-${fighter.model.ID}`}>
                        {'Fighter has gone out of action'}
                    </label>
                </div>

                {OOAChecked && (
                    <div className="WbbPostGameDetailElite-injuries-detail">
                        <WbbOptionBox
                            title="Rolled Injury"
                            value="Leg Wound"
                            onClick={() => setshowInjuryModal(true)}
                        />

                        <div className={'mb-2'}>
                            <strong>
                                {'Battle scars'}
                            </strong>
                        </div>
                        <div className="battle-scar-boxes">
                            {/* @TODO: complex state max scars */}
                            {Array.from({length: 3}, (_, i) => {
                                const index = i + 1;
                                const isChecked = index <= battleScars;
                                const isNewScar = index > initialScars && index <= battleScars; // new scars above initial
                                const isSkull = index === 3;

                                return (
                                    <div
                                        key={index}
                                        className={`battle-scar-box${isNewScar ? " plusscar" : ""}`}
                                    >
                                        {isSkull && <FontAwesomeIcon icon={faSkull} className="final-icon"/>}
                                        {isChecked && <FontAwesomeIcon icon={faTimes}/>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Experience + Glorious Deeds */}
            {battleScars < 3 ? (
                <div className="WbbPostGameDetailElite-experience">
                    <div className="WbbPostGameDetail-Element-sub-headline">Experience</div>

                    {/* XP Boxes */}
                    <div className="xp-boxes">
                        {/* @TODO: Get actual Max length*/}
                        {Array.from({ length: 18 }, (_, i) => {
                            const level = i + 1;
                            const isBold = xpboldXpIndices.includes(level);
                            const isFilled = level <= xp; // xp = current value from state
                            const isNew = level > initialXP && level <= xp; // anything above initial value

                            return (
                                <div
                                    key={level}
                                    className={`xp-box${isBold ? " xp-box-bold" : ""}${isFilled ? " xp-filled" : ""}${isNew ? " plusxp" : ""}`}
                                >
                                    {isFilled && <FontAwesomeIcon icon={faCheck} />}
                                </div>
                            );
                        })}
                    </div>

                    <div className="row mt-3">
                        <div className="col-12 col-sm-6 mb-2">
                            <div className="fw-bold mb-2">
                                {'Add Experience'}
                            </div>

                            {/* Taking part */}
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`xp-taking-part-${fighter.model.ID}`}
                                    checked={takingPart}
                                    onChange={(e) => setTakingPart(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`xp-taking-part-${fighter.model.ID}`}>
                                    {'Taking part'}
                                </label>
                            </div>

                            {/* Glorious Deeds Checkboxes */}
                            {gloriousDeeds.map((deed) => (
                                <div className="form-check" key={deed.id}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`deed-${deed.id}-${fighter.model.ID}`}
                                        checked={fighterDeeds.includes(deed.id)}
                                        onChange={() => toggleFighterDeed(deed.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`deed-${deed.id}-${fighter.model.ID}`}>
                                        {deed.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Custom XP */}
                        <div className="col-12 col-sm-6">
                            <label htmlFor="customxp" className="form-label fw-bold">
                                {'+ Custom CP'}
                            </label>
                            <div className="input-group">

                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    className="form-control"
                                    id={`customxp-${fighter.model.ID}`}
                                    value={customXP}
                                    onFocus={handleFocusSelectAll}
                                    onChange={(e) => setCustomXP(Number(e.target.value) || 0)}
                                />
                                <span className="input-group-text text-muted">+ XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Advancement buttons */}
                    {newlyReachedBold.length > 0 && (
                        <div className="mt-2">
                            {newlyReachedBold.map((lvl) => (
                                <WbbOptionBox
                                    key={lvl}
                                    title="New Advancement"
                                    value="-"
                                    onClick={() => setshowAdvancementModal(true)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ):(
                <AlertCustom
                    type={'danger'}
                    className={'my-3'}
                >
                    {'The fighter has suffered his last scar and will be retired.'}
                </AlertCustom>
            )}


            {showAdvancementModal &&
                <WbbModalAddAdvancement
                    show={showAdvancementModal}
                    onClose={() => setshowAdvancementModal(false)}
                    onSubmit={handleAddAdvancement}
                    fighter={fighter}
                />}
            {showInjuryModal &&
                <WbbModalAddInjury
                    show={showInjuryModal}
                    onClose={() => setshowInjuryModal(false)}
                    onSubmit={handleAddInjury}
                    fighter={fighter}
                />}
        </div>
    );
};

export default WbbPostGameDetailElite;
