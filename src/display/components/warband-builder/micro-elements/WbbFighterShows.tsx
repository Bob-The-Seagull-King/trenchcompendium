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
import {useWbbMode} from "../../../../context/WbbModeContext";


type DetailType = 'fighter' | 'stash' | 'warband' | 'campaign' | 'exploration' | 'post-game' | null;

interface WbbFighterShow {
    openDetail: (type: DetailType, payload?: any) => void,
    detailType : DetailType,
    detailPayload : any,
    setShowAddFighterEliteModal:(type : boolean) => void,
    setShowAddFighterTroopModal:(type : boolean) => void,
    setShowAddFighterMercenaryModal:(type : boolean) => void
}

const WbbFighterShows : React.FC<WbbFighterShow> = ({ openDetail, detailType, detailPayload, setShowAddFighterEliteModal, setShowAddFighterTroopModal, setShowAddFighterMercenaryModal }) => {

    const { warband, updateKey, reloadDisplay, modalIsOpen } = useWarband();
    const { play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode();


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

    // define typed fighter lists
    const elites = warband?.warband_data
        .GetFighters()
        .filter(f => f.model.IsElite() && f.model.State === 'active');

    const troops = warband?.warband_data
        .GetFighters()
        .filter(f => !f.model.IsElite() && !f.model.IsMercenary() && f.model.State === 'active');

    const mercs = warband?.warband_data
        .GetFighters()
        .filter(f => f.model.IsMercenary() && f.model.State === 'active');

    const reserves = warband?.warband_data.GetFighters().filter(f => f.model.State === 'reserved');
    const lost     = warband?.warband_data.GetFighters().filter(f => f.model.State === 'lost');
    const dead     = warband?.warband_data.GetFighters().filter(f => f.model.State === 'dead');

    return (
        <div key={keyvar}>
            {warband &&
            <>
                {/* Warband Elites */}
                {(edit_mode || warband.warband_data.HasElites()) &&
                <>
                <h3 className={'category-headline'}>Elites</h3>
                {elites &&
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={elites.map(f => f.model.ID)}
                            strategy={verticalListSortingStrategy}
                            disabled={modalIsOpen}
                        >
                            {elites.map((item, index) => (
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
                            ))}
                        </SortableContext>
                    </DndContext>
                }
                </>
                }

                {/* Add Elite Button */}
                {edit_mode &&
                    <div className={'btn btn-add-element btn-block'}
                            onClick={() => setShowAddFighterEliteModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Elite'}
                    </div>
                }


                {/* Warband Troops */}
                {(edit_mode || warband.warband_data.HasTroops()) &&
                <>
                <h3 className={'category-headline'}>Troops</h3>

                {troops &&
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={troops.map(f => f.model.ID)}
                            strategy={verticalListSortingStrategy}
                            disabled={modalIsOpen}
                        >
                            {troops.map((item, index) => (
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
                            ))}
                        </SortableContext>
                    </DndContext>
                }
                </>
                }

                {/* Add Troop Button */}
                {edit_mode &&
                    <div className={'btn btn-add-element btn-block'}
                            onClick={() => setShowAddFighterTroopModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Troop'}
                    </div>
                }


                {(edit_mode || warband.warband_data.HasMercenaries()) &&
                    <>
                        {/* Warband Mercenaries */}
                        <h3 className={'category-headline'}>Mercenaries</h3>

                        {mercs &&
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={mercs.map(f => f.model.ID)}
                                    strategy={verticalListSortingStrategy}
                                    disabled={modalIsOpen}
                                >
                                    {mercs.map((item, index) => (
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
                                    ))}
                                </SortableContext>
                            </DndContext>
                        }
                    </>
                }

                {/* Add mercenary btn */}
                {edit_mode &&
                    <div className={'btn btn-add-element btn-block'}
                            onClick={() => setShowAddFighterMercenaryModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Mercenary'}
                    </div>
                }

                {((edit_mode || view_mode) && warband.warband_data.HasReserves()) &&
                    <>
                        {/* Warband Reserve Members */}
                        <h3 className={'category-headline'}>Reserves</h3>

                        {reserves &&
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={reserves.map(f => f.model.ID)}
                                    strategy={verticalListSortingStrategy}
                                    disabled={modalIsOpen}
                                >
                                    {reserves.map((item, index) => (
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
                                    ))}
                                </SortableContext>
                            </DndContext>
                        }
                    </>
                }

                {((edit_mode || view_mode) && warband.warband_data.HasGone()) &&
                    <>
                        {/* Warband Lost & Captured Members */}
                        <h3 className={'category-headline'}>Lost & Captured</h3>

                        {lost &&
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={lost.map(f => f.model.ID)}
                                    strategy={verticalListSortingStrategy}
                                    disabled={modalIsOpen}
                                >
                                    {lost.map((item, index) => (
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
                                    ))}
                                </SortableContext>
                            </DndContext>
                        }

                    </>
                }
                
                {((edit_mode || view_mode) && warband.warband_data.HasDead()) &&
                    <>
                        {/* Warband Dead Members */}
                        <h3 className={'category-headline'}>Dead</h3>

                        {dead &&
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={dead.map(f => f.model.ID)}
                                    strategy={verticalListSortingStrategy}
                                    disabled={modalIsOpen}
                                >
                                    {dead.map((item, index) => (
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
                                    ))}
                                </SortableContext>
                            </DndContext>
                        }
                    </>
                }
                </>
            }
        </div>
    )
};

export default WbbFighterShows;