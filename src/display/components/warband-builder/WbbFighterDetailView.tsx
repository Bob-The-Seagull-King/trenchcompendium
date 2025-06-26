import React, {useEffect, useState} from 'react';
import WbbEditViewFighter from "./WbbEditViewFighter";
import {
    faCheck,
    faChevronLeft,
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
import {IWarbandMember, MemberUpgradesGrouped} from "../../../classes/saveitems/Warband/Purchases/WarbandMember";
import { RealWarbandPurchaseModel } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
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


interface WbbFighterDetailViewProps {
    warbandmember: RealWarbandPurchaseModel;
    onClose: () => void;
}

const WbbFighterDetailView: React.FC<WbbFighterDetailViewProps> = ({ warbandmember, onClose }) => {

    const { updatekey } = useWarband();

    const fighter = warbandmember.model;
    
    const [statchoices, setstats] = useState({})
    const [upgrades, setupgrades] = useState<MemberUpgradesGrouped>({})
    const [abilities, setabilities] = useState<WarbandProperty[]>([])
    const [keywordsList, setkeywords] = useState<Keyword[]>([])
    const [BaseString, setBaseString] = useState('')

    
    useEffect(() => {
        async function SetModelOptions() {
            const abilities = await fighter.BuildNewProperties()
            const upgrades = await fighter.GetWarbandUpgradeCollections()
            setabilities(abilities);
            setupgrades(upgrades);
            setkeywords(await fighter.getContextuallyAvailableKeywords())
        }

        SetModelOptions();
    }, [fighter]);

    const { playMode } = usePlayMode();

    /**
     * Equipment Modals
     */
    // Ranged Weapons
    const [showAddRangedWeapon, setShowAddRangedWeapon] = useState(false);
    const handleAddRangedWeapon = (weapon: { id: string; name: string }) => {
        // @TODO: Implement logic to add weapon to fighter's equipment
        console.log('Ranged weapon added:', weapon);
    };

    // Melee Weapons
    const [showMeleeWeaponModal, setShowMeleeWeaponModal] = useState(false);

    const handleAddMeleeWeapon = (weapon: { id: string, name: string }) => {
        console.log("Selected melee weapon:", weapon);
        // TODO: Add this weapon to the appropriate fighter or list
    };

    // Equipment
    const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
    const handleAddEquipment = (equipment: any) => {
        // TODO: Attach equipment to fighter, or pass to backend
        console.log('Equipment added:', equipment);
    };

    // Armour
    const [showAddArmourModal, setShowAddArmourModal] = useState(false);
    const handleAddArmour = (equipment: any) => {
        // TODO: Attach equipment to fighter, or pass to backend
        console.log('Equipment added:', equipment);
    };

    /**
     * Campaign Modals
     */

    // Experience
    const [showXPModal, setShowXPModal] = useState(false);
    const handleXPSubmit = (newXP: number) => {
        // if (!selectedFighter) return;
        // @TODO: hook up to class
    };

    // Battle Scars
    const [showEditScars, setShowEditScars] = useState(false);
    const handleUpdateBattleScars = (newScars: number) => {
        // @TODO: hook up to class

        // if (fighter) {
        //     fighter.BattleScars = newScars;
        // }
    };

    // Advancements
    const [showAdvancementModal, setShowAdvancementModal] = useState(false);
    const handleAddAdvancement = (advancement: any) => {
        // if (!selectedFighter) return;

        // @TODO: hook up to class

        // selectedFighter.AddAdvancement(advancement);
    };

    const [showInjuryModal, setShowInjuryModal] = useState(false);
    const handleAddInjury = (injury: any) => {
        // if (!selectedFighter) return;
        // @TODO: hook up to class

        // selectedFighter.AddInjury(injury);
    };

    // Fighter status
    const [showStatusModal, setShowStatusModal] = useState(false);
    const handleStatusUpdate = (newStatus: string) => {
        // @TODO: hook up to class
    };

    return (

        <div key={updateKey} className={`WbbDetailView WbbFighterDetailView fighter-card ${playMode ? 'play-mode' : ''}`}>
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
                    { fighter.GetTotalCostDucats() > 0 &&
                        <>
                            {fighter.GetTotalCostDucats() + " D"}
                        </>
                    }
                    { fighter.GetTotalCostDucats() > 0 && fighter.GetTotalCostGlory() > 0 &&
                        <>
                            {" / "}
                        </>
                    }
                    { fighter.GetTotalCostGlory() > 0 &&
                        <>
                            {fighter.GetTotalCostGlory() + " G"}
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
                            modelSlug={fighter.GetModelSlug()}
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
                                {'Cost: '}
                            </span>
                            <span className="fighter-meta-value">
                                {fighter.GetBaseCostDucats() > 0 &&
                                    <>
                                        {fighter.GetBaseCostDucats() + " Ducats"}
                                    </>
                                }
                                {fighter.GetBaseCostGlory() > 0 &&
                                    <>
                                        {fighter.GetBaseCostGlory() + " Glory Points"}
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
                        <div className="fighter-meta-entry-simple">
                            <span className="fighter-meta-label">
                                {'Base: '}
                            </span>
                            <span className="fighter-meta-value">
                                {'32mm'}
                            </span>
                        </div>
                    }

                </div>

                <div className={'fighter-card-stats'}>
                    <ItemStat title={"Movement"} value={'6" / Infantry'}/>
                    <ItemStat title={"Melee"} value={'+1'}/>
                    <ItemStat title={"Ranged"} value={'+2'}/>
                    <ItemStat title={"Armor"} value={'0'}/>
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
                    {Object.keys(upgrades).map((item, index) => (
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

                                    {upgrades[item].upgrades.map((subitem, index) => (
                                        <WbbOptionItem key={index} option={subitem} owner={fighter}/>
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
                    <WbbFighterCollapse title="Equipment" initiallyOpen={true}>
                        <p> {/* Equipment Rules */}
                            <strong>Equipment: </strong>
                            {returnDescription(fighter, fighter.CurModel.Description)}
                        </p>

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
                            onSubmit={handleAddRangedWeapon}
                            fighter={warbandmember}
                            category='ranged'
                        />
                        <WbbModalAddEquipment
                            show={showMeleeWeaponModal}
                            onClose={() => setShowMeleeWeaponModal(false)}
                            onSubmit={handleAddMeleeWeapon}
                            fighter={warbandmember}
                            category='melee'
                        />
                        <WbbModalAddEquipment
                            show={showAddArmourModal}
                            onClose={() => setShowAddArmourModal(false)}
                            onSubmit={handleAddArmour}
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
                                    {Array.from({length: 18}, (_, i) => {
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
                        {fighter.IsElite() &&
                            <div className={'battle-scars'}>

                                <h3></h3>

                                <div className={'btn btn-primary btn-sm edit-battle-scar-btn'}
                                     onClick={() => setShowEditScars(true)}>
                                    <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                                    {'Edit'}
                                </div>

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
                        {fighter.IsElite() &&
                            <>
                                <h3>{'Advancements'}</h3>
                                {fighter.GetSkillsList().map((advancement) => (
                                    <WbbEditViewAdvancement advancement={advancement} key={advancement.ID + fighter.ID}/>
                                ))}
                                <div className={'btn btn-add-element btn-block'}
                                     onClick={() => setShowAdvancementModal(true)}>
                                    <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                    {'Add Advancement'}
                                </div>

                                <h3>{'Injuries'}</h3>
                                {fighter.GetInjuriesList().map((injury) => (
                                    <WbbEditViewInjury injury={injury} key={injury.ID  + fighter.ID}/>
                                ))}

                                <div className={'btn btn-add-element btn-block'}
                                     onClick={() => setShowInjuryModal(true)}>
                                    <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                    {'Add Injury'}
                                </div>
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
                                {'Active'}
                            </div>

                            <div className={'btn btn-primary'} onClick={() => setShowStatusModal(true)}>
                                <FontAwesomeIcon icon={faPen} className={'icon-inline-left-l'}/>

                                {'Change'}
                            </div>
                        </div>

                        {/* Campaign Modals */}
                        <WbbEditFighterExperience
                            show={showXPModal}
                            onClose={() => setShowXPModal(false)}
                            currentXP={fighter.GetExperiencePoints()} // @TODO: use actual XP value
                            // currentXP={selectedFighter.ExperiencePoints}
                            onSubmit={handleXPSubmit}
                        />
                        <WbbEditBattleScars
                            show={showEditScars}
                            onClose={() => setShowEditScars(false)}
                            currentScars={fighter.GetBattleScars()} // @TODO: use actual BS value
                            onSubmit={handleUpdateBattleScars}
                        />
                        <WbbModalAddAdvancement
                            show={showAdvancementModal}
                            onClose={() => setShowAdvancementModal(false)}
                            onSubmit={handleAddAdvancement}
                        />
                        <WbbModalAddInjury
                            show={showInjuryModal}
                            onClose={() => setShowInjuryModal(false)}
                            onSubmit={handleAddInjury}
                        />
                        <WbbModalEditFighterStatus
                            show={showStatusModal}
                            onClose={() => setShowStatusModal(false)}
                            currentStatus={'Active'} // @TODO: use actual value
                            onSubmit={handleStatusUpdate}
                        />
                    </WbbFighterCollapse>
                </div>
            }


            {/* Abilities */}
            {(!playMode) &&
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
                <div className={'fighter-card-play-mode-info'}>

                    <div className={'play-mode-equipment-wrap'}>
                        {/* @TODO: add all equipment items*/}
                        <h3>{'Ranged Weapons'}</h3>
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        <h3>{'Melee Weapons'}</h3>
                        {/* @TODO: For each Item
                        <WbbEquipmentListItem
                            item={item_trench_knife}
                        /> */}
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        <h3>{'Armour'}</h3>
                    </div>

                    <div className={'play-mode-equipment-wrap'}>
                        <h3>{'Equipment'}</h3>
                    </div>

                    <div className={'play-mode-abilities-wrap'}>
                        <h3>{'Abilities'}</h3>
                        {abilities.map((ability, index) => (
                            <WbbAbilityDisplay key={index} ability={ability}/>
                        ))}
                    </div>

                    <div className={'play-mode-advancements-wrap'}>
                        <h3>{'Advancements'}</h3>
                        {fighter.GetSkillsList().map((advancement) => (
                            <WbbEditViewAdvancement advancement={advancement} key={advancement.ID + fighter.ID}/>
                        ))}
                    </div>

                    <div className={'play-mode-injuries-wrap'}>
                        <h3>{'Injuries'}</h3>
                        {fighter.GetInjuriesList().map((injury) => (
                            <WbbEditViewInjury injury={injury} key={injury.ID + fighter.ID}/>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default WbbFighterDetailView;
