import React, {useEffect, useState} from 'react';
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faPlus} from "@fortawesome/free-solid-svg-icons";
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

interface WbbStashDetailViewProps {
    onClose: () => void;
}


const WbbStashDetailView: React.FC<WbbStashDetailViewProps> = ({ onClose }) => {

    const { warband, updateKey, reloadDisplay } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    const [stash, setStash] = useState(warband.warband_data.GetStash())

    const [stashkey, setstashkey] = useState(0)

    const [showRangedAddItemToStash, setShowRangedAddItemToStash] = useState(false);
    const [showMeleeAddItemToStash, setShowMeleeAddItemToStash] = useState(false);
    const [showArmourAddItemToStash, setShowArmourAddItemToStash] = useState(false);
    const [showEquipAddItemToStash, setShowEquipAddItemToStash] = useState(false);
    const handleAddItemToStash = (item: FactionEquipmentRelationship) => {
        if (!warband) { return; } // Guard
        
        warband.warband_data.AddStash(item).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        })
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
                    <div><strong>Spare Ducats:</strong> {(stash.AmountDucats > 10e10? "Unlimited" : stash.AmountDucats) || 0}</div>
                    <div><strong>Spare Glory:</strong> {(stash.AmountGlory  > 10e10? "Unlimited" : stash.AmountGlory) || 0}</div>
                    <div><strong>Value:</strong> {stash.ValueDucats} Ducats / {stash.ValueGlory} Glory</div>
                </div>

                <div className={'stash-items-title'}>
                    {'Stashed Items'}
                </div>

                <div className="stash-items-wrap">
                    <div className={'stash-items-category'}>
                        {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
                                ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "ranged")
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
                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowRangedAddItemToStash(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Ranged Weapon'}
                        </div>
                    </div>

                    <div className={'stash-items-category'}>
                        {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
                                ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "melee")
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
                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowMeleeAddItemToStash(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Melee Weapon'}
                        </div>
                    </div>

                    <div className={'stash-items-category'}>
                        {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
                                ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "armour")
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
                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowArmourAddItemToStash(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Armour'}
                        </div>
                    </div>

                    <div className={'stash-items-category'}>
                        {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
                                ).length > 0 ? (
                            <>
                                {warband?.warband_data.Equipment.filter(item =>
                                (((item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Category == "equipment")
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
                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowEquipAddItemToStash(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Equipment'}
                        </div>
                    </div>

                    <WbbModalAddItemToStash
                        show={showRangedAddItemToStash}
                        onClose={() => setShowRangedAddItemToStash(false)}
                        onSubmit={handleAddItemToStash}
                        category='ranged'
                    />

                    <WbbModalAddItemToStash
                        show={showMeleeAddItemToStash}
                        onClose={() => setShowMeleeAddItemToStash(false)}
                        onSubmit={handleAddItemToStash}
                        category='melee'
                    />

                    <WbbModalAddItemToStash
                        show={showArmourAddItemToStash}
                        onClose={() => setShowArmourAddItemToStash(false)}
                        onSubmit={handleAddItemToStash}
                        category='armour'
                    />

                    <WbbModalAddItemToStash
                        show={showEquipAddItemToStash}
                        onClose={() => setShowEquipAddItemToStash(false)}
                        onSubmit={handleAddItemToStash}
                        category='equipment'
                    />
                </div>
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
