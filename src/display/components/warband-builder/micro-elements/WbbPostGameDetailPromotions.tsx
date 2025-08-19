import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faDownload, faExclamation, faGift, faInfoCircle, faPen, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../../context/WarbandContext";
import {useWbbMode} from "../../../../context/WbbModeContext";
import {usePostGame} from "../../../../context/PostGameContext";
import AlertCustom from "../../generics/AlertCustom";



const WbbPostGameDetailPromotions: React.FC = () => {
    const { warband, reloadDisplay, updateKey } = useWarband();

    if (warband == null) return (<div>Loading...</div>);

    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2
    const [failedpromotions, setfailedpromotions] = useState<number>(warband.warband_data.Context.FailedPromotions);
    const { gloriousDeeds, setGloriousDeeds, hasWon, setHasWon } = usePostGame();

    const [selectedPromotion, setSelectedPromotion] = useState<string>("none");

    // Dice Pool and failed rolls
    const [dicePool, setDicePool] = useState<number>(1);
    const [newFailedPromotionDice, setNewFailedPromotionDice] = useState<number>(0);
    // State for input value
    const [promotionDiceInput, setPromotionDiceInput] = useState<number>(0);

    useEffect(() => {
        // Calc Dice Pool
        const pool = 1 + (hasWon ? 1 : 0) + gloriousDeeds.length;

        // @TODO: Add Showoff wildcard skill +1

        setDicePool(pool);

        // Calculated value for newFailedPromotionDice
        let calculatedValue = failedpromotions + pool;

        // if user could roll to 6 or more failed promotions, reset default to 0
        // - We assume the 6th roll as auto-promotion will be used
        if (calculatedValue > 5) {
            calculatedValue = 0;
        }

        // if a fighter is promoted
        if (selectedPromotion !== "none") {
            calculatedValue = 0;
        }

        setNewFailedPromotionDice(calculatedValue);
        setPromotionDiceInput(calculatedValue);
    }, [hasWon, gloriousDeeds, failedpromotions, selectedPromotion]);

    const handleFocusSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return (
        <div className="WbbPostGameDetailPromotions WbbPostGameDetail-Element">
            <div className="WbbPostGameDetail-Element-title">
                {'Promotions'}
            </div>

            <p>
                {"Which fighter has been promoted?"}
            </p>

            <div className={'fw-bold mb-1'}>
                {'Previous failed promotion rolls'}
            </div>
            <div className={'failed-promo'}>
                <div className="failed-promo-boxes">
                    {Array.from({length: 6}, (_, i) => {
                        const index = i + 1;
                        const isChecked = index <= failedpromotions;
                        const isSkull = index === 6;

                        return (
                            <div key={index} className="failed-promo-box">
                                {isSkull &&
                                    <FontAwesomeIcon icon={faGift} className={'final-icon'}/>
                                }
                                {isChecked &&
                                    <FontAwesomeIcon icon={faCheck}/>
                                }
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={'WbbPostGameDetailPromotions-dice-pool'}>
                <div className={'fw-bold mb-2'}>{'Your Dice Pool'}</div>
                <div>{'Default: '}{'1'}{' Dice'}</div>
                {hasWon &&
                    <div>{'Won the game: '}{'+1'}{' Dice'}</div>
                }

                {gloriousDeeds.map((deed) => (
                    <div key={deed.id}>
                        {deed.name}{': '}{'+1'}{' Dice'}
                    </div>
                ))}

                {/* @TODO: Add Showoff wildcard skill +1 */}

                <div className={'pool-total'}>
                    {'Total Promotion Dice: '}
                    <span className={'fw-bold'}>
                        {dicePool}{' Dice'}
                    </span>
                </div>
            </div>


            <div className={'mb-3'}>
                <div className={'fw-bold mb-2'}>{'Choose fighter to promote'}</div>

                {/* First Option: No promotion */}
                <div className="form-check mb-2">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="promotion-selection"
                        id="promotion-none"
                        value="none"
                        checked={selectedPromotion === "none"}
                        onChange={(e) => setSelectedPromotion(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="promotion-none">
                        No promotion
                    </label>
                </div>

                {/* Dynamische Fighter-Liste */}
                {warband.warband_data.GetFighters().map((fighter) => {
                    if (
                        (fighter.model.IsTroop() || fighter.model.IsMercenary()) &&
                        fighter.model.State === "active"
                    ) {
                        const fighterId = fighter.model.ID;
                        return (
                            <div key={fighterId} className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="promotion-selection"
                                    id={`promotion-${fighterId}`}
                                    value={fighterId}
                                    checked={selectedPromotion === fighterId}
                                    onChange={(e) => setSelectedPromotion(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor={`promotion-${fighterId}`}>
                                    {fighter.model.CurModel.GetName()}
                                    {fighter.model.GetFighterName() !== fighter.model.CurModel.GetName() && (
                                        <>{" - "}{fighter.model.GetFighterName()}</>
                                    )}
                                </label>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            <div className="mb-3">
                <label htmlFor="promotion-dice" className="form-label fw-bold">
                    {'Set new failed promotion rolls'}
                </label>
                <div className="input-group">
                    <input
                        type="number"
                        className="form-control"
                        id="promotion-dice"
                        min={0}
                        step={1}
                        value={promotionDiceInput}
                        onFocus={handleFocusSelectAll}
                        onChange={(e) => setPromotionDiceInput(Number(e.target.value))}
                    />
                    <span className="input-group-text text-muted">Dice</span>
                </div>

                {/* Hinweis anzeigen, wenn überschrieben */}
                {promotionDiceInput !== newFailedPromotionDice && (
                    <AlertCustom
                        type={'warning'}
                        className={'mt-3'}
                    >
                        {'The value for the new failed Promotion Dice pool may not be correct.'}
                        {(selectedPromotion !== "none" && promotionDiceInput > 0) &&
                            <div className={'mt-2'}>
                                <strong>{'Hint: '}</strong>{'You have promoted a fighter. This will reset the failed promotion dice counter to 0.'}
                            </div>
                        }
                        {(promotionDiceInput > 5) &&
                            <div className={'mt-2'}>
                                <strong>{'Hint: '}</strong>{'Your sixth promotion roll automatically succeeds. You cannot have more than 5 failed promotion rolls.'}
                            </div>
                        }
                    </AlertCustom>
                )}
            </div>
        </div>
    );
};

export default WbbPostGameDetailPromotions;
