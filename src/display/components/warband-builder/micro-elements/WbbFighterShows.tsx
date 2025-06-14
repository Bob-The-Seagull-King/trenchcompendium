import React, {useState} from 'react';
import {useWarband} from "../../../../context/WarbandContext";
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import WbbModalAddFighterElite from '../modals/WbbModalAddFighterElite';
import WbbModalAddFighterMercenary from '../modals/WbbModalAddFighterMercenary';
import WbbModalAddFighterTroop from '../modals/WbbModalAddFighterTroop';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WbbEditViewFighter from '../WbbEditViewFighter';


type DetailType = 'fighter' | 'stash' | 'warband' | 'campaign' | null;

interface WbbFighterShow {
    playMode : boolean,
    openDetail: (type: DetailType, payload?: any) => void,
    detailType : DetailType,
    detailPayload : any,
    setShowAddFighterEliteModal:(type : boolean) => void,
    setShowAddFighterTroopModal:(type : boolean) => void,
    setShowAddFighterMercenaryModal:(type : boolean) => void
}

const WbbFighterShows : React.FC<WbbFighterShow> = ({ playMode, openDetail, detailType, detailPayload, setShowAddFighterEliteModal, setShowAddFighterTroopModal, setShowAddFighterMercenaryModal }) => {

    const { warband, updateKey } = useWarband();

    return (
        <div key = {updateKey}>
            {warband &&
            <>
                {/* Warband Elites */}
                <h3 className={'category-headline'}>Elites</h3>
                {warband.warband_data.GetFighters().map((item, index) => (
                    <>
                        {item.model.IsElite() &&
                            <WbbEditViewFighter
                                item={item} index={index}
                                onClick={() => openDetail('fighter', item)}
                                isActive={detailType === 'fighter' && warband.warband_data.Models.indexOf(detailPayload.purchase) === warband.warband_data.Models.indexOf(item.purchase)}
                            />
                        }
                    </>
                ))}

                {!playMode &&
                    <div className={'btn btn-add-element btn-block'}
                            onClick={() => setShowAddFighterEliteModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Elite'}
                    </div>
                }


                {/* Warband Troops */}
                <h3 className={'category-headline'}>Troops</h3>
                {warband.warband_data.GetFighters().map((item, index) => (
                    <>
                        {(!item.model.IsElite() && (!item.model.IsMercenary())) &&
                            <WbbEditViewFighter
                                item={item} index={index}
                                onClick={() => openDetail('fighter', item)}
                                isActive={detailType === 'fighter' && warband.warband_data.Models.indexOf(detailPayload.purchase) === warband.warband_data.Models.indexOf(item.purchase)}
                            />
                        }
                    </>
                ))}

                {!playMode &&
                    <div className={'btn btn-add-element btn-block'}
                            onClick={() => setShowAddFighterTroopModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Troop'}
                    </div>
                }


                {(!playMode || warband.warband_data.HasMercenaries()) &&
                    <>
                        {/* Warband Mercenaries */}
                        <h3 className={'category-headline'}>Mercenaries</h3>
                        {warband.warband_data.GetFighters().map((item, index) => (
                            <>
                                {item.model.IsMercenary() &&
                                    <WbbEditViewFighter
                                        item={item} index={index}
                                        onClick={() => openDetail('fighter', item)}
                                        isActive={detailType === 'fighter' && warband.warband_data.Models.indexOf(detailPayload.purchase) === warband.warband_data.Models.indexOf(item.purchase)}
                                    />
                                }
                            </>
                        ))}
                    </>
                }


                {!playMode &&
                    <div className={'btn btn-add-element btn-block'}
                            onClick={() => setShowAddFighterMercenaryModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Mercenary'}
                    </div>
                }
                </>
            }
        </div>
    )
};

export default WbbFighterShows;