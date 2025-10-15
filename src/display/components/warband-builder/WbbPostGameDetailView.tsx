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
import PostGameContext, {GloriousDeed} from "../../../context/PostGameContext";
import WbbPostGameDetailGame from "./PostGame/WbbPostGameDetailGame";
import WbbPostGameDetailElite from "./PostGame/WbbPostGameDetailElite";
import WbbPostGameDetailTroopInjuries from "./PostGame/WbbPostGameDetailTroopInjuries";
import WbbPostGameDetailPromotions from "./PostGame/WbbPostGameDetailPromotions";
import WbbPostGameDetailExploration from "./PostGame/WbbPostGameDetailExploration";
import WbbPostGameDetailSalvageGolem from "./PostGame/WbbPostGameDetailSalvageGolem";
import WbbPostGameDetailKnighthood from "./PostGame/WbbPostGameDetailKnighthood";
import WbbPostGameDetailCustom from "./PostGame/WbbPostGameDetailCustom";



interface WbbPostGameDetailViewProps {
    onClose: () => void;
}


const WbbPostGameDetailView: React.FC<WbbPostGameDetailViewProps> = ({ onClose }) => {
    const { warband, reloadDisplay, updateKey } = useWarband();

    if (warband == null) return (<div>Loading...</div>);

    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2
    const [gloriousDeeds, setGloriousDeeds] = useState<GloriousDeed[]>([]);
    const [hasWon, setHasWon] = useState<boolean>(false);

    return (
        <PostGameContext.Provider value={{ gloriousDeeds, setGloriousDeeds, hasWon, setHasWon }}>
            <div className="WbbDetailView WbbPostGameDetailView">
                <div className={'title'}>
                    <div className={'title-back'} onClick={onClose}>
                        <FontAwesomeIcon icon={faChevronLeft} className=""/>
                    </div>

                    <div className={'title-text'}>
                        {'Post Game'}
                    </div>
                </div>

                <div className={'detail-view-content'}>

                    {/* Game Info */}
                    <WbbPostGameDetailGame/>

                    {/* Warband Elites */}
                    {(warband && warband.warband_data.HasElites()) &&
                        <>
                            <h3>
                                {'Elites'}
                            </h3>
                            {warband.warband_data.GetFighters().map((fighter, index) => (
                                <React.Fragment key={`postgame-elites-${index}`}>
                                    {(fighter.model.IsElite() && (fighter.model.State == 'active')) &&
                                        <WbbPostGameDetailElite
                                            fighter={fighter}
                                        />
                                    }
                                </React.Fragment>
                            ))}
                        </>
                    }

                    {/* Warband Troops */}
                    {(warband && warband.warband_data.HasTroops()) &&
                        <>
                            <h3>
                                {'Troops'}
                            </h3>
                            <WbbPostGameDetailTroopInjuries/>

                            <WbbPostGameDetailPromotions/>
                        </>
                    }

                    <h3>
                        {'Warband'}
                    </h3>
                    {/* Warband Exploration */}
                    <WbbPostGameDetailExploration/>

                    <WbbPostGameDetailSalvageGolem />
                    <WbbPostGameDetailKnighthood />

                    {/* Custom Setting */}
                    <WbbPostGameDetailCustom/>
                </div>
            </div>
        </PostGameContext.Provider>
    );
};

export default WbbPostGameDetailView;
