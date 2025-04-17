import React, {useState} from 'react';
import WbbEditViewFighter from "./WbbEditViewFighter";
import {faChevronLeft, faCopy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ItemStat from "../subcomponents/description/ItemStat";


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
                            {fighter.FighterTotalCostDucats + " Ducats"}
                        </>
                    }
                    { fighter.FighterTotalCostGlory > 0 &&
                        <>
                            {fighter.FighterTotalCostGlory + " Glory Points"}
                        </>
                    }
                </div>
            </div>

            <div className="fighter-card-meta fighter-card-meta-above">
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
                <p> {/* Equipment Rules */}
                    <strong>Equipment: </strong>
                    {'The Alchemist can be equipped with any weapon, armour and equipment from the Iron Sultanate Armoury'}
                </p>

                {/* Bool Options */}
                {BoolOptions.length > 0 &&
                    <>
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
                {/* Melee Weapons */}
                {/* Equipment */}


            </div>
            {/* Edit Campaign Play */}
            <div className={'fighter-card-collapse-wrap'}>
            </div>
            {/* Profile Summary */}
            <div className={'fighter-card-collapse-wrap'}>
            </div>

        </div>
    );
};

export default WbbFighterDetailView;
