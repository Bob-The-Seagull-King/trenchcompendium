import React, {useState} from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faFloppyDisk, faPen} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbModalEditFighterStatus from "./modals/fighter/WbbEditFighterStatus";
import WbbTextarea from "./WbbTextarea";
import WbbOptionBox from "./WbbOptionBox";
import WbbDetailViewCollapse from "./WbbDetailViewCollapse";
import WbbEditGoeticSelectionModal from "./modals/warband/WbbEditGoeticSelectionModal";
import WbbExplorationSkills from "./WbbExplorationSkills";

interface WbbWarbandDetailViewProps {
    onClose: () => void;
}

const WbbWarbandDetailView: React.FC<WbbWarbandDetailViewProps> = ({  onClose }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    /** Goetic Options */
    const [goeticDiscipline, setGoeticDiscipline] = useState<string>(warband.warband_data.GetGoeticSelection());

    const [showGoeticModal, setshowGoeticModal] = useState(false);
    const handleGoeticUpdate = ( selectedGoetic: string ) => {
        setGoeticDiscipline(selectedGoetic)

        // @TODO: Update Goetic Power
        console.log('@TODO: set goetic power '+ selectedGoetic)
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

                        {warband.warband_data.GetFactionName()}
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Name: '}
                        </strong>
                        {warband.warband_data.GetWarbandName()}
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Rating: '}
                        </strong>
                        {warband.warband_data.GetCostDucats()} Ducats
                        | {warband.warband_data.GetCostGlory()} Glory
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Value: '}
                        </strong>
                        {warband.warband_data.GetCostDucatsTotal()} Ducats
                        | {warband.warband_data.GetCostGloryTotal()} Glory
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>{'Fighters: '}</strong>
                        {'Elite: '}{warband.warband_data.GetNumElite()}
                        {' | '}
                        {'Troop: '}{warband.warband_data.GetNumTroop()}
                        {' | '}
                        {'Mercenary: '}{warband.warband_data.GetNumMercenary()}
                    </div>
                </div>

                {/* Warband level options */}
                <div className={'WbbDetailViewCollapse-wrap'}>
                    {/* @TODO: only show if warband has options */}
                    <WbbDetailViewCollapse title="Warband Options" initiallyOpen={true}>

                        {/* Goetic Options */}
                        {warband.warband_data.HasGoeticOptions() &&
                            <>
                                {/* @TODO
                                      * - hide for all campaign Rounds but the first
                                      * - hide in play mode
                                */}
                                
                                <WbbOptionBox
                                    title={'Seven Deadly Sins'}
                                    value={goeticDiscipline}
                                    onClick={() => setshowGoeticModal(true)}
                                />

                                <WbbEditGoeticSelectionModal
                                    show={showGoeticModal}
                                    onClose={() => setshowGoeticModal(false)}
                                    currentGoetic={goeticDiscipline}
                                    onSubmit={handleGoeticUpdate}
                                />
                            </>
                        }

                        {/*@TODO: add options to this area */}
                        Warband level options go here.
                        <br/>
                        - Fireteams
                        <br/>
                        - HoW Weapon Selection

                    </WbbDetailViewCollapse>

                    {/* Warband Rules */}
                    {/* @TODO: only show if warband has Special Rules */}
                    <WbbDetailViewCollapse title="Special Rules" initiallyOpen={true}>

                        {/*@TODO: add special rules as text to this area */}
                        Special Rules go here

                    </WbbDetailViewCollapse>

                    <WbbDetailViewCollapse title="Exploration Skills" initiallyOpen={true}>

                        <WbbExplorationSkills />

                    </WbbDetailViewCollapse>

                    {/* Notes textarea */}
                    <WbbDetailViewCollapse title="Notes & Lore" initiallyOpen={false}>
                        <WbbTextarea
                            initialText={warband.warband_data.GetWarbandNotes()}
                            title="Warband Notes"
                            onSave={(newText) => {
                                // @TODO Save the newText as warband Notes
                                console.log('@TODO Save the newText as warband Notes', newText);
                            }}
                        />

                        {/* Lore  textarea */}
                        <WbbTextarea
                            initialText={warband.warband_data.GetLore()}
                            title="Warband Lore"
                            onSave={(newText) => {
                                // @TODO Save the newText as warband Lore
                                console.log('@TODO Save the newText as warband Lore', newText);
                            }}
                        />
                    </WbbDetailViewCollapse>


                </div>

            </div>
        </div>
    );
};

export default WbbWarbandDetailView;
