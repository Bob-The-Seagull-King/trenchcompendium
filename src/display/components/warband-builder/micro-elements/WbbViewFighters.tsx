import React, {useEffect, useState} from 'react';
import {useWarband} from "../../../../context/WarbandContext";
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import WbbModalAddFighterElite from '../modals/WbbModalAddFighterElite';
import WbbModalAddFighterMercenary from '../modals/WbbModalAddFighterMercenary';
import WbbModalAddFighterTroop from '../modals/WbbModalAddFighterTroop';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WbbEditViewFighter from '../WbbEditViewFighter';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import WbbEditViewFighterSortable from "../modals/WbbEditViewFighterSortable";
import { WarbandMember } from '../../../../classes/saveitems/Warband/Purchases/WarbandMember';
import { ToolsController } from '../../../../classes/_high_level_controllers/ToolsController';


type DetailType = 'fighter' | 'stash' | 'warband' | 'campaign' | null;

interface WbbFighterShow {
    playMode : boolean,
    openDetail: (type: DetailType, payload?: any) => void,
    detailType : DetailType,
    detailPayload : any
}

const WbbViewFighters : React.FC<WbbFighterShow> = ({ playMode, openDetail, detailType, detailPayload }) => {

    const { warband, updateKey, reloadDisplay } = useWarband();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // better for mobile
            },
        })
    );

    const [keyvar, setkeyvar] = useState(0);

    useEffect(() => {
        setkeyvar(keyvar + 1);
    }, [updateKey]);

    return (
        <div key={keyvar}>
            {warband &&
            <>
                {/* Warband Elites */}
                {(warband.warband_data.HasElites()) &&
                <>
                <h3 className={'category-headline'}>Elites</h3>
                {warband.warband_data.GetFighters().map((item, index) => (
                    <>
                        {(item.model.IsElite() && (item.model.State == 'active')) &&
                            <WbbEditViewFighter
                                item={item}
                                index={index}
                                onClick={() => openDetail('fighter', item)}
                                isActive={detailType === 'fighter' &&
                                        warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                        warband.warband_data.Models.indexOf(item.purchase)}
                            />
                        }
                    </>
                ))}
                </>
                }

                
                {(warband.warband_data.HasTroops()) &&
                <>
                <h3 className={'category-headline'}>Troops</h3>
                {warband.warband_data.GetFighters().map((item, index) => (
                    <>
                        {((!item.model.IsElite() && (!item.model.IsMercenary())) && (item.model.State == 'active')) &&
                            <WbbEditViewFighter
                                item={item}
                                index={index}
                                onClick={() => openDetail('fighter', item)}
                                isActive={detailType === 'fighter' &&
                                        warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                        warband.warband_data.Models.indexOf(item.purchase)}
                            />
                        }
                    </>
                ))}
                </>
                }

                
                {(warband.warband_data.HasMercenaries()) &&
                <>
                <h3 className={'category-headline'}>Mercenaries</h3>
                {warband.warband_data.GetFighters().map((item, index) => (
                    <>
                        {(item.model.IsMercenary() && (item.model.State == 'active')) &&
                            <WbbEditViewFighter
                                item={item}
                                index={index}
                                onClick={() => openDetail('fighter', item)}
                                isActive={detailType === 'fighter' &&
                                        warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                        warband.warband_data.Models.indexOf(item.purchase)}
                            />
                        }
                    </>
                ))}
                </>
                }
                
                {(warband.warband_data.HasReserves()) &&
                <>
                <h3 className={'category-headline'}>Reserves</h3>
                {warband.warband_data.GetFighters().map((item, index) => (
                    <>
                        {((item.model.State == 'reserved')) &&
                            <WbbEditViewFighter
                                item={item}
                                index={index}
                                onClick={() => openDetail('fighter', item)}
                                isActive={detailType === 'fighter' &&
                                        warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                        warband.warband_data.Models.indexOf(item.purchase)}
                            />
                        }
                    </>
                ))}
                </>
                }
                
                {(warband.warband_data.HasGone()) &&
                <>
                <h3 className={'category-headline'}>Lost & Captured</h3>
                {warband.warband_data.GetFighters().map((item, index) => (
                    <>
                        {((item.model.State == 'lost')) &&
                            <WbbEditViewFighter
                                item={item}
                                index={index}
                                onClick={() => openDetail('fighter', item)}
                                isActive={detailType === 'fighter' &&
                                        warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                        warband.warband_data.Models.indexOf(item.purchase)}
                            />
                        }
                    </>
                ))}
                </>
                }
                
                {(warband.warband_data.HasDead()) &&
                <>
                <h3 className={'category-headline'}>Dead</h3>
                {warband.warband_data.GetFighters().map((item, index) => (
                    <>
                        {((item.model.State == 'dead')) &&
                            <WbbEditViewFighter
                                item={item}
                                index={index}
                                onClick={() => openDetail('fighter', item)}
                                isActive={detailType === 'fighter' &&
                                        warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                        warband.warband_data.Models.indexOf(item.purchase)}
                            />
                        }
                    </>
                ))}
                </>
                }
                </>
            }
        </div>
    )
};

export default WbbViewFighters;