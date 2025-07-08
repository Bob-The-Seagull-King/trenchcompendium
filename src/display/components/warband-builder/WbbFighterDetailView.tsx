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
import WbbModalAddEquipment from "./modals/fighter/WbbModalAddEquipment";
import WbbModalAddRangedWeapon from "./modals/fighter/WbbAddRangedWeapon";
import WbbModalAddMeleeWeapon from "./modals/fighter/WbbAddMeleeWeapon";
import WbbModalAddAdvancement from "./modals/fighter/WbbAddAdvancement";
import WbbModalAddInjury from "./modals/fighter/WbbModalAddInjury";
import WbbEditFighterExperience from "./modals/fighter/WbbEditFighterExperience";
import WbbEditBattleScars from "./modals/fighter/WbbEditBattleScars";
import WbbEditFighterStatus from "./modals/fighter/WbbEditFighterStatus";
import WbbOptionItem from "./WbbOptionItem";
import WbbAbilityDisplay from "./WbbAbilityDisplay";
import {OverlayTrigger, Popover} from "react-bootstrap";
import {usePlayMode} from "../../../context/PlayModeContext";
import SynodImage from "../../../utility/SynodImage";
import WbbContextualPopover from "./WbbContextualPopover";
import SynodModelImage from "../../../utility/SynodModelImage";
import SynodModelImageSource from "../../../utility/SynodModelImageSource";
import WbbModalEditFighterStatus from "./modals/fighter/WbbEditFighterStatus";
import {IWarbandMember, MemberUpgradePresentation, MemberUpgradesGrouped} from "../../../classes/saveitems/Warband/Purchases/WarbandMember";
import { RealWarbandPurchaseEquipment, RealWarbandPurchaseModel } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { returnDescription } from '../../../utility/util';
import { Equipment } from '../../../classes/feature/equipment/Equipment';
import { Ability } from '../../../classes/feature/ability/Ability';
import { UpgradesGrouped } from '../../../classes/relationship/model/ModelUpgradeRelationship';
import { Keyword } from '../../../classes/feature/glossary/Keyword';
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import RulesModelDisplayCollapse from '../rules-content/RulesModelDisplayCollapse';
import { makestringpresentable } from '../../../utility/functions';
import KeywordDisplay from '../features/glossary/KeywordDisplay';
import GenericHover from '../generics/GenericHover';
import { useWarband } from '../../../context/WarbandContext';
import { FactionEquipmentRelationship } from '../../../classes/relationship/faction/FactionEquipmentRelationship';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import { ModelEquipmentRelationship } from '../../../classes/relationship/model/ModelEquipmentRelationship';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import { Injury } from '../../../classes/feature/ability/Injury';
import { Skill } from '../../../classes/feature/ability/Skill';
import { getModelStatArmour, getModelStatMelee, getModelStatMove, getModelStatRanged, ModelStatistics } from '../../../classes/feature/model/ModelStats';
import WbbEditFighterStatOption from './modals/fighter/WbbFighterStatOption';


interface WbbFighterDetailViewProps {
    warbandmember: RealWarbandPurchaseModel;
    onClose: () => void;
}

