import React, {useEffect, useState} from "react";
import {useAuth} from "../../utility/AuthContext";
import {CampaignProvider, useCampaign} from "../../context/CampaignContext";
import LoadingOverlay from "../components/generics/Loading-Overlay";
import CampaignSummary from "./components/CampaignSummary";
import CampaignWarbands from "./components/CampaignWarbands";
import CampaignPlayers from "./components/CampaignPlayers";
import CMManagePanel from "./components/CMManagePanel";
import CMHistory from "./components/CMHistory";
import {Campaign} from "../../classes/saveitems/Campaign/Campaign";
import CMContextualPopover from "./components/CMContextualPopover";
import CMCampaignInviteThis from "./components/CMCampaignInviteThis";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../resources/routes-constants";
import PageMetaInformation from "../components/generics/PageMetaInformation";
import {renderMiniMarkdown, stripMiniMarkdown} from "../../utility/util";
import CMCampaignJsonLDSchema from "../components/JSON-LD-Schema/CMCampaignJsonLDSchema";



const CampaignManagerContent: React.FC = () => {
    const { userId, isLoggedIn } = useAuth()

    const { campaign, loading, error, reload } = useCampaign();
    const navigate = useNavigate();

    if (error) {
        navigate( ROUTES.CAMPAIGN)
    }


    // Create meta description string
    const meta = React.useMemo(() => {
        const raw = campaign?.GetDescription?.() || "";
        const text = stripMiniMarkdown(raw);

        const maxLen = 160;
        return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
    }, [campaign?.GetDescription()]);


    if (!campaign || loading) return (
        <div className={'LoadingOverlay-wrap-100vh'}>
            <LoadingOverlay
                message={'Loading Campaign'}
            />
        </div>
    );


    return (
        <div className="CampaignManager">
            <PageMetaInformation
                title={campaign.GetName() + ' - Campaign Manager'}
                description={meta}
            />

            <div className={'CampaignManager-header'}>
                <div className={'container'}>
                    <h1>
                        {campaign.GetName()}
                    </h1>

                    <CMContextualPopover
                        id={`campaign`}
                        type="campaign"
                        item={campaign} // this is a placeholder
                    />
                </div>
            </div>

            <div className={'CampaignManager-main'}>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-12 col-md-7'}>
                            <CMCampaignInviteThis />

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
            {/*<CMCampaignJsonLDSchema />*/}
        </div>
    );
};

export default CampaignManagerContent;
