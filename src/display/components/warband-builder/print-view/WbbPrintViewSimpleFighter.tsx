import React from 'react';
import WbbAbilityDisplay from "../WbbAbilityDisplay";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faSkull, faTimes} from "@fortawesome/free-solid-svg-icons";
import { RealWarbandPurchaseModel } from '../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';

interface WbbPrintViewSimpleFighterProps {
    fighter: RealWarbandPurchaseModel;
}

const WbbPrintViewSimpleFighter: React.FC<WbbPrintViewSimpleFighterProps> = ({ fighter }) => {

    const boldXpIndices = [2, 4, 7, 10, 14, 18];


    return (
        <div className="WbbPrintViewSimpleFighter">
            <div className={'names-wrap'}>
                <div className={'row'}>
                    <div className={'col-4'}>
                        <span className={'inline-label'}>
                            {'Name:'}
                        </span>
                        <span className={'inline-value'}>
                            {fighter.model.GetName()}
                        </span>
                    </div>
                    <div className={'col-4'}>
                        <span className={'inline-label'}>
                            {'Type:'}
                        </span>
                        <span className={'inline-value'}>
                            {fighter.model.CurModel.GetName()}
                        </span>
                    </div>
                    <div className={'col-4'}>
                        <span className={'inline-label'}>
                            {'Keywords:'}
                        </span>
                        <span className={'inline-value'}>
                            {/* @TODO: Add fighter keywords */}
                            {'STRONG, TOUGH'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={'stats-row'}>
                <div className={'stats-wrap'}>
                    <table>
                        <tbody>
                            <tr className={'table-head-row'}>
                                <td>
                                    {'Movement'}
                                </td>
                                <td>
                                    {'Ranged'}
                                </td>
                                <td>
                                    {'Melee'}
                                </td>
                                <td>
                                    {'Armour'}
                                </td>

                                <td>
                                    {'Value'}
                                </td>
                            </tr>
                            <tr className={'table-stats-row'}>
                                <td>
                                    {/* @ TODO add values*/}
                                    {'6" / Infantry'}
                                </td>
                                <td>
                                    {/* @ TODO add values*/}
                                    {'+2D'}
                                </td>
                                <td>
                                    {/* @ TODO add values*/}
                                    {'-1D'}
                                </td>
                                <td>
                                    {/* @ TODO add values*/}
                                    {'-2'}
                                </td>

                                <td>
                                    {/* @ TODO add values*/}
                                    {'100'}{' Ducats'}
                                    {' | '}
                                    {'2'}{' Glory Points'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {fighter.model.IsElite() &&
                    <div className={'xp-wrap'}>
                        <div className={'xp-headline'}>
                            {'Experience'}
                        </div>
                        <div className={'xp-boxes'}>
                            {Array.from({length: 18}, (_, i) => {
                                const level = i + 1;
                                const isBold = boldXpIndices.includes(level);
                                const hasXP = level <= fighter.model.Experience;

                                return (
                                    <div
                                        key={level}
                                        className={`xp-box${isBold ? ' xp-box-bold' : ''}`}
                                    >
                                        {hasXP && <FontAwesomeIcon icon={faCheck}/>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }
            </div>

            <div className={'text-rows-wrap'}>
                <div className={'text-row abilities'}>
                    <span className={'inline-label'}>
                        {'Abilities:'}
                    </span>
                    <span className={'inline-value'}>
                        {/* @TODO: Add fighter Abilities as concat list*/}
                        {'Mine-Setting, Fortify Position, De-Mine'}
                    </span>
                </div>

                <div className={'text-row equipment'}>
                    <span className={'inline-label'}>
                        {'Equipment:'}
                    </span>
                    <span className={'inline-value'}>
                        {fighter.model.GetEquipment().length > 0 && (
                            <>
                                {fighter.model.GetEquipment()?.map((eq, idx) => (
                                    <span key={idx}>
                                        {eq.equipment.Name}
                                        {idx < (fighter.model.GetEquipment()?.length || 0) - 1 && ', '}
                                    </span>
                                ))}
                            </>
                        )}

                    </span>
                </div>

                <div className={'text-row advancements'}>
                    <span className={'inline-label'}>
                        {'Advancements:'}
                    </span>
                    <span className={'inline-value'}>
                        {fighter.model.Skills.length > 0 && (
                            <>
                                {fighter.model.Skills?.map((adv, idx) => (
                                    <span key={idx}>
                                        {adv.Name}
                                        {idx < (fighter.model.Skills?.length || 0) - 1 && ', '}
                                    </span>
                                ))}
                            </>
                        )}
                    </span>
                </div>

                <div className={'text-row injuries'}>
                    <span className={'inline-label'}>
                        {'Injuries:'}
                    </span>
                    <span className={'inline-value'}>
                        {fighter.model.Injuries.length > 0 && (
                            <>
                                {fighter.model.Injuries?.map((inj, idx) => (
                                    <span key={idx}>
                                        {inj.Name}
                                        {idx < (fighter.model.Injuries?.length || 0) - 1 && ', '}
                                    </span>
                                ))}
                            </>
                        )}

                        {fighter.model.IsElite() &&
                            <span className={'battle-scars'}>
                                <span className={'inline-label'}>
                                    {'Battle Scars'}
                                </span>

                                <div className="battle-scar-boxes">
                                    {Array.from({length: 3}, (_, i) => {
                                        const index = i + 1;
                                        const isChecked = index <= fighter.model.GetBattleScars();
                                        const isSkull = index === 3;

                                        return (
                                            <div key={index} className="battle-scar-box">
                                                {isSkull &&
                                                    <FontAwesomeIcon icon={faSkull} className={'final-icon'}/>
                                                }
                                                {isChecked &&
                                                    <FontAwesomeIcon icon={faTimes}/>
                                                }
                                            </div>
                                        );
                                    })}
                                </div>
                            </span>
                        }
                    </span>
                </div>
            </div>

        </div>
    );
};

export default WbbPrintViewSimpleFighter;
