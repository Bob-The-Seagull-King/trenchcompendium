import React, {useState, useEffect} from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faDownload, faExclamation, faGift, faInfoCircle, faPen, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbTextarea from "./WbbTextarea";
import WbbOptionBox from "./WbbOptionBox";
import WbbEditVictoryPointsModal from "./modals/warband/WbbEditVictoryPointsModal";
import WbbEditPatronSelectionModal from "./modals/warband/WbbEditPatronSelectionModal";
import WbbEditCampaignCycleModal from "./modals/warband/WbbEditCampaignCycleModal";
import { Patron } from '../../../classes/feature/skillgroup/Patron';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import WbbEditFailedPromotionsModal from './modals/warband/WbbEditFailedPromotionsModal';
import {useWbbMode} from "../../../context/WbbModeContext";
import WbbEditViewExplorationLocations from "./WbbEditViewExplorationLocations";
import WbbLocationsList from "./Exploration/WbbLocationsList";
import WbbExplorationSkills from "./WbbExplorationSkills";
import WbbDetailViewCollapse from "./WbbDetailViewCollapse";

interface WbbCampaignDetailViewProps {
    onClose: () => void;
}

const WbbExplorationDetailView: React.FC<WbbCampaignDetailViewProps> = ({ onClose }) => {
    const { warband, reloadDisplay, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);
    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    const cycle = warband.warband_data.GetCampaignCycleView();
    // Mapping-Funktion
    const getExplorationTableText = (cycle: number): string => {
        if (cycle <= 2) return "Common Exploration Locations";
        if (cycle <= 5) return "Common or Rare Exploration Locations";
        if (cycle <= 9) return "Rare Exploration Locations";
        return "Rare or Legendary Exploration Locations"; // 10+
    };

    return (
        <div className="WbbDetailView WbbExplorationDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Exploration'}
                </div>
            </div>

            <div className={'detail-view-content'}>
                <div className={'WbbExplorationDetailView-summary'}>
                    <div>
                        <strong>
                            {'Campaign round: '}
                        </strong>
                        {warband.warband_data.GetCampaignCycleView()}
                    </div>
                    <div>
                        <strong>
                            {'Available exploration tables: '}
                        </strong>
                        {getExplorationTableText(cycle)}
                    </div>
                </div>


                <div className={'WbbDetailViewCollapse-wrap'}>
                    <WbbDetailViewCollapse title="Exploration Skills" initiallyOpen={false}>
                        <WbbExplorationSkills />
                    </WbbDetailViewCollapse>

                    {(edit_mode || view_mode) &&
                        <WbbDetailViewCollapse title="Exploration Locations" initiallyOpen={true}>
                            <WbbLocationsList/>
                        </WbbDetailViewCollapse>
                    }
                </div>
            </div>
        </div>
    );
};

export default WbbExplorationDetailView;
