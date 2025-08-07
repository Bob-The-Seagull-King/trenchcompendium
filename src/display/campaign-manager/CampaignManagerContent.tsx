import React from "react";
import {useAuth} from "../../utility/AuthContext";
import {CampaignProvider, useCampaign} from "../../context/CampaignContext";
import LoadingOverlay from "../components/generics/Loading-Overlay";
import CampaignSummary from "./components/CampaignSummary";
import CampaignWarbands from "./components/CampaignWarbands";
import CampaignPlayers from "./components/CampaignPlayers";
import CMManagePanel from "./components/CMManagePanel";
import CMHistory from "./components/CMHistory";

const CampaignManagerContent: React.FC = () => {
    const { userId, isLoggedIn } = useAuth()

    const { campaign } = useCampaign();

    console.log( campaign );
    if (!campaign) return (
        <div className={'LoadingOverlay-wrap-100vh'}>
            <LoadingOverlay
                message={'Loading Campaign'}
            />
        </div>
    );

    return (
        <div className="CampaignManager">
            <div className={'CampaignManager-header'}>
                <div className={'container'}>
                    <h1>
                        {campaign.GetName()}
                    </h1>
                </div>
            </div>

            <div className={'CampaignManager-main'}>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-12 col-md-7'}>
                            <CampaignSummary />

                            <CMHistory />
                        </div>

                        <div className={'col-12 col-md-5'}>
                            <CMManagePanel />
                            <CampaignWarbands />
                            <CampaignPlayers />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default CampaignManagerContent;
