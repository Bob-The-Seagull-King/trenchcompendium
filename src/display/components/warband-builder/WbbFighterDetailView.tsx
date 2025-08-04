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
import {
    getModelStatArmour,
    getModelStatMelee,
    getModelStatMove,
    getModelStatRanged,
    ModelStatistics
} from '../../../classes/feature/model/ModelStats';
import WbbEditFighterStatOption from './modals/fighter/WbbFighterStatOption';
import {useWbbMode} from "../../../context/WbbModeContext";
import WbbDetailViewCollapse from './WbbDetailViewCollapse';
import WbbTextarea from './WbbTextarea';


interface WbbFighterDetailViewProps {
    warbandmember: RealWarbandPurchaseModel;
    onClose: () => void;
}

const WbbFighterDetailView: React.FC<WbbFighterDetailViewProps> = ({ warbandmember, onClose }) => {

    const {warband, updateKey, reloadDisplay } = useWarband();

    const fighter = warbandmember.model;
    
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
        modelslug: fighter.GetModelSlug() as string,
        keyvar: 0
        });

    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    useEffect(() => {
        async function SetModelOptions() {
            
            const abilitiesnew = await fighter.BuildNewProperties()
            const upgradesnew = await fighter.GetWarbandUpgradeCollections()
            const XPLimitNew = await fighter.GetXPLimit();
            const keywordsnew = await fighter.getContextuallyAvailableKeywords()
            const modelslugnew = fighter.GetModelSlug()
            const allEquip = await fighter.GetAllEquipForShow()
            const statchoicenew = await fighter.GetStatOptions()
            const canchangenew = await fighter.CanChangeRank()
            const statsnew = await fighter.GetStats()
            const scarlimitnew = await fighter.GetMaxScars()

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

        if (!warband?.warband_data.Models.includes(warbandmember.purchase)) {
            onClose();
        } else {
            SetModelOptions();
        }
    }, [updateKey, fighter, mode])


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
                    { fighter.GetFighterName() != fighter.GetModelName() &&
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

                {edit_mode &&
                    <WbbContextualPopover
                        id={`fighter-detail-`+fighter.ID} 
                        type="fighter"
                        item={warbandmember}
                    />
                }
            </div>

            <div className={'fighter-card-main-area'}>
                {fighter.GetModelSlug() != '' &&
                    <div className={'fighter-image-wrap full'}>
                        <SynodModelImage
                            modelSlug={complexstate.modelslug}
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
                            {fighter.GetFighterName() == fighter.GetModelName()?  "-" : fighter.GetFighterName()}
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
                            {'Keywords: '}
                        </span>                        
                        <span className="fighter-meta-value">
                            {complexstate.keywordsList.map((item, index) => (
                                <span
                                    key={`model_keyword_${fighter.ID}_keyword_id_${item.ID}`}
                                >
                                    <GenericHover
                                        titlename={item.Name}
                                        d_name={item.Name}
                                        d_type={""}
                                        d_method={() => <KeywordDisplay data={item} />}
                                    />
                                    {index < complexstate.keywordsList.length - 1 && ", "}
                                </span>
                            ))}
                        </span>
                    </div>

                    {edit_mode &&
                        <div className="fighter-meta-entry-simple">
                            <span className="fighter-meta-label">
                                {'Base: '}
                            </span>
                            <span className="fighter-meta-value">
                                {complexstate.stats.base? complexstate.stats.base.join('x') + "mm" : "-"}
                            </span>
                        </div>
                    }

                </div>

                <div  className={'fighter-card-stats'}>
                    <ItemStat
                        title={"Movement"}
                        value={getModelStatMove(complexstate.stats)}
                        base={fighter.CurModel.Stats.movement}
                        raw={complexstate.stats.movement}
                    />
                    {complexstate.stats.melee != undefined &&
                        <ItemStat
                            title={"Melee"}
                            value={getModelStatMelee(complexstate.stats)}
                            base={fighter.CurModel.Stats.melee}
                            raw={complexstate.stats.melee}
                        />
                    }
                    {complexstate.stats.ranged != undefined &&
                        <ItemStat
                            title={"Ranged"}
                            value={getModelStatRanged(complexstate.stats)}
                            base={fighter.CurModel.Stats.ranged}
                            raw={complexstate.stats.ranged}
                        />
                    }
                    <ItemStat
                        title={"Armour"}
                        value={getModelStatArmour(complexstate.stats)}
                        base={(fighter.CurModel.Stats.armour != undefined || fighter.CurModel.Stats.armour != null)? fighter.CurModel.Stats.armour : 0}
                        raw={complexstate.stats.armour?  complexstate.stats.armour * -1 : 0}
                    />
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
            {(edit_mode && complexstate.statchoices.length > 0) &&
                <div className={'fighter-card-collapse-wrap'}>
                    <WbbFighterCollapse title="Profile Options" initiallyOpen={true} key={updateKey}>
                        <>
                            {complexstate.statchoices.map((item) => 
                                
                                    <WbbEditFighterStatOption
                                        fighter={warbandmember}
                                        options={item}
                                        key={complexstate.statchoices.indexOf(item)}
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
            {Object.keys(complexstate.upgrades).length > 0 &&
                <>
                    {Object.keys(complexstate.upgrades).filter((item) => (
                        (edit_mode) || (complexstate.upgrades[item].upgrades.filter((subitem : MemberUpgradePresentation) => subitem.purchase != null).length > 0)
                    )).map((item, index) => (
                        <div className={'fighter-card-collapse-wrap'} key={index}>
                            <WbbFighterCollapse
                                title={makestringpresentable(item)}
                                initiallyOpen={false}
                            >
                                <>
                                    {item != "upgrades" &&
                                        <p>
                                            {fighter.GetFighterName() + " can choose up to " + complexstate.upgrades[item].limit.toString() + " " + makestringpresentable(item) + "."}
                                        </p>
                                    }
                                    
                                    <div key={complexstate.keyvar}>
                                        {complexstate.upgrades[item].upgrades.filter((item) => ((edit_mode) || item.purchase != null)).map((subitem, index) => (
                                            <WbbOptionItem key={index.toString() + updateKey.toString()} option={subitem} owner={fighter} category={item}/>
                                        ))}
                                    </div>
                                </>
                            </WbbFighterCollapse>
                        </div>
                    ))}
                </>
            }

            {/* Edit Loadout */}
            {(!play_mode) &&
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
                        <div>
                            {complexstate.allmodelequip.filter((item) =>
                                ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                            ).length > 0 ? (
                                <>
                                    {complexstate.allmodelequip.filter((item) =>
                                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                                        ).map((equip) =>
                                            (
                                                <WbbEquipmentListItem
                                                    key={complexstate.allmodelequip.indexOf(equip)}
                                                    item={equip.purchase}
                                                    fighter={warbandmember}
                                                />

                                    ))}
                                </>
                            ) : (
                                <div className={'fighter-items-empty'}>No ranged weapons equipped</div>
                            )}
                        </div>

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowAddRangedWeapon(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Ranged Weapon'}
                            </div>
                        }

                        {/* Melee Weapons */}
                        <h3>{'Melee Weapons'}</h3>
                        <div>
                            {complexstate.allmodelequip.filter((item) =>
                                ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                            ).length > 0 ? (
                                <>
                                    {complexstate.allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={complexstate.allmodelequip.indexOf(equip).toString() + "_" + equip.equipment.ID}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                        ))}
                                </>
                            ) : (
                                <div className={'fighter-items-empty'}>No melee weapons equipped</div>
                            )}
                        </div>

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowMeleeWeaponModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Melee Weapon'}
                            </div>
                        }
                        

                        {/* Armour */}
                        <h3>{'Armour'}</h3>

                        <div>
                            {complexstate.allmodelequip.filter((item) =>
                                ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                            ).length ? (
                                <>
                                    {complexstate.allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={complexstate.allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                        ))}
                                </>
                            ) : (
                                <div className={'fighter-items-empty'}>No armour equipped</div>
                            )}
                        </div>

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowAddArmourModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Armour'}
                            </div>
                        }

                        {/* Equipment */}
                        <h3>{'Equipment'}</h3>
                        <div>
                            {complexstate.allmodelequip.filter((item) =>
                                ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                            ).length > 0 ? (
                                <>
                                    {complexstate.allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={complexstate.allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                        ))}
                                </>
                            ) : (
                                <div className={'fighter-items-empty'}>No equipment selected</div>
                            )}
                        </div>

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowAddEquipmentModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Equipment'}
                            </div>
                        }

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

            {/* Notes textarea */}
            <WbbDetailViewCollapse title="Notes & Lore" initiallyOpen={false} key={complexstate.keyvar}>
                <WbbTextarea
                    initialText={warbandmember.model.GetWarbandNotes()}
                    title={warbandmember.model.GetTrueName() + " Notes"}
                    onSave={(newText : string) => {
                        warbandmember.model.SaveNote(newText, 'notes')
                        
            
                        const Manager : ToolsController = ToolsController.getInstance();
                        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                            () => reloadDisplay())
                    }}
                />

                {/* Lore  textarea */}
                <WbbTextarea
                    initialText={warbandmember.model.GetLore()}
                    title={warbandmember.model.GetTrueName() + " Lore"}
                    onSave={(newText : string) => {
                        warbandmember.model.SaveNote(newText, 'lore')
                        
            
                        const Manager : ToolsController = ToolsController.getInstance();
                        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                            () => reloadDisplay())
                    }}
                />
            </WbbDetailViewCollapse>

            {/* Edit Campaign Play */}
            { !play_mode &&
                <div className={'fighter-card-collapse-wrap'}>
                    <WbbFighterCollapse title="Campaign Play">

                        {/* Experience */}
                        {fighter.IsElite() &&
                            <div className={'experience'}>
                                <h3>{'Experience'}</h3>

                                {edit_mode &&
                                    <div className={'btn btn-primary btn-sm edit-xp-btn'}
                                         onClick={() => setShowXPModal(true)}>
                                        <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                                        {'Edit'}
                                    </div>
                                }

                                <div className={'xp-boxes'}
                                     onClick={edit_mode ? () => setShowXPModal(true) : undefined}
                                >
                                    {Array.from({length: complexstate.xpLimit}, (_, i) => {
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

                                <h3>{'Battle Scars'}</h3>

                                {(fighter.IsElite() && edit_mode) &&
                                    <div className={'btn btn-primary btn-sm edit-battle-scar-btn'}
                                        onClick={() => setShowEditScars(true)}>
                                        <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                                        {'Edit'}
                                    </div>
                                }

                                <div className="battle-scar-boxes"
                                     onClick={edit_mode ? () => setShowEditScars(true) : undefined}
                                >
                                    {Array.from({length: complexstate.scarLimit}, (_, i) => {
                                        const index = i + 1;
                                        const isChecked = index <= fighter.GetBattleScars();
                                        const isSkull = index === complexstate.scarLimit;

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
                                { fighter.GetSkillsList().length > 0 ? (
                                    <>
                                        {fighter.GetSkillsList().map((advancement) => (
                                            <WbbEditViewAdvancement advancement={advancement} key={advancement.ID + fighter.ID}
                                                                    fighter={warbandmember}/>
                                        ))}
                                    </>
                                ):(
                                    <>
                                        {view_mode &&
                                            <>
                                                {'No advancements'}
                                            </>
                                        }
                                    </>
                                )}


                                {(fighter.IsElite() && edit_mode) &&
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

                                {fighter.GetInjuriesList().length > 0 ? (
                                    <>
                                        {fighter.GetInjuriesList().map((injury) => (
                                            <WbbEditViewInjury injury={injury} key={injury.ID  + fighter.ID}
                                                               fighter={warbandmember}/>
                                        ))}
                                    </>
                                ):(
                                    <>
                                        {view_mode &&
                                            <>
                                                {'No Injuries'}
                                            </>
                                        }
                                    </>
                                )}

                                {(fighter.IsElite() && edit_mode) &&
                                    <div className={'btn btn-add-element btn-block'}
                                        onClick={() => setShowInjuryModal(true)}>
                                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                        {'Add Injury'}
                                    </div>
                                }
                            </>
                        }
                        
                        {/* Fighert Status */}
                        <h3>{'Fighter Status'}</h3>
                        <div className={'fighter-status'}>
                            <div className={'fighter-status-string'}>
                                {makestringpresentable(fighter.State)}
                            </div>

                            {edit_mode &&
                                <div className={'btn btn-primary'} onClick={() => setShowStatusModal(true)}>
                                    <FontAwesomeIcon icon={faPen} className={'icon-inline-left-l'}/>
                                    {'Change'}
                                </div>
                            }
                        </div>

                        {!fighter.IsMercenary() &&
                            <>
                                <h3>{'Fighter Rank'}</h3>
                                <div className={'fighter-status'}>
                                    <div className={'fighter-status-string'}>
                                        {fighter.IsElite()? "Elite" : "Troop"}

                                        {(complexstate.stats.potential != undefined && complexstate.stats.potential == 1) &&
                                            <small>
                                                <br/>
                                                {'limited potential'}
                                            </small>
                                        }
                                    </div>
                                    {(complexstate.canchange && edit_mode ) &&
                                        <div className={'btn btn-primary'} onClick={() => handleRankUpdate()}>
                                            <FontAwesomeIcon icon={fighter.IsElite()? faChevronDown : faChevronUp} className={'icon-inline-left-l'}/>
                                            {fighter.IsElite()? "Demote" : "Promote"}
                                        </div>
                                    }

                                    {!complexstate.canchange && (
                                        <small>
                                            {'Cannot be promoted'}
                                        </small>
                                    )}
                                </div>
                            </>
                        }

                        {/* Campaign Modals */}
                        {showXPModal &&
                        <WbbEditFighterExperience
                            show={showXPModal}
                            onClose={() => setShowXPModal(false)}
                            fighter={fighter}
                            maxXP={complexstate.xpLimit}
                            onSubmit={handleXPSubmit}
                        />}
                        {showEditScars &&
                        <WbbEditBattleScars
                            show={showEditScars}
                            onClose={() => setShowEditScars(false)}
                            fighter={fighter}
                            maxScars={complexstate.scarLimit}
                            onSubmit={handleUpdateBattleScars}
                        />}
                        {showAdvancementModal &&
                        <WbbModalAddAdvancement
                            show={showAdvancementModal}
                            onClose={() => setShowAdvancementModal(false)}
                            onSubmit={handleAddAdvancement}
                            fighter={warbandmember}
                        />}
                        {showInjuryModal &&
                        <WbbModalAddInjury
                            show={showInjuryModal}
                            onClose={() => setShowInjuryModal(false)}
                            onSubmit={handleAddInjury}
                            fighter={warbandmember}
                        />}
                        {showStatusModal &&
                        <WbbModalEditFighterStatus
                            show={showStatusModal}
                            onClose={() => setShowStatusModal(false)}
                            currentStatus={fighter.State} 
                            onSubmit={handleStatusUpdate}
                        />}
                    </WbbFighterCollapse>
                </div>
            }


            {/* Abilities */}
            {(!play_mode && complexstate.abilities.length > 0) &&
                <div className={'fighter-card-collapse-wrap'}>
                    <WbbFighterCollapse title="Abilities">
                        <div key={complexstate.keyvar}>
                            {complexstate.abilities.map((ability, index) => (
                                <WbbAbilityDisplay key={index} ability={ability}/>
                            ))}
                        </div>
                    </WbbFighterCollapse>
                </div>
            }


            {/* Play Mode Content */}
            {(play_mode) &&
                <div className={'fighter-card-play-mode-info'}  key={complexstate.keyvar}>

                    <div className={'play-mode-equipment-wrap'}>
                        {complexstate.allmodelequip.filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                        ).length > 0 && (
                            <>
                                <h3>{'Ranged Weapons'}</h3>
                                {complexstate.allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={complexstate.allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        )
                        }
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        {complexstate.allmodelequip.filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                        ).length > 0 && (
                            <>
                                <h3>{'Melee Weapons'}</h3>
                                {complexstate.allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={complexstate.allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        )
                        }
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        
                        {complexstate.allmodelequip.filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                        ).length > 0 && (
                            <>
                                <h3>{'Armour'}</h3>
                                {complexstate.allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={complexstate.allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        )
                        }
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        {complexstate.allmodelequip.filter((item) =>
                            ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                        ).length > 0 && (
                            <>
                                <h3>{'Equipment'}</h3>
                                {complexstate.allmodelequip.filter((item) =>
                                        ((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                                    ).map((equip) =>
                                        (
                                            <WbbEquipmentListItem
                                                key={complexstate.allmodelequip.indexOf(equip)}
                                                item={equip.purchase}
                                                fighter={warbandmember}
                                            />
                                ))}
                            </>
                        )
                        }
                    </div>

                    {complexstate.abilities.length > 0 &&
                    <div className={'play-mode-abilities-wrap'}>
                        <h3>{'Abilities'}</h3>
                        {complexstate.abilities.map((ability, index) => (
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
