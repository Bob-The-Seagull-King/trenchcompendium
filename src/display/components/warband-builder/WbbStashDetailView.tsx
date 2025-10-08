import React, {useEffect, useState} from 'react';
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faCoins, faPlus, faTrophy} from "@fortawesome/free-solid-svg-icons";
import WbbEquipmentListItem from "./WbbEquipmentListItem";
import WbbModalAddRangedWeapon from "./modals/fighter/WbbAddRangedWeapon";
import WbbModalAddItemToStash from "./modals/WbbModalAddItemToStash";
import {useWarband} from "../../../context/WarbandContext";
import { FactionEquipmentRelationship } from '../../../classes/relationship/faction/FactionEquipmentRelationship';
import { WarbandPurchase } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { WarbandEquipment } from '../../../classes/saveitems/Warband/Purchases/WarbandEquipment';
import { Equipment } from '../../../classes/feature/equipment/Equipment';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import { ErrorBoundary } from "react-error-boundary";
import { WarbandConsumable } from '../../../classes/saveitems/Warband/WarbandConsumable';
import WbbConsumableSelect from './modals/warband/WbbConsumableSelect';
import WbbEditStashAmountModal from './modals/warband/WbbEditStashAmountModal';
import WbbEquipmentAddCustomStash from './modals/WbbEquipmentAddCustomStash';
import { containsTag } from '../../../utility/functions';
import {useWbbMode} from "../../../context/WbbModeContext";

interface WbbStashDetailViewProps {
    onClose: () => void;
}


const WbbStashDetailView: React.FC<WbbStashDetailViewProps> = ({ onClose }) => {

    const { warband, updateKey, reloadDisplay } = useWarband();
    const { play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode(); // play mode v2
    if (warband == null) return (<div>Loading...</div>);

    const [stash, setStash] = useState(warband.warband_data.GetStash())

    const [stashkey, setstashkey] = useState(0)

    const [showRangedAddItemToStash, setShowRangedAddItemToStash] = useState(false);
    const [showMeleeAddItemToStash, setShowMeleeAddItemToStash] = useState(false);
    const [showArmourAddItemToStash, setShowArmourAddItemToStash] = useState(false);
    const [showEquipAddItemToStash, setShowEquipAddItemToStash] = useState(false);
    const [showExplorationAddItemToStash, setShowExplorationAddItemToStash] = useState(false);

    
    const [showAddDucats, setShowAddDucats] = useState(false);
    const [showAddGlory, setShowAddGlory] = useState(false);
    
    const handleAddItemToStash = (item: FactionEquipmentRelationship) => {
        if (!warband) { return; } // Guard
        
        warband.warband_data.AddStash(item).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        })
    };

    const handleUpdateStash = (newval: number, type : number) => {
        if (!warband) { return; } // Guard
        
        warband.warband_data.AwaitedAddStashValue(newval, type).then(() => {
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())})
    };

    
    useEffect(() => {
        setStash(warband.warband_data.GetStash())
        setstashkey(stashkey + 1);
    }, [updateKey]);

    return (
        <ErrorBoundary fallback={<div>Something went wrong with Stashed Items.tsx</div>}>
        <div className="WbbDetailView WbbStashDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Stash'}
                </div>
            </div>

            <div key={updateKey} className={'detail-view-content'}>
                <div className="stash-summary mb-3" key={stashkey}>
                    <div>
                        <strong>Spare Ducats:</strong> {(stash.AmountDucats > 10e10 ? "Unlimited" : stash.AmountDucats) || 0}
                    </div>
                    <div>
                        <strong>Spare Glory:</strong> {(stash.AmountGlory > 10e10 ? "Unlimited" : stash.AmountGlory) || 0}
                    </div>
                    <div>
                        <strong>Value of items:</strong> {stash.ValueDucats} Ducats / {stash.ValueGlory} Glory
                    </div>

                    {/* Add Ducats and Glory Buttons*/}
                    {edit_mode &&
                        <div className={'mt-2'}>
                            {(stash.AmountDucats < 10e10) &&
                                <div className={'btn btn-primary'}
                                     onClick={() => setShowAddDucats(true)}
                                     style={{marginRight: "0.5rem"}}>
                                    <FontAwesomeIcon icon={faCoins} className="icon-inline-left-l"/>
                                    {'Edit Ducats'}
                                </div>
                            }
                            {stash.AmountGlory < 10e10 &&
                                <div className={'btn btn-primary'}
                                     onClick={() => setShowAddGlory(true)}>
                                    <FontAwesomeIcon icon={faTrophy} className="icon-inline-left-l"/>
                                    {'Edit Glory'}
                                </div>
                            }
                        </div>
                    }
                </div>


                <div className={'stash-items-title'}>
                    {'Stashed Items'}
                </div>

                <div className="stash-items-wrap">
                    <div className={'stash-items-category'}>

                        <h3>{'Ranged Weapons'}</h3>

                        {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Category == "ranged" &&
                                !containsTag(((item.HeldObject as WarbandEquipment)).Tags, 'exploration_only'))
                                ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Category == "ranged" &&
                                !containsTag(((item.HeldObject as WarbandEquipment)).Tags, 'exploration_only'))
                                ).map((item: WarbandPurchase, index: number) => (
                                    <WbbEquipmentListItem
                                        key={index}
                                        item={item}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className={'stash-items-empty'}>No ranged items in stash.</div>
                        )}

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowRangedAddItemToStash(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Ranged Weapon'}
                            </div>
                        }
                    </div>

                    <div className={'stash-items-category'}>

                        <h3>{'Melee Weapons'}</h3>

                        {warband?.warband_data.Equipment.filter(item =>
                            (((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Category == "melee" &&
                                !containsTag(((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Tags, 'exploration_only'))
                            ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                    (((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Category == "melee" &&
                                        !containsTag(((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Tags, 'exploration_only'))
                                ).map((item: WarbandPurchase, index: number) => (
                                    <WbbEquipmentListItem
                                        key={index}
                                        item={item}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className={'stash-items-empty'}>No melee items in stash.</div>
                        )}

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowMeleeAddItemToStash(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Melee Weapon'}
                            </div>
                        }
                    </div>

                    <div className={'stash-items-category'}>

                        <h3>{'Armour'}</h3>

                        {warband?.warband_data.Equipment.filter(item =>
                            (((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Category == "armour" &&
                                !containsTag(((item.HeldObject as WarbandEquipment)).Tags, 'exploration_only'))
                        ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                    (((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Category == "armour" &&
                                        !containsTag(((item.HeldObject as WarbandEquipment)).Tags, 'exploration_only'))
                                ).map((item: WarbandPurchase, index: number) => (
                                    <WbbEquipmentListItem
                                        key={index}
                                        item={item}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className={'stash-items-empty'}>No armour in stash.</div>
                        )}

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowArmourAddItemToStash(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Armour'}
                            </div>
                        }
                    </div>

                    <div className={'stash-items-category'}>

                        <h3>{'Equipment'}</h3>

                        {warband?.warband_data.Equipment.filter(item =>
                            (((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Category == "equipment" &&
                                !containsTag(((item.HeldObject as WarbandEquipment)).Tags, 'exploration_only'))
                        ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                    (((item.HeldObject as WarbandEquipment).GetEquipmentItem()).Category == "equipment" &&
                                        !containsTag(((item.HeldObject as WarbandEquipment)).Tags, 'exploration_only'))
                                ).map((item: WarbandPurchase, index: number) => (
                                    <WbbEquipmentListItem
                                        key={index}
                                        item={item}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className={'stash-items-empty'}>No equipment in stash.</div>
                        )}

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowEquipAddItemToStash(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Equipment'}
                            </div>
                        }
                    </div>

                    <div className={'stash-items-category'}>

                        <h3>{'Exploration Items'}</h3>

                        {warband?.warband_data.Equipment.filter(item =>
                            (containsTag(((item.HeldObject as WarbandEquipment)).Tags, 'exploration_only'))
                        ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                    (containsTag(((item.HeldObject as WarbandEquipment)).Tags, 'exploration_only'))
                                ).map((item: WarbandPurchase, index: number) => (
                                    <WbbEquipmentListItem
                                        key={index}
                                        item={item}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className={'stash-items-empty'}>No exploration only items in stash.</div>
                        )}

                        {edit_mode &&
                            <div className={'btn btn-add-element btn-block'}
                                 onClick={() => setShowExplorationAddItemToStash(true)}>
                                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                {'Add Exploration-Only Item'}
                            </div>
                        }
                    </div>

                    {edit_mode &&
                        <>

                        <WbbModalAddItemToStash
                            show={showRangedAddItemToStash}
                            onClose={() => setShowRangedAddItemToStash(false)}
                            onSubmit={handleAddItemToStash}
                            category='ranged'
                            exploration={false}
                        />

                        <WbbModalAddItemToStash
                            show={showMeleeAddItemToStash}
                            onClose={() => setShowMeleeAddItemToStash(false)}
                            onSubmit={handleAddItemToStash}
                            category='melee'
                            exploration={false}
                        />

                        <WbbModalAddItemToStash
                            show={showArmourAddItemToStash}
                            onClose={() => setShowArmourAddItemToStash(false)}
                            onSubmit={handleAddItemToStash}
                            category='armour'
                            exploration={false}
                        />

                        <WbbModalAddItemToStash
                            show={showEquipAddItemToStash}
                            onClose={() => setShowEquipAddItemToStash(false)}
                            onSubmit={handleAddItemToStash}
                            category='equipment'
                            exploration={false}
                        />

                        <WbbModalAddItemToStash
                            show={showExplorationAddItemToStash}
                            onClose={() => setShowExplorationAddItemToStash(false)}
                            onSubmit={handleAddItemToStash}
                            category=''
                            exploration={true}
                        />


                        <WbbEditStashAmountModal
                            show={showAddDucats}
                            onClose={() => setShowAddDucats(false)}
                            currentcount={stash.AmountDucats}
                            costtype={0}
                            onSubmit={handleUpdateStash}
                        />
                        <WbbEditStashAmountModal
                            show={showAddGlory}
                            onClose={() => setShowAddGlory(false)}
                            currentcount={stash.AmountGlory}
                            costtype={1}
                            onSubmit={handleUpdateStash}
                        />
                        </>
                    }
                </div>

                {/* @TODO: check if edit mode restriction is needed */}
                {warband?.warband_data.GetConsumablesEquipment().length > 0 &&
                    <>
                        <div className={'stash-items-title'}>
                            {'One-Off Purchases'}
                        </div>

                        <div className="stash-items-wrap">
                            <div className={'stash-items-category'}>
                                {warband?.warband_data.GetConsumablesEquipment().map((item: WarbandConsumable, index: number) => (
                                    <WbbConsumableSelect
                                        key={index}
                                        property={item}
                                        dochange={false}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                }
                
            </div>
            

        </div>
        </ErrorBoundary>
    );
};

export default WbbStashDetailView;
