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
    detailPayload : any,
    setShowAddFighterEliteModal:(type : boolean) => void,
    setShowAddFighterTroopModal:(type : boolean) => void,
    setShowAddFighterMercenaryModal:(type : boolean) => void
}

const WbbFighterShows : React.FC<WbbFighterShow> = ({ playMode, openDetail, detailType, detailPayload, setShowAddFighterEliteModal, setShowAddFighterTroopModal, setShowAddFighterMercenaryModal }) => {

    const { warband, updateKey, reloadDisplay } = useWarband();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // better for mobile
            },
        })
    );

    const [keyvar, setkeyvar] = useState(0);

    const handleDragEnd = (event: any) => {
        const {active, over} = event;
        warband?.warband_data.ReorganiseFighters(active , over )
        reloadDisplay()
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999)
    };

    useEffect(() => {
        setkeyvar(keyvar + 1);
    }, [updateKey]);

    return (
        <div key={keyvar}>
            {warband &&
            <>
                {/* Warband Elites */}
                {(!playMode || warband.warband_data.HasElites()) &&
                <>
                <h3 className={'category-headline'}>Elites</h3>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={warband.warband_data.GetFighters().map(f => f.model.ID)}
                        strategy={verticalListSortingStrategy}>
                        {warband.warband_data.GetFighters().map((item, index) => (
                            <>
                                {(item.model.IsElite() && (item.model.State == 'active')) &&
                                    <WbbEditViewFighterSortable
                                        key={item.model.ID}
                                        fighter={item}
                                        index={index}
                                        onClick={() => openDetail('fighter', item)}
                                        isActive={
                                            detailType === 'fighter' &&
                                            warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                            warband.warband_data.Models.indexOf(item.purchase)
                                        }
                                    />
                                }
                            </>
                        ))}
                    </SortableContext>
                </DndContext>
                </>
                }


                {!playMode &&
                    <div className={'btn btn-add-element btn-block'}
                            onClick={() => setShowAddFighterEliteModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Elite'}
                    </div>
                }


                {/* Warband Troops */}
                {(!playMode || warband.warband_data.HasTroops()) &&
                <>
                <h3 className={'category-headline'}>Troops</h3>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={warband.warband_data.GetFighters().map(f => f.model.ID)}
                        strategy={verticalListSortingStrategy}>
                        {warband.warband_data.GetFighters().map((item, index) => (
                            <>
                                {((!item.model.IsElite() && (!item.model.IsMercenary())) && (item.model.State == 'active')) &&
                                    <WbbEditViewFighterSortable
                                        key={item.model.ID}
                                        fighter={item}
                                        index={index}
                                        onClick={() => openDetail('fighter', item)}
                                        isActive={
                                            detailType === 'fighter' &&
                                            warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                            warband.warband_data.Models.indexOf(item.purchase)
                                        }
                                    />
                                }
                            </>
                        ))}
                    </SortableContext>
                </DndContext>
                </>
                }

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
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={warband.warband_data.GetFighters().map(f => f.model.ID)}
                                strategy={verticalListSortingStrategy}>
                                {warband.warband_data.GetFighters().map((item, index) => (
                                    <>
                                        {(item.model.IsMercenary() && (item.model.State == 'active')) &&
                                            <WbbEditViewFighterSortable
                                                key={item.model.ID}
                                                fighter={item}
                                                index={index}
                                                onClick={() => openDetail('fighter', item)}
                                                isActive={
                                                    detailType === 'fighter' &&
                                                    warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                                    warband.warband_data.Models.indexOf(item.purchase)
                                                }
                                            />
                                        }
                                    </>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </>
                }


                {!playMode &&
                    <div className={'btn btn-add-element btn-block'}
                            onClick={() => setShowAddFighterMercenaryModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Mercenary'}
                    </div>
                }

                {(!playMode && warband.warband_data.HasReserves()) &&
                    <>
                        {/* Warband Mercenaries */}
                        <h3 className={'category-headline'}>Reserves</h3>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={warband.warband_data.GetFighters().map(f => f.model.ID)}
                                strategy={verticalListSortingStrategy}>
                                {warband.warband_data.GetFighters().map((item, index) => (
                                    <>
                                        {((item.model.State == 'reserved')) &&
                                            <WbbEditViewFighterSortable
                                                key={item.model.ID}
                                                fighter={item}
                                                index={index}
                                                onClick={() => openDetail('fighter', item)}
                                                isActive={
                                                    detailType === 'fighter' &&
                                                    warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                                    warband.warband_data.Models.indexOf(item.purchase)
                                                }
                                            />
                                        }
                                    </>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </>
                }

                {(!playMode && warband.warband_data.HasGone()) &&
                    <>
                        {/* Warband Mercenaries */}
                        <h3 className={'category-headline'}>Lost & Captured</h3>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={warband.warband_data.GetFighters().map(f => f.model.ID)}
                                strategy={verticalListSortingStrategy}>
                                {warband.warband_data.GetFighters().map((item, index) => (
                                    <>
                                        {((item.model.State == 'lost')) &&
                                            <WbbEditViewFighterSortable
                                                key={item.model.ID}
                                                fighter={item}
                                                index={index}
                                                onClick={() => openDetail('fighter', item)}
                                                isActive={
                                                    detailType === 'fighter' &&
                                                    warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                                    warband.warband_data.Models.indexOf(item.purchase)
                                                }
                                            />
                                        }
                                    </>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </>
                }
                
                {(!playMode && warband.warband_data.HasDead()) &&
                    <>
                        {/* Warband Mercenaries */}
                        <h3 className={'category-headline'}>Dead</h3>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={warband.warband_data.GetFighters().map(f => f.model.ID)}
                                strategy={verticalListSortingStrategy}>
                                {warband.warband_data.GetFighters().map((item, index) => (
                                    <>
                                        {((item.model.State == 'dead')) &&
                                            <WbbEditViewFighterSortable
                                                key={item.model.ID}
                                                fighter={item}
                                                index={index}
                                                onClick={() => openDetail('fighter', item)}
                                                isActive={
                                                    detailType === 'fighter' &&
                                                    warband.warband_data.Models.indexOf(detailPayload?.purchase) ===
                                                    warband.warband_data.Models.indexOf(item.purchase)
                                                }
                                            />
                                        }
                                    </>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </>
                }
                </>
            }
        </div>
    )
};

export default WbbFighterShows;