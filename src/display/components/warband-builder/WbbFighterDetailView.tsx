import React, {useState} from 'react';
import WbbEditViewFighter from "./WbbEditViewFighter";
import {faChevronLeft, faCopy, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ItemStat from "../subcomponents/description/ItemStat";
import WbbEquipmentListItem from "./WbbEquipmentListItem";
import WbbFighterCollapse from "./WbbFighterCollapse";


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
            PriceDucats: 5,
            PriceGlory: 0,
        },
        {
            Name: 'Upgrade 2',
            Id: 'lorem_id2',
            PriceDucats: 10,
            PriceGlory: 0,
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
                <WbbFighterCollapse title="Equipment">
                    <p> {/* Equipment Rules */}
                        <strong>Equipment: </strong>
                        {'The Alchemist can be equipped with any weapon, armour and equipment from the Iron Sultanate Armoury'}
                    </p>

                    {/* Bool Options */}
                    {BoolOptions.length > 0 &&
                        <>
                            <h3>{'Options'}</h3>
                            {BoolOptions.map((item) => (
                                <div className="form-check" key={item.Id}>
                                    <input className="form-check-input" type="checkbox" value={item.Id} id={item.Id}/>
                                    <label className="form-check-label" htmlFor={item.Id}>
                                        {item.Name}
                                        {item.PriceDucats > 0 &&
                                            <>
                                                {' (' + item.PriceDucats + ' Ducats)'}
                                            </>
                                        }
                                        {item.PriceGlory > 0 &&
                                            <>
                                                {' (' + item.PriceGlory + ' Glory Points)'}
                                            </>
                                        }
                                    </label>
                                </div>
                            ))}
                        </>
                    }


                    {/* Ranged Weapons */}
                    <h3>{'Ranged Weapons'}</h3>
                    {/* @TODO: For each Item */}
                    <WbbEquipmentListItem
                        item={item_siege_jezzail}
                    />
                    <div className={'btn btn-add-element btn-block'}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Ranged Weapon'}
                    </div>

                    {/* Melee Weapons */}
                    <h3>{'Melee Weapons'}</h3>
                    {/* @TODO: For each Item */}
                    <WbbEquipmentListItem
                        item={item_trench_knife}
                    />
                    <div className={'btn btn-add-element btn-block'}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Melee Weapon'}
                    </div>

                    {/* Equipment */}
                    <h3>{'Equipment'}</h3>
                    {/* @TODO: For each Item */}
                    <WbbEquipmentListItem
                        item={item_alch_ammo}
                    />
                    <div className={'btn btn-add-element btn-block'}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Equipment'}
                    </div>


                </WbbFighterCollapse>
            </div>

            {/* Edit Campaign Play */}
            <div className={'fighter-card-collapse-wrap'}>
                <WbbFighterCollapse title="Campaign Play">
                    <h3>{'Experience'}</h3>

                    <h3>{'Battle Scars'}</h3>

                    <h3>{'Advancements'}</h3>

                    <h3>{'Injuries'}</h3>

                    <h3>{'Fighter Status'}</h3>


                </WbbFighterCollapse>

            </div>
            {/* Profile Summary */}
            <div className={'fighter-card-collapse-wrap'}>
            </div>

        </div>
    );
};

export default WbbFighterDetailView;
