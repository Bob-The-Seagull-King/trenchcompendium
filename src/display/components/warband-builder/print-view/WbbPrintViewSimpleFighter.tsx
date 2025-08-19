import React, {useEffect, useState} from 'react';
import WbbAbilityDisplay from "../WbbAbilityDisplay";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faSkull, faTimes} from "@fortawesome/free-solid-svg-icons";
import {
    RealWarbandPurchaseEquipment,
    RealWarbandPurchaseModel
} from '../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import GenericHover from "../../generics/GenericHover";
import KeywordDisplay from "../../features/glossary/KeywordDisplay";
import {Keyword} from "../../../../classes/feature/glossary/Keyword";
import {
    getModelStatArmour,
    getModelStatMelee,
    getModelStatMove,
    getModelStatRanged,
    ModelStatistics
} from "../../../../classes/feature/model/ModelStats";
import {MemberUpgradesGrouped} from "../../../../classes/saveitems/Warband/Purchases/WarbandMember";
import {WarbandProperty} from "../../../../classes/saveitems/Warband/WarbandProperty";
import {useWarband} from "../../../../context/WarbandContext";

interface WbbPrintViewSimpleFighterProps {
    fighter: RealWarbandPurchaseModel;
}

const WbbPrintViewSimpleFighter: React.FC<WbbPrintViewSimpleFighterProps> = ({ fighter }) => {

    const boldXpIndices = [2, 4, 7, 10, 14, 18];
    const [keywordsList, setkeywords] = useState<Keyword[]>([])
    const [stats, setstats] = useState<ModelStatistics>({})
    const {warband, updateKey, reloadDisplay } = useWarband();

    const [complexstate, setComplexState] = useState({
        stats: {} as ModelStatistics,
        canchange: true as boolean,
        upgrades: {} as MemberUpgradesGrouped,
        abilities: [] as WarbandProperty[],
        statchoices: [] as ModelStatistics[][],
        allmodelequip: [] as RealWarbandPurchaseEquipment[],
        xpLimit: 0 as number,
        scarLimit: 3 as number,
        keywordsList: [] as Keyword[],
        modelslug: fighter.model.GetModelSlug() as string,
        keyvar: 0
    });

    useEffect(() => {
        async function SetModelOptions() {
            // setStatChoices(await fighter.GetStatOptions());
            setstats(await fighter.model.GetStats())
            // setcanchange(await fighter.CanChangeRank())
            setkeywords(await fighter.model.getContextuallyAvailableKeywords())
            // setkeyvar(keyvar + 1);
        }
        SetModelOptions();
    }, [])

    useEffect(() => {
        async function SetModelOptions() {

            const abilitiesnew = await fighter.model.BuildNewProperties()
            const upgradesnew = await fighter.model.GetWarbandUpgradeCollections()
            const XPLimitNew = await fighter.model.GetXPLimit();
            const keywordsnew = await fighter.model.getContextuallyAvailableKeywords()
            const modelslugnew = fighter.model.GetModelSlug()
            const allEquip = await fighter.model.GetAllEquipForShow()
            const statchoicenew = await fighter.model.GetStatOptions()
            const canchangenew = await fighter.model.CanChangeRank()
            const statsnew = await fighter.model.GetStats()
            const scarlimitnew = await fighter.model.GetMaxScars()

            setComplexState((prev) => ({
                stats: statsnew,
                canchange: canchangenew,
                upgrades: upgradesnew,
                abilities: abilitiesnew,
                statchoices: statchoicenew,
                allmodelequip: allEquip,
                xpLimit: XPLimitNew,
                scarLimit: scarlimitnew,
                keywordsList: keywordsnew,
                modelslug: modelslugnew,
                keyvar: prev.keyvar + 1
            }));
        }
        if (!warband?.warband_data.Models.includes(fighter.purchase)) {
            return;
        } else {
            SetModelOptions();
        }
    }, [updateKey, fighter])

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
                            {keywordsList.map((item, index) => (
                                <span
                                    key={`model_keyword_keyword_id_${item.ID}`}
                                >
                                    <GenericHover
                                        titlename={item.Name}
                                        d_name={item.Name}
                                        d_type={""}
                                        d_method={() => <KeywordDisplay data={item} />}
                                    />
                                    {index < keywordsList.length - 1 && ", "}
                                </span>
                            ))}
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
                                    {'Melee'}
                                </td>
                                <td>
                                    {'Ranged'}
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
                                    {getModelStatMove(stats)}
                                </td>
                                <td>
                                    {getModelStatMelee(stats)}
                                </td>
                                <td>
                                    {getModelStatRanged(stats)}
                                </td>
                                <td>
                                    {getModelStatArmour(stats)}
                                </td>

                                <td>
                                    {fighter.purchase.GetTotalDucats()}{' Ducats'}
                                    {' | '}
                                    {fighter.purchase.GetTotalGlory()}{' Glory Points'}
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
                        {complexstate.abilities.length > 0 && (
                            <>
                                {complexstate.abilities
                                    .map((ability, index) => (
                                        <span key={index}>{ability.Name}</span>
                                    ))
                                    .reduce<React.ReactNode[]>((acc, curr) => acc.length === 0 ? [curr] : [...acc, ', ', curr], [])}
                            </>
                        )}
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
