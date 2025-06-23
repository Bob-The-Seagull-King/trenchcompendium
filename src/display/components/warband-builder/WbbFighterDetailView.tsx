import React, {useState} from 'react';
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
import {IWarbandMember} from "../../../classes/saveitems/Warband/Purchases/WarbandMember";
import { RealWarbandPurchaseModel } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';


interface WbbFighterDetailViewProps {
    warbandmember: RealWarbandPurchaseModel;
    onClose: () => void;
}

const WbbFighterDetailView: React.FC<WbbFighterDetailViewProps> = ({ warbandmember, onClose }) => {


    const fighter = warbandmember.model;

    // Test Data ***
    const BoolOptions = [
        {
            Name: 'Skirmisher',
            Id: 'lorem_id',
            CostDucats: 5,
            CostGlory: 0,
            Description: 'Any Azebs can be converted to SKIRMISHERS at the cost of +5 ducats per model. Unless engaged in melee, when an enemy model declares a charge against any Skirmisher Azeb, they can immediately move D3” in any direction they wish (except within 1” of any enemy or out of the battlefield). After this manoeuvre, the charging model is moved as normal. This may lead to the charger being unable to enter melee. This move cannot be taken by a model that is Down.'
        },
        {
            Name: 'Upgrade 2',
            Id: 'lorem_id2',
            CostDucats: 10,
            CostGlory: 0,
            Description: 'Any Azebs can be converted to SKIRMISHERS at the cost of +5 ducats per model. Unless engaged in melee, when an enemy model declares a charge against any Skirmisher Azeb, they can immediately move D3” in any direction they wish (except within 1” of any enemy or out of the battlefield). After this manoeuvre, the charging model is moved as normal. This may lead to the charger being unable to enter melee. This move cannot be taken by a model that is Down.'
        }
    ];
    const GoeticPowers = [
        {
            Name: 'Exquisite Pain',
            Id: 'lorem_id',
            CostDucats: 15,
            CostGlory: 0,
            Description: 'As a GOETIC (1-2) Spell, this model inflicts X BLOOD MARKERS on an enemy model that it can see, where X is the amount of BLOOD MARKERS spent.'
        },
        {
            Name: 'Forbidden Pleasures',
            Id: 'lorem_id2',
            CostDucats: 10,
            CostGlory: 0,
            Description: 'Before the Battle begins, select one model in your warband without the Keyword DEMONIC. It starts the Battle with three BLOOD MARKERS.'
        },
        {
            Name: 'Call of Flesh',
            Id: 'lorem_id2',
            CostDucats: 15,
            CostGlory: 0,
            Description: 'As a GOETIC (2) Spell that ends this model’s Activation, beckoning magic fills the air. When the enemy next Activates a model during this Turn, that model must Move as its first ACTION. This Move must be a Retreat if the model started its Activation in Melee Combat with a model other than the caster of this Spell. If that model is Down, it instead Stands and then Moves. During this movement, it moves in a direct path toward the caster of this Spell through any passable terrain, including Dangerous Terrain, Jumping Down etc. The model suffers injuries as normal. It can act normally after taking the prescribed ACTION(S), or attempting to take the prescribed ACTION(S) if it couldn’t, but cannot target the caster of this Spell during this Activation with ranged or melee attacks.'
        }
    ];
    const Injuries = [
        {
            Name: 'Muscle Damage',
            Description: 'This model cannot carry HEAVY weapons',
            Table: 'Elites Injury Chart',
            Id: 'inj_muscle_damage',
            Number: 34
        },
        {
            Name: 'Insomniac',
            Description: 'This character must always be deployed as the first model on your side in any battle it takes part in. It cannot use the Keyword INFILTRATOR if it has it.',
            Table: 'Elites Injury Chart',
            Id: 'inj_insomniac',
            Number: 21
        }
    ];
    const Advancements = [
        {
            Name: 'Hunter',
            Description: 'This model ignores all penalties from Cover when making a ranged attack.',
            Table: 'Ranged Skills',
            Id: 'adv_hunter',
            Number: 3
        }
    ]
    const Abilities = [
        {
            Name: 'Skirmisher',
            Description: 'Any Azebs can be converted to SKIRMISHERS at the cost of +5 ducats per model. Unless engaged in melee, when an enemy model declares a charge against any Skirmisher Azeb, they can immediately move D3” in any direction they wish (except within 1” of any enemy or out of the battlefield). After this manoeuvre, the charging model is moved as normal. This may lead to the charger being unable to enter melee. This move cannot be taken by a model that is Down.'
        },
        {
            Name: 'Mine-setting',
            Description: 'As an ACTION with +2 DICE, the Sapper can mine a piece of terrain they alone are touching, no bigger than 8” x 8” (an 8” section of trench, a wall,\n' +
                'a tree, a building etc). If successful, the terrain piece is now mined. Any model (except the Sapper who set the mine) who moves into contact with the terrain piece will trigger the mine. Roll on the Injury Chart to see what happens to the model. The mine has the Keyword SHRAPNEL. After this, the terrain piece is no longer mined.',
        }
    ]
    // end Test Data ***

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

                    {!playMode &&
                        <div className="fighter-meta-entry-simple">
                            <span className="fighter-meta-label">
                                {'Availability: '}
                            </span>
                            <span className="fighter-meta-value">
                                {'0-1'}
                            </span>
                        </div>
                    }
                    <div className="fighter-meta-entry-simple">
                        <span className="fighter-meta-label">
                            {'Kewords: '}
                        </span>
                        <span className="fighter-meta-value">
                            {'SULTANATE, ELITE'}
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


            {/* Edit Loadout */}
            {(!playMode) &&
                <div className={'fighter-card-collapse-wrap'}>
                    <WbbFighterCollapse title="Equipment" initiallyOpen={true}>
                        <p> {/* Equipment Rules */}
                            <strong>Equipment: </strong>
                            {'The Alchemist can be equipped with any weapon, armour and equipment from the Iron Sultanate Armoury'}
                        </p>

                        {/* Bool Upgrades */}
                        {BoolOptions.length > 0 &&
                            <>
                                <h3>{'Upgrades'}</h3>
                                {BoolOptions.map((option, index) => (
                                    <WbbOptionItem key={index} option={option}/>
                                ))}
                            </>
                        }

                        {/* Goetic Powers */}
                        {GoeticPowers.length > 0 &&
                            <>
                                <h3>{'Goetic Powers'}</h3>
                                {GoeticPowers.map((option, index) => (
                                    <WbbOptionItem key={index} option={option}/>
                                ))}
                            </>
                        }

                        {/* Ranged Weapons */}
                        <h3>{'Ranged Weapons'}</h3>
                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddRangedWeapon(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Ranged Weapon'}
                        </div>

                        {/* Melee Weapons */}
                        <h3>{'Melee Weapons'}</h3>
                        {/* @TODO: For each Item 
                        <WbbEquipmentListItem
                            item={item_trench_knife}
                        />*/}
                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowMeleeWeaponModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Melee Weapon'}
                        </div>

                        {/* Equipment */}
                        <h3>{'Equipment'}</h3>
                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddEquipmentModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Equipment'}
                        </div>

                        {/* Equipment Modals */}
                        <WbbModalAddRangedWeapon
                            show={showAddRangedWeapon}
                            onClose={() => setShowAddRangedWeapon(false)}
                            onSubmit={handleAddRangedWeapon}
                        />
                        <WbbModalAddMeleeWeapon
                            show={showMeleeWeaponModal}
                            onClose={() => setShowMeleeWeaponModal(false)}
                            onSubmit={handleAddMeleeWeapon}
                        />
                        <WbbModalAddEquipment
                            show={showAddEquipmentModal}
                            onClose={() => setShowAddEquipmentModal(false)}
                            onSubmit={handleAddEquipment}
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
                                {Advancements.map((advancement) => (
                                    <WbbEditViewAdvancement advancement={advancement} key={advancement.Id}/>
                                ))}
                                <div className={'btn btn-add-element btn-block'}
                                     onClick={() => setShowAdvancementModal(true)}>
                                    <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                    {'Add Advancement'}
                                </div>

                                <h3>{'Injuries'}</h3>
                                {Injuries.map((injury) => (
                                    <WbbEditViewInjury injury={injury} key={injury.Id}/>
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
                        {Abilities.map((ability, index) => (
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
                        <h3>{'Equipment'}</h3>
                    </div>

                    <div className={'play-mode-goetic-powers-wrap'}>
                        {GoeticPowers.length > 0 &&
                            <>
                                <h3>{'Goetic Powers'}</h3>
                                {GoeticPowers.map((option, index) => (
                                    <WbbOptionItem key={index} option={option}/>
                                ))}
                            </>
                        }
                    </div>

                    <div className={'play-mode-abilities-wrap'}>
                        <h3>{'Abilities'}</h3>
                        {Abilities.map((ability, index) => (
                            <WbbAbilityDisplay key={index} ability={ability}/>
                        ))}
                    </div>

                    {/*
                        @TODO: add upgrades as well as WbbAbilityDisplay
                    */}

                    <div className={'play-mode-advancements-wrap'}>
                        <h3>{'Advancements'}</h3>
                        {Advancements.map((advancement) => (
                            <WbbEditViewAdvancement advancement={advancement} key={advancement.Id}/>
                        ))}
                    </div>

                    <div className={'play-mode-injuries-wrap'}>
                        <h3>{'Injuries'}</h3>
                        {Injuries.map((injury) => (
                            <WbbEditViewInjury injury={injury} key={injury.Id}/>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default WbbFighterDetailView;
