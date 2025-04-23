import React, {useState} from 'react';
import WbbEditViewFighter from "./WbbEditViewFighter";
import {faCheck, faChevronLeft, faCopy, faPen, faPlus, faSkull, faTimes} from "@fortawesome/free-solid-svg-icons";
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


interface WbbFighterDetailViewProps {
    fighter: any;
    onClose: () => void;
}

const WbbFighterDetailView: React.FC<WbbFighterDetailViewProps> = ({ fighter, onClose }) => {

    // Test Data
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
    ]
    const item_siege_jezzail = {
        Name: 'Siege Jezzail',
        CostDucats: 30,
        CostGlory: 0,
        ModifiersString: 'Two handed, Heavy, +1D to Injuries',
        Id: 'eq_siege_jezzail',
    }
    const item_trench_knife = {
        Name: 'Trench Knife',
        CostDucats: 3,
        CostGlory: 0,
        ModifiersString: 'One handed, -1D to Hit',
        Id: 'eq_trench_knife',
    }
    const item_alch_ammo = {
        Name: 'Alchemical Ammunition',
        CostDucats: 3,
        CostGlory: 0,
        ModifiersString: '+1D to ranged attack Rolls',
        Id: 'eq_alch_ammo',
    }
    const boldXpIndices = [2, 4, 7, 10, 14, 18];

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

    // end Test Data

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
        <div className="WbbFighterDetailView fighter-card">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'fighter-name'}>
                    {fighter.ModelName + ' - ' + fighter.FighterName}
                </div>

                <div className={'fighter-cost'}>
                    { fighter.FighterTotalCostDucats > 0 &&
                        <>
                            {fighter.FighterTotalCostDucats + " D"}
                        </>
                    }
                    { fighter.FighterTotalCostDucats > 0 && fighter.FighterTotalCostGlory > 0 &&
                        <>
                            {" / "}
                        </>
                    }
                    { fighter.FighterTotalCostGlory > 0 &&
                        <>
                            {fighter.FighterTotalCostGlory + " G"}
                        </>
                    }
                </div>
            </div>

            <div className="fighter-card-meta fighter-card-meta-above">
                <div className="fighter-meta-entry-simple">
                    <span className="fighter-meta-label">
                        {'Name: '}
                    </span>
                    <span className="fighter-meta-value">
                        {fighter.FighterName}
                    </span>
                </div>
                <div className="fighter-meta-entry-simple">
                    <span className="fighter-meta-label">
                        {'Type: '}
                    </span>
                    <span className="fighter-meta-value">
                        {fighter.ModelName}
                    </span>
                </div>
                <div className="fighter-meta-entry-simple">
                    <span className="fighter-meta-label">
                        {'Cost: '}
                    </span>
                    <span className="fighter-meta-value">
                        {fighter.FighterBaseDucats > 0 &&
                            <>
                                {fighter.FighterBaseDucats + " Ducats"}
                            </>
                        }
                        {fighter.FighterBaseGlory > 0 &&
                            <>
                                {fighter.FighterBaseGlory + " Glory Points"}
                            </>
                        }
                    </span>
                </div>

                <div className="fighter-meta-entry-simple">
                    <span className="fighter-meta-label">
                        {'Availability: '}
                    </span>
                    <span className="fighter-meta-value">
                        {'0-1'}
                    </span>
                </div>

                <div className="fighter-meta-entry-simple">
                    <span className="fighter-meta-label">
                        {'Kewords: '}
                    </span>
                    <span className="fighter-meta-value">
                        {'SULTANATE, ELITE'}
                    </span>
                </div>
                <div className="fighter-meta-entry-simple">
                    <span className="fighter-meta-label">
                         {'Base: '}
                    </span>
                    <span className="fighter-meta-value">
                        {'32mm'}
                    </span>
                </div>
            </div>

            <div className={'fighter-card-stats'}>
                <ItemStat title={"Movement"} value={'6" / Infantry'}/>
                <ItemStat title={"Melee"} value={'+1'}/>
                <ItemStat title={"Ranged"} value={'+2'}/>
                <ItemStat title={"Armor"} value={'0'}/>
            </div>

            {/* Edit Loadout */}
            <div className={'fighter-card-collapse-wrap'}>
                <WbbFighterCollapse title="Equipment" initiallyOpen={true}>
                    <p> {/* Equipment Rules */}
                        <strong>Equipment: </strong>
                        {'The Alchemist can be equipped with any weapon, armour and equipment from the Iron Sultanate Armoury'}
                    </p>

                    {/* Bool Options */}
                    {BoolOptions.length > 0 &&
                        <>
                            <h3>{'Options'}</h3>
                            {BoolOptions.map((option, index) => (
                                <WbbOptionItem key={index} option={option} />
                                // <div className="form-check" key={item.Id}>
                                //     <input className="form-check-input" type="checkbox" value={item.Id} id={item.Id}/>
                                //     <label className="form-check-label" htmlFor={item.Id}>
                                //         {item.Name}
                                //         {item.PriceDucats > 0 &&
                                //             <>
                                //                 {' (' + item.PriceDucats + ' Ducats)'}
                                //             </>
                                //         }
                                //         {item.PriceGlory > 0 &&
                                //             <>
                                //                 {' (' + item.PriceGlory + ' Glory Points)'}
                                //             </>
                                //         }
                                //     </label>
                                // </div>
                            ))}
                        </>
                    }


                    {/* Ranged Weapons */}
                    <h3>{'Ranged Weapons'}</h3>
                    {/* @TODO: For each Item */}
                    <WbbEquipmentListItem
                        item={item_siege_jezzail}
                    />
                    <div className={'btn btn-add-element btn-block'}
                         onClick={() => setShowAddRangedWeapon(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Ranged Weapon'}
                    </div>

                    {/* Melee Weapons */}
                    <h3>{'Melee Weapons'}</h3>
                    {/* @TODO: For each Item */}
                    <WbbEquipmentListItem
                        item={item_trench_knife}
                    />
                    <div className={'btn btn-add-element btn-block'}
                         onClick={() => setShowMeleeWeaponModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Melee Weapon'}
                    </div>

                    {/* Equipment */}
                    <h3>{'Equipment'}</h3>
                    {/* @TODO: For each Item */}
                    <WbbEquipmentListItem
                        item={item_alch_ammo}
                    />
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

            {/* Edit Campaign Play */}
            <div className={'fighter-card-collapse-wrap'}>
                <WbbFighterCollapse title="Campaign Play">
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
                                const isBold = boldXpIndices.includes(level);
                                const hasXP = level <= fighter.ExperiencePoints;

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

                    <div className={'battle-scars'}>

                        <h3>{'Battle Scars'}</h3>

                        <div className={'btn btn-primary btn-sm edit-battle-scar-btn'}
                             onClick={() => setShowEditScars(true)}>
                            <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                            {'Edit'}
                        </div>

                        <div className="battle-scar-boxes" onClick={() => setShowEditScars(true)}>
                            {Array.from({length: 3}, (_, i) => {
                                const index = i + 1;
                                const isChecked = index <= fighter.BattleScars;
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
                        currentXP={fighter.ExperiencePoints} // @TODO: use actual XP value
                        // currentXP={selectedFighter.ExperiencePoints}
                        onSubmit={handleXPSubmit}
                    />
                    <WbbEditBattleScars
                        show={showEditScars}
                        onClose={() => setShowEditScars(false)}
                        currentScars={fighter.BattleScars} // @TODO: use actual XP value
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
                    <WbbEditFighterStatus
                        show={showStatusModal}
                        onClose={() => setShowStatusModal(false)}
                        currentStatus={'Active'} // @TODO: use actual value
                        onSubmit={handleStatusUpdate}
                    />
                </WbbFighterCollapse>

            </div>
            {/* Profile Summary */}
            <div className={'fighter-card-collapse-wrap'}>
            </div>

        </div>
    );
};

export default WbbFighterDetailView;
