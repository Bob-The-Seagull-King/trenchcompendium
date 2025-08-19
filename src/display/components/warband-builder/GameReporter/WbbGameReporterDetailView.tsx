import React, {useState} from "react";
import {useWarband} from "../../../../context/WarbandContext";
import {useWbbMode} from "../../../../context/WbbModeContext";
import PostGameContext, {GloriousDeed} from "../../../../context/PostGameContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import WbbPostGameDetailGame from "../PostGame/WbbPostGameDetailGame";
import WbbPostGameDetailElite from "../PostGame/WbbPostGameDetailElite";
import WbbPostGameDetailTroopInjuries from "../PostGame/WbbPostGameDetailTroopInjuries";
import WbbPostGameDetailPromotions from "../PostGame/WbbPostGameDetailPromotions";
import WbbPostGameDetailExploration from "../PostGame/WbbPostGameDetailExploration";
import WbbPostGameDetailSalvageGolem from "../PostGame/WbbPostGameDetailSalvageGolem";
import WbbPostGameDetailKnighthood from "../PostGame/WbbPostGameDetailKnighthood";
import WbbPostGameDetailCustom from "../PostGame/WbbPostGameDetailCustom";
import {WbbGameReportDetailViewProvider} from "../../../../context/WbbGameReportDetailViewContext";
import WbbGameReporterWarbands from "./WbbGameReporterWarbands";
import WbbGameReporterGame from "./WbbGameReporterGame";
import WbbGameReporterDeeds from "./WbbGameReporterDeeds";
import WbbGameReporterScore from "./WbbGameReporterScore";

interface WbbGameReportDetailViewProps {
    onClose: () => void;
}


const WbbGameReportDetailView: React.FC<WbbGameReportDetailViewProps> = ({ onClose }) => {
    const { warband, reloadDisplay, updateKey } = useWarband();

    if (warband == null) return (<div>Loading...</div>);

    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    return (
        <WbbGameReportDetailViewProvider>
            <div className="WbbDetailView WbbGameReportDetailView">
                <div className={'title'}>
                    <div className={'title-back'} onClick={onClose}>
                        <FontAwesomeIcon icon={faChevronLeft} className=""/>
                    </div>

                    <div className={'title-text'}>
                        {'Report Game'}
                    </div>
                </div>

                <div className={'detail-view-content'}>
                    Lorem

                    <WbbGameReporterWarbands />

                    <WbbGameReporterGame />
                    <WbbGameReporterDeeds />
                    <WbbGameReporterScore />

                    <div className={'btn btn-primary'}>
                        {'Submit Game Score'}
                    </div>
                </div>
            </div>
        </WbbGameReportDetailViewProvider>
    );
};

export default WbbGameReportDetailView;