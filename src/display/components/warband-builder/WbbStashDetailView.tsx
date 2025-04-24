import React, {useState} from 'react';
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faPlus} from "@fortawesome/free-solid-svg-icons";
import WbbEquipmentListItem from "./WbbEquipmentListItem";
import WbbModalAddRangedWeapon from "./modals/fighter/WbbAddRangedWeapon";
import WbbModalAddItemToStash from "./modals/WbbModalAddItemToStash";

interface WbbStashDetailViewProps {
    warband: UserWarband;
    onClose: () => void;
}




const WbbStashDetailView: React.FC<WbbStashDetailViewProps> = ({ warband, onClose }) => {
    const stash = warband.GetStash();

    const [showAddItemToStash, setShowAddItemToStash] = useState(false);
    const handleAddItemToStash = (item: { id: string; name: string }) => {
        // @TODO: Implement logic to add weapon to fighter's equipment
        console.log('Item added to stash:', item);
    };

    return (
        <div className="WbbDetailView WbbStashDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Stash'}
                </div>
            </div>

            <div className={'detail-view-content'}>
                {/* @TODO: add real Data here */}
                <div className="stash-summary mb-3">
                    <div><strong>Ducats:</strong> {stash.AmountDucats || 0}</div>
                    <div><strong>Glory Points:</strong> {stash.AmountGlory || 0}</div>
                    <div><strong>Value:</strong> {stash.ValueDucats} Ducats / {stash.ValueGlory} Glory</div>
                </div>

                <div className={'stash-items-title'}>
                    {'Stashed Items'}
                </div>

                <div className="stash-items-wrap">
                    {stash.Items && stash.Items.length > 0 ? (
                        <>
                            {stash.Items.map((item: any, index: number) => (
                                <WbbEquipmentListItem
                                    key={index}
                                    item={item}
                                />
                            ))}
                        </>
                    ) : (
                        <div>No items in stash.</div>
                    )}
                    <div className={'btn btn-add-element btn-block'}
                         onClick={() => setShowAddItemToStash(true)}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Ranged Weapon'}
                    </div>

                    <WbbModalAddItemToStash
                        show={showAddItemToStash}
                        onClose={() => setShowAddItemToStash(false)}
                        onSubmit={handleAddItemToStash}
                    />
                </div>
            </div>

        </div>
    );
};

export default WbbStashDetailView;
