import React, {useEffect, useState} from 'react';
import {CampaignProvider, useCampaign} from "../../context/CampaignContext";
import CampaignSummary from "./components/CampaignSummary";
import CampaignWarbands from "./components/CampaignWarbands";
import CampaignPlayers from "./components/CampaignPlayers";
import {useAuth} from "../../utility/AuthContext";
import {Campaign} from "../../classes/saveitems/Campaign/Campaign";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from "../components/generics/Loading-Overlay";
import CampaignManagerContent from "./CampaignManagerContent";
import {PopoverProvider} from "../../context/PopoverContext";

const CampaignManager: React.FC = () => {
    const { userId, isLoggedIn } = useAuth()

    return (
        <CampaignProvider>
            <PopoverProvider>
                <CampaignManagerContent />
            </PopoverProvider>
        </CampaignProvider>
    );
};

export default CampaignManager;
