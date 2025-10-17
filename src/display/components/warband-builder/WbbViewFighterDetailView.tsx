import React, {useEffect, useState} from 'react';
import WbbEditViewFighter from "./WbbEditViewFighter";
import {
    faCheck,
    faChevronDown,
    faChevronLeft,
    faChevronUp,
    faCopy, faEllipsisVertical,
    faPen,
    faPlus,
    faSkull,
    faTimes,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ItemStat from "../subcomponents/description/ItemStat";
import WbbEquipmentListItem from "./WbbEquipmentListItem";
import WbbFighterCollapse from "./WbbFighterCollapse";
import WbbEditViewAdvancement from "./WbbEditViewAdvancement";
import WbbEditViewInjury from "./WbbEditViewInjury";
import WbbOptionItem from "./WbbOptionItem";
import WbbAbilityDisplay from "./WbbAbilityDisplay";
import SynodModelImage from "../../../utility/SynodModelImage";
import SynodModelImageSource from "../../../utility/SynodModelImageSource";
import {IWarbandMember, MemberUpgradePresentation, MemberUpgradesGrouped} from "../../../classes/saveitems/Warband/Purchases/WarbandMember";
import { RealWarbandPurchaseEquipment, RealWarbandPurchaseModel } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { Equipment } from '../../../classes/feature/equipment/Equipment';
import { Keyword } from '../../../classes/feature/glossary/Keyword';
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { makestringpresentable } from '../../../utility/functions';
import KeywordDisplay from '../features/glossary/KeywordDisplay';
import GenericHover from '../generics/GenericHover';
import { useWarband } from '../../../context/WarbandContext';
import { FactionEquipmentRelationship } from '../../../classes/relationship/faction/FactionEquipmentRelationship';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import { Injury } from '../../../classes/feature/ability/Injury';
import { Skill } from '../../../classes/feature/ability/Skill';
import { getModelStatArmour, getModelStatMelee, getModelStatMove, getModelStatRanged, ModelStatistics } from '../../../classes/feature/model/ModelStats';
import WbbEditFighterStatOption from './modals/fighter/WbbFighterStatOption';
import {useWbbMode} from "../../../context/WbbModeContext";


interface WbbFighterDetailViewProps {
    warbandmember: RealWarbandPurchaseModel;
    onClose: () => void;
}

const WbbViewFighterDetailView: React.FC<WbbFighterDetailViewProps> = ({ warbandmember, onClose }) => {

    const {warband, updateKey, reloadDisplay } = useWarband();

    const fighter = warbandmember.model;
    
    const [stats, setstats] = useState<ModelStatistics>({})
    const [canchange, setcanchange] = useState(true)
    const [upgrades, setupgrades] = useState<MemberUpgradesGrouped>({})
    const [abilities, setabilities] = useState<WarbandProperty[]>([])
    const [statchoices, setStatChoices] = useState<ModelStatistics[][]>([])
    const [allmodelequip, setAllmodelequip] = useState<RealWarbandPurchaseEquipment[]>([])
    const [xpLimit, setXPLimit] = useState<number>(0)
    const [keywordsList, setkeywords] = useState<Keyword[]>([])
    const [modelslug, setmodeslug] = useState(fighter.GetModelSlug())
    const [keyvar, setkeyvar] = useState(0);

    useEffect(() => {
        async function SetModelOptions() {
            setStatChoices(await fighter.GetStatOptions());
            setstats(await fighter.GetStats())
            setcanchange(await fighter.CanChangeRank())
            setkeywords(await fighter.getContextuallyAvailableKeywords())
            setkeyvar(keyvar + 1);
        }
        SetModelOptions();
    }, [updateKey])
    
    useEffect(() => {
        async function SetModelOptions() {
            const abilities = await fighter.BuildNewProperties()
            const upgrades = await fighter.GetWarbandUpgradeCollections()
            setabilities(abilities);
            setupgrades(upgrades);
            const XPLimit = await fighter.GetXPLimit();
            setXPLimit(XPLimit)
            setkeywords(await fighter.getContextuallyAvailableKeywords())
            setmodeslug(fighter.GetModelSlug())
            setAllmodelequip(await fighter.GetAllEquipForShow())
            setStatChoices(await fighter.GetStatOptions());
            setcanchange(await fighter.CanChangeRank())
            setstats(await fighter.GetStats())
            reloadDisplay()
        }

        SetModelOptions();
    }, [fighter]);

    const { play_mode, edit_mode, view_mode, print_mode, setMode, mode } = useWbbMode(); // play mode v2

    useEffect(() => {
        async function SetDisplayOptions() {
            setAllmodelequip(await fighter.GetAllEquipForShow())
            reloadDisplay()
        }

        SetDisplayOptions();
    }, [mode]);

    /**
     * Equipment Modals
     */
    // Ranged Weapons
    const [showAddRangedWeapon, setShowAddRangedWeapon] = useState(false);
    const handleAddEquipment = (weapon: FactionEquipmentRelationship) => {
        fighter.AddEquipment(weapon).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        })
    };

    // Melee Weapons
    const [showMeleeWeaponModal, setShowMeleeWeaponModal] = useState(false);

    // Equipment
    const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
    // Armour
    const [showAddArmourModal, setShowAddArmourModal] = useState(false);

    /**
     * Campaign Modals
     */

    // Experience
    const [showXPModal, setShowXPModal] = useState(false);
    const handleXPSubmit = (newXP: number) => {
        fighter.SetExperience(newXP).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        });
    };

    // Battle Scars
    const [showEditScars, setShowEditScars] = useState(false);
    const handleUpdateBattleScars = (newScars: number) => {
        fighter.SetScars(newScars).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        });
    };

    // Advancements
    const [showAdvancementModal, setShowAdvancementModal] = useState(false);
    const handleAddAdvancement = (advancement: Skill) => {
        fighter.AddSkill(advancement).then(() => {
            warband?.warband_data.RebuildProperties().then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        })});
    };

    const [showInjuryModal, setShowInjuryModal] = useState(false);
    const handleAddInjury = (injury: Injury) => {
        fighter.AddInjury(injury).then(() => {
            warband?.warband_data.RebuildProperties().then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        })});
    };

    // Fighter status
    const [showStatusModal, setShowStatusModal] = useState(false);
    const handleStatusUpdate = (newStatus: string) => {
        if (newStatus == 'active' || newStatus == 'reserved' || newStatus == 'lost' || newStatus == 'dead') {
            fighter.State = newStatus;
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        }
    };
    const handleRankUpdate = () => {
        fighter.ChangeRank()
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
    };

    return (

        <div className={`WbbDetailView WbbFighterDetailView fighter-card ${play_mode ? 'play-mode' : ''}`}>
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text fighter-name'}>
                    {fighter.GetModelName()}
                    { fighter.GetFighterName() != '' &&
                        <>
                            {' - ' + fighter.GetFighterName()}
                        </>
                    }

                </div>

                <div className={'fighter-cost'}>
                    { warbandmember.purchase.GetTotalDucats() > 0 &&
                        <>
                            {warbandmember.purchase.GetTotalDucats() + " D"}
                        </>
                    }
                    { warbandmember.purchase.GetTotalDucats() > 0 && warbandmember.purchase.GetTotalGlory() > 0 &&
                        <>
                            {" / "}
                        </>
                    }
                    { warbandmember.purchase.GetTotalGlory() > 0 &&
                        <>
                            {warbandmember.purchase.GetTotalGlory() + " G"}
                        </>
                    }
                </div>
            </div>

            <div className={'fighter-card-main-area'}>
                {fighter.GetModelSlug() != '' &&
                    <div className={'fighter-image-wrap full'}>
                        <SynodModelImage
                            modelSlug={modelslug}
                            size="medium"
                            className={'fighter-image'}
                        />
                    </div>
                }

                <div className="fighter-card-meta fighter-card-meta-above">
                    <div className="fighter-meta-entry-simple">
                        <span className="fighter-meta-label">
                            {'Name: '}
                        </span>
                        <span className="fighter-meta-value">
                            {fighter.GetFighterName()}
                        </span>
                    </div>

                    <div className="fighter-meta-entry-simple">
                        <span className="fighter-meta-label">
                            {'Type: '}
                        </span>
                        <span className="fighter-meta-value">
                            {fighter.GetModelName()}
                        </span>
                    </div>
                    <div className="fighter-meta-entry-simple">
                            <span className="fighter-meta-label">
                                {'Base Cost: '}
                            </span>
                            <span className="fighter-meta-value">
                                {warbandmember.purchase.CostType == 0 &&
                                    <>
                                        {warbandmember.purchase.ItemCost + " Ducats"}
                                    </>
                                }
                                {warbandmember.purchase.CostType == 1 &&
                                    <>
                                        {warbandmember.purchase.ItemCost + " Glory Points"}
                                    </>
                                }
                            </span>
                        </div>
                    
                    <div className="fighter-meta-entry-simple">
                        <span className="fighter-meta-label">
                            {'Kewords: '}
                        </span>                        
                        <span className="fighter-meta-value">
                            {keywordsList.map((item, index) => (
                                <span
                                    key={`model_keyword_${fighter.ID}_keyword_id_${item.ID}`}
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
                    <div key={keyvar} className="fighter-meta-entry-simple">
                        <span className="fighter-meta-label">
                            {'Base: '}
                        </span>
                        <span className="fighter-meta-value">
                            {stats.base? stats.base.join('x') + "mm" : "-"}
                        </span>
                    </div>

                </div>

                <div key={keyvar}  className={'fighter-card-stats'}>
                    <ItemStat title={"Movement"} value={getModelStatMove(stats)}/>
                    {stats.melee != undefined &&
                        <ItemStat title={"Melee"} value={getModelStatMelee(stats)}/>
                    }
                    {stats.ranged != undefined &&
                        <ItemStat title={"Ranged"} value={getModelStatRanged(stats)}/>
                    }
                    <ItemStat title={"Armor"} value={getModelStatArmour(stats)}/>
                </div>

                <div className="fighter-card-meta fighter-card-meta-below">
                    <div className="fighter-meta-entry-simple synod-image-source-wrap">
                        {'Image: '}

                        <SynodModelImageSource
                            modelSlug={fighter.GetModelSlug()}
                        />
                    </div>
                </div>
            </div>


            {/*
              * Other Upgrades
              * - This is split into goetic and regular upgrades
              */}
            {Object.keys(upgrades).length > 0 &&
                <>
                    {Object.keys(upgrades).filter((item) => (
                        (edit_mode) || (upgrades[item].upgrades.filter((subitem : MemberUpgradePresentation) => subitem.purchase != null).length > 0)
                    )).map((item, index) => (
                        <div className={'fighter-card-collapse-wrap'} key={index}>
                            <WbbFighterCollapse
                                title={makestringpresentable(item)}
                                initiallyOpen={false}
                            >
                                <>
                                    {upgrades[item].upgrades.filter((item) => ((edit_mode) || item.purchase != null)).map((subitem, index) => (
                                        <WbbOptionItem key={index.toString() + updateKey.toString()} option={subitem} owner={fighter} category={item}/>
                                    ))}
                                </>
                            </WbbFighterCollapse>
                        </div>
                    ))}
                </>
            }




            {/* Play Mode Content */}
            {(play_mode) &&
                <div className={'fighter-card-play-mode-info'}  key={keyvar}>

                    <div className={'play-mode-equipment-wrap'}>
                        {allmodelequip.filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                        ).length > 0 && (
                            <>
                                <h3>{'Ranged Weapons'}</h3>
                                {allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        )
                        }
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        {allmodelequip.filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                        ).length > 0 && (
                            <>
                                <h3>{'Melee Weapons'}</h3>
                                {allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        )
                        }
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        
                        {allmodelequip.filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                        ).length > 0 && (
                            <>
                                <h3>{'Armour'}</h3>
                                {allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        )
                        }
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        {allmodelequip.filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                        ).length > 0 && (
                            <>
                                <h3>{'Equipment'}</h3>
                                {allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        )
                        }
                    </div>

                    {abilities.length > 0 &&
                    <div className={'play-mode-abilities-wrap'}>
                        <h3>{'Abilities'}</h3>
                        {abilities.map((ability, index) => (
                            <WbbAbilityDisplay key={index} ability={ability}/>
                        ))}
                    </div>
                    }

                    {fighter.GetSkillsList().length > 0 &&
                        <div className={'play-mode-advancements-wrap'}>
                            <h3>{'Advancements'}</h3>
                            {fighter.GetSkillsList().map((advancement) => (
                                <WbbEditViewAdvancement advancement={advancement} key={advancement.ID + fighter.ID}
                                                    fighter={warbandmember}/>
                            ))}
                        </div>

                    }

                    {fighter.GetInjuriesList().length > 0 &&
                    <div className={'play-mode-injuries-wrap'} >
                        <h3>{'Injuries'}</h3>
                        {fighter.GetInjuriesList().map((injury) => (
                            <WbbEditViewInjury injury={injury} key={injury.ID + fighter.ID}
                                                fighter={warbandmember}/>
                        ))}
                    </div>
                    }
                </div>
            }
        </div>
    );
};

export default WbbViewFighterDetailView;