const WbbFighterDetailView: React.FC<WbbFighterDetailViewProps> = ({ warbandmember, onClose }) => {

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

    const { playMode } = usePlayMode();

    useEffect(() => {
        async function SetDisplayOptions() {
            setAllmodelequip(await fighter.GetAllEquipForShow())
            reloadDisplay()
        }

        SetDisplayOptions();
    }, [playMode]);

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
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        });
    };

    const [showInjuryModal, setShowInjuryModal] = useState(false);
    const handleAddInjury = (injury: Injury) => {
        fighter.AddInjury(injury).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        });
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

        <div className={`WbbDetailView WbbFighterDetailView fighter-card ${playMode ? 'play-mode' : ''}`}>
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

                {!playMode &&
                    <WbbContextualPopover
                        id={`fighter-detail-`} // @TODO: add unique fighter index identifier to distinguish fighter with the same model / name
                        type="fighter"
                        item={fighter}
                    />
                }
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

                    {!playMode &&
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
                    }
                    
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

                    {!playMode &&
                        <div key={keyvar} className="fighter-meta-entry-simple">
                            <span className="fighter-meta-label">
                                {'Base: '}
                            </span>
                            <span className="fighter-meta-value">
                                {stats.base? stats.base.join('x') + "mm" : "-"}
                            </span>
                        </div>
                    }

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

            {/* Edit Loadout */}
            {(!playMode && statchoices.length > 0) &&
                <div className={'fighter-card-collapse-wrap'}>
                    <WbbFighterCollapse title="Profile Options" initiallyOpen={true} key={updateKey}>
                        <>
                            {statchoices.map((item) => 
                                
                                    <WbbEditFighterStatOption
                                        fighter={warbandmember}
                                        options={item}
                                        key={statchoices.indexOf(item)}
                                    />
                                
                            )}
                        </>
                    </WbbFighterCollapse>
                </div>
            }

            {/*
              * Other Upgrades
              * - This is split into goetic and regular upgrades
              */}
            {Object.keys(upgrades).length > 0 &&
                <>
                    {Object.keys(upgrades).filter((item) => (
                        (!playMode) || (upgrades[item].upgrades.filter((subitem : MemberUpgradePresentation) => subitem.purchase != null).length > 0)
                    )).map((item, index) => (
                        <div className={'fighter-card-collapse-wrap'} key={index}>
                            <WbbFighterCollapse
                                title={makestringpresentable(item)}
                                initiallyOpen={false}
                            >
                                <>
                                    {item != "upgrades" &&
                                        <p>
                                            {fighter.GetFighterName() + " can choose up to " + upgrades[item].limit.toString() + " " + makestringpresentable(item) + "."}
                                        </p>
                                    }

                                    {upgrades[item].upgrades.filter((item) => ((!playMode) || item.purchase != null)).map((subitem, index) => (
                                        <WbbOptionItem key={index.toString() + updateKey.toString()} option={subitem} owner={fighter} category={item}/>
                                    ))}
                                </>
                            </WbbFighterCollapse>
                        </div>
                    ))}
                </>
            }

            {/* Edit Loadout */}
            {(!playMode) &&
                <div className={'fighter-card-collapse-wrap'}>
                    <WbbFighterCollapse title="Equipment" initiallyOpen={true} key={updateKey}>
                        <p> {/* Equipment Rules */}
                            <strong>Equipment: </strong>
                            {returnDescription(fighter, fighter.CurModel.Description)}
                        </p>

                        {fighter.ModelEquipments.filter((item) => (item.SelfDynamicProperty.Selections.length > 0)).length > 0 &&
                            <>
                                <h3>{'Loadout Options'}</h3>
                                {fighter.ModelEquipments.filter((item) => (item.SelfDynamicProperty.Selections.length > 0)).map((item) => 
                                <>
                                    {item.SelfDynamicProperty.Selections.map((selec) => 
                                        <WbbOptionSelect 
                                        property={item}
                                        key={item.SelfDynamicProperty.Selections.indexOf(selec)}
                                        choice={selec}
                                        />
                                    )}
                                </>
                                    )}
                            </>
                        }

                        {/* Ranged Weapons */}
                        <h3>{'Ranged Weapons'}</h3>
                        {fighter.GetEquipment().filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                        ).length > 0 ? (
                            <>
                                {fighter.GetEquipment().filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={fighter.GetEquipment().indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        ) : (
                            <div className={'fighter-items-empty'}>No ranged weapons equipped</div>
                        )}

                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddRangedWeapon(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Ranged Weapon'}
                        </div>

                        {/* Melee Weapons */}
                        <h3>{'Melee Weapons'}</h3>
                        {fighter.GetEquipment().filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                        ).length > 0 ? (
                            <>
                                {fighter.GetEquipment().filter((item) =>
                                    ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                                ).map((equip) =>
                                    (
                                        <WbbEquipmentListItem
                                            key={fighter.GetEquipment().indexOf(equip)}
                                            item={equip.purchase}
                                            fighter={warbandmember}
                                        />
                                    ))}
                            </>
                        ) : (
                            <div className={'fighter-items-empty'}>No melee weapons equipped</div>
                        )}


                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowMeleeWeaponModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Melee Weapon'}
                        </div>
                        

                        {/* Armour */}
                        <h3>{'Armour'}</h3>
                        {fighter.GetEquipment().filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                        ).length ? (
                            <>
                                {fighter.GetEquipment().filter((item) =>
                                    ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                                ).map((equip) =>
                                    (
                                        <WbbEquipmentListItem
                                            key={fighter.GetEquipment().indexOf(equip)}
                                            item={equip.purchase}
                                            fighter={warbandmember}
                                        />
                                    ))}
                            </>
                        ) : (
                            <div className={'fighter-items-empty'}>No armour equipped</div>
                        )}

                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddArmourModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Armour'}
                        </div>

                        {/* Equipment */}
                        <h3>{'Equipment'}</h3>
                        {fighter.GetEquipment().filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                        ).length > 0 ? (
                            <>
                                {fighter.GetEquipment().filter((item) =>
                                    ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                                ).map((equip) =>
                                    (
                                        <WbbEquipmentListItem
                                            key={fighter.GetEquipment().indexOf(equip)}
                                            item={equip.purchase}
                                            fighter={warbandmember}
                                        />
                                    ))}
                            </>
                        ) : (
                            <div className={'fighter-items-empty'}>No equipment selected</div>
                        )}

                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddEquipmentModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Equipment'}
                        </div>

                        {/* Equipment Modals */}
                        <WbbModalAddEquipment
                            show={showAddRangedWeapon}
                            onClose={() => setShowAddRangedWeapon(false)}
                            onSubmit={handleAddEquipment}
                            fighter={warbandmember}
                            category='ranged'
                        />
                        <WbbModalAddEquipment
                            show={showMeleeWeaponModal}
                            onClose={() => setShowMeleeWeaponModal(false)}
                            onSubmit={handleAddEquipment}
                            fighter={warbandmember}
                            category='melee'
                        />
                        <WbbModalAddEquipment
                            show={showAddArmourModal}
                            onClose={() => setShowAddArmourModal(false)}
                            onSubmit={handleAddEquipment}
                            fighter={warbandmember}
                            category='armour'
                        />
                        <WbbModalAddEquipment
                            show={showAddEquipmentModal}
                            onClose={() => setShowAddEquipmentModal(false)}
                            onSubmit={handleAddEquipment}
                            fighter={warbandmember}
                            category='equipment'
                        />
                    </WbbFighterCollapse>
                </div>
            }


            {/* Edit Campaign Play */}
            {(!playMode) &&
                <div className={'fighter-card-collapse-wrap'}>
                    <WbbFighterCollapse title="Campaign Play">

                        {/* Experience */}
                        {fighter.IsElite() &&
                            <div className={'experience'}>
                                <h3>{'Experience'}</h3>

                                <div className={'btn btn-primary btn-sm edit-xp-btn'}
                                     onClick={() => setShowXPModal(true)}>
                                    <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                                    {'Edit'}
                                </div>

                                <div className={'xp-boxes'} onClick={() => setShowXPModal(true)}>
                                    {Array.from({length: xpLimit}, (_, i) => {
                                        const level = i + 1;
                                        const isBold = fighter.boldXpIndices.includes(level);
                                        const hasXP = level <= fighter.GetExperiencePoints();

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

                        {/* Battle Scars */}
                        {(fighter.IsElite() || fighter.Injuries.length > 0) &&
                            <div className={'battle-scars'}>

                                <h3></h3>

                                {fighter.IsElite() &&
                                    <div className={'btn btn-primary btn-sm edit-battle-scar-btn'}
                                        onClick={() => setShowEditScars(true)}>
                                        <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                                        {'Edit'}
                                    </div>
                                }

                                <div className="battle-scar-boxes" onClick={() => setShowEditScars(true)}>
                                    {Array.from({length: 3}, (_, i) => {
                                        const index = i + 1;
                                        const isChecked = index <= fighter.GetBattleScars();
                                        const isSkull = index === 3;

                                        return (
                                            <div key={index} className="battle-scar-box">
                                                {isSkull &&
                                                    <FontAwesomeIcon icon={faSkull} className={'skull-icon'}/>
                                                }
                                                {isChecked &&
                                                    <FontAwesomeIcon icon={faTimes}/>
                                                }
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        }

                        {/* Advancements & Injuries */}
                        {(fighter.IsElite() || fighter.Skills.length > 0) &&
                            <>
                                <h3>{'Advancements'}</h3>
                                {fighter.GetSkillsList().map((advancement) => (
                                    <WbbEditViewAdvancement advancement={advancement} key={advancement.ID + fighter.ID}
                                            fighter={warbandmember}/>
                                ))}
                                {fighter.IsElite() &&
                                    <div className={'btn btn-add-element btn-block'}
                                        onClick={() => setShowAdvancementModal(true)}>
                                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                        {'Add Advancement'}
                                    </div>
                                }
                            </>
                        }
                        {(fighter.IsElite() || fighter.Injuries.length > 0) &&
                            <>
                                <h3>{'Injuries'}</h3>
                                {fighter.GetInjuriesList().map((injury) => (
                                    <WbbEditViewInjury injury={injury} key={injury.ID  + fighter.ID}
                                            fighter={warbandmember}/>
                                ))}
                                {fighter.IsElite() &&
                                    <div className={'btn btn-add-element btn-block'}
                                        onClick={() => setShowInjuryModal(true)}>
                                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                        {'Add Injury'}
                                    </div>
                                }
                            </>
                        }
                        


                        {/*
                        - Active
                        - Captured
                        - Dead
                        */}
                        <h3>{'Fighter Status'}</h3>
                        <div className={'fighter-status'}>
                            <div className={'fighter-status-string'}>
                                {makestringpresentable(fighter.State)}
                            </div>

                            <div className={'btn btn-primary'} onClick={() => setShowStatusModal(true)}>
                                <FontAwesomeIcon icon={faPen} className={'icon-inline-left-l'}/>

                                {'Change'}
                            </div>
                        </div>

                        {!fighter.IsMercenary() &&
                            <>
                                <h3>{'Fighter Rank'}</h3>
                                <div className={'fighter-status'}>
                                    <div className={'fighter-status-string'}>
                                        {fighter.IsElite()? "Elite" : "Troop"}

                                        {fighter.HasLimitedPotential() &&
                                            <small>
                                                <br/>
                                                {'limited potential'}
                                            </small>
                                        }
                                    </div>
                                    {canchange &&
                                        <div className={'btn btn-primary'} onClick={() => handleRankUpdate()}>
                                            <FontAwesomeIcon icon={fighter.IsElite()? faChevronDown : faChevronUp} className={'icon-inline-left-l'}/>
                                            {fighter.IsElite()? "Demote" : "Promote"}
                                        </div>
                                    }

                                    {!canchange && (
                                        <small>
                                            {'Cannot be promoted'}
                                        </small>
                                    )}
                                </div>
                            </>
                        }

                        {/* Campaign Modals */}
                        <WbbEditFighterExperience
                            show={showXPModal}
                            onClose={() => setShowXPModal(false)}
                            currentXP={fighter.GetExperiencePoints()}
                            onSubmit={handleXPSubmit}
                        />
                        <WbbEditBattleScars
                            show={showEditScars}
                            onClose={() => setShowEditScars(false)}
                            currentScars={fighter.GetBattleScars()}
                            onSubmit={handleUpdateBattleScars}
                        />
                        <WbbModalAddAdvancement
                            show={showAdvancementModal}
                            onClose={() => setShowAdvancementModal(false)}
                            onSubmit={handleAddAdvancement}
                            fighter={warbandmember}
                        />
                        <WbbModalAddInjury
                            show={showInjuryModal}
                            onClose={() => setShowInjuryModal(false)}
                            onSubmit={handleAddInjury}
                            fighter={warbandmember}
                        />
                        <WbbModalEditFighterStatus
                            show={showStatusModal}
                            onClose={() => setShowStatusModal(false)}
                            currentStatus={fighter.State} 
                            onSubmit={handleStatusUpdate}
                        />
                    </WbbFighterCollapse>
                </div>
            }


            {/* Abilities */}
            {(!playMode && abilities.length > 0) &&
                <div className={'fighter-card-collapse-wrap'}>
                    <WbbFighterCollapse title="Abilities">
                        {abilities.map((ability, index) => (
                            <WbbAbilityDisplay key={index} ability={ability}/>
                        ))}
                    </WbbFighterCollapse>
                </div>
            }


            {/* Play Mode Content */}
            {(playMode) &&
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

export default WbbFighterDetailView;
