import React, {useState} from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faFloppyDisk, faPen} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbModalEditFighterStatus from "./modals/fighter/WbbEditFighterStatus";
import WbbEditGoeticSelectionModal from "./modals/warband/WbbEditGoeticSelectionModal";
import WbbTextarea from "./WbbTextarea";
import WbbOptionBox from "./WbbOptionBox";

interface WbbWarbandDetailViewProps {
    onClose: () => void;
}

const WbbWarbandDetailView: React.FC<WbbWarbandDetailViewProps> = ({  onClose }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    /** Goetic Options */
    const [showGoeticModal, setshowGoeticModal] = useState(false);
    const handleGoeticUpdate = ( selectedGoetic: string ) => {
        // @TODO: Update Goetic Power
    }


    return (
        <div className="WbbDetailView WbbWarbandDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Warband'}
                </div>
            </div>

            <div className={'detail-view-content'}>
                {/* Detailed information */}
                <div className={'detail-section-title'}>
                    {'Warband Details'}
                </div>

                <div className={'detail-section-text'}>
                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Faction: '}
                        </strong>

                        {warband.GetFactionName()}
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Name: '}
                        </strong>
                        {warband.GetWarbandName()}
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Rating: '}
                        </strong>
                        {warband.GetCostDucats()} Ducats
                        | {warband.GetCostGlory()} Glory
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>{'Fighters: '}</strong>
                        {'Elite: '}{warband.GetNumElite()}
                        {' | '}
                        {'Troop: '}{warband.GetNumTroop()}
                        {' | '}
                        {'Mercenary: '}{warband.GetNumMercenary()}
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Rating: '}
                        </strong>
                        {warband.GetCostDucatsTotal()} Ducats
                        | {warband.GetCostGloryTotal()} Glory
                    </div>
                </div>

                {/* Warband level options */}

                {/* Goetic Options */}
                { warband.HasGoeticOptions() &&
                    <>
                        {/* @TODO
                          * - hide for all campaign Rounds but the first
                          * - hide in play mode
                        */}
                        <WbbOptionBox
                            title={'Seven Deadly Sins'}
                            value={warband.GetGoeticSelection()}
                            onClick={() => setshowGoeticModal(true)}
                        />

                        <WbbEditGoeticSelectionModal
                            show={showGoeticModal}
                            onClose={() => setshowGoeticModal(false)}
                            currentGoetic={warband.GetGoeticSelection()}
                            onSubmit={handleGoeticUpdate}
                        />
                    </>
                }

                {/* @TODO: Add other warband level options here */}



                {/* Notes textarea */}
                <WbbTextarea
                    initialText={warband.GetNotes()}
                    title="Warband Notes"
                    onSave={(newText) => {
                        // @TODO Save the newText as warband Notes
                        console.log('@TODO Save the newText as warband Notes', newText);
                    }}
                />

                {/* Lore  textarea */}
                <WbbTextarea
                    initialText={warband.GetLore()}
                    title="Warband Lore"
                    onSave={(newText) => {
                        // @TODO Save the newText as warband Lore
                        console.log('@TODO Save the newText as warband Lore', newText);
                    }}
                />


            </div>
        </div>
    );
};

export default WbbWarbandDetailView;
