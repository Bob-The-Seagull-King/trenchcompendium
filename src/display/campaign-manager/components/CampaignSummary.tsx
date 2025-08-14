import React from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import CMTextarea from "../micro-components/CMTextarea";
import {useAuth} from "../../../utility/AuthContext";
import CMLatestAnnouncement from "./CMLatestAnnouncement";
import CMProgressGraph from "./CMProgressGraph";

const CampaignSummary: React.FC = () => {
    const { campaign } = useCampaign();
    const { userId, isLoggedIn } = useAuth()

    return (
        <div className="CampaignSummary CampaignManager-card">
            <div className={'CampaignManager-card-title'}>
                <h2>
                    {'Summary'}
                </h2>
            </div>

            <div className={'CampaignManager-card-content'}>
                <div className={'CampaignSummary-info'}>
                    <span className={'label'}>
                        {'Campaign Round: '}
                    </span>
                    <span className={'value'}>
                        {'5'}
                    </span>
                </div>

                <div className={'CampaignSummary-info'}>
                    <span className={'label'}>
                        {'Threshold Value: '}
                    </span>
                    <span className={'value'}>
                        {'1300 Ducats'}
                    </span>
                </div>

                <div className={'CampaignSummary-info'}>
                    <span className={'label'}>
                        {'Next round starts: '}
                    </span>
                    <span className={'value'}>
                        {'08.08.2025'}
                    </span>
                </div>

                <div className={'CampaignSummary-notes'}>
                    <CMTextarea
                        initialText={campaign.GetDescription()}
                        title={'Description'}
                        onSave={ () => alert('CM Notes ->text changed')}
                        canEdit={campaign.IsAdmin(userId ? userId : 0)}
                    />
                </div>

                <CMLatestAnnouncement />

                <CMProgressGraph />

            </div>
        </div>
    );
};

export default CampaignSummary;