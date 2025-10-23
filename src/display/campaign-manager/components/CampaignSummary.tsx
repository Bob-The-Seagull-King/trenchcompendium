import React, {useState} from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import {useAuth} from "../../../utility/AuthContext";
import CMTextarea from '../micro-components/CMTextArea';
import CMLatestAnnouncement from "./CMLatestAnnouncement";
import CMProgressGraph from "./CMProgressGraph";
import {ToolsController} from "../../../classes/_high_level_controllers/ToolsController";
import {toast} from "react-toastify";
import {CampaignAnnouncement} from "../../../classes/saveitems/Campaign/CampaignAnnouncement";

const CampaignSummary: React.FC = () => {
    const { campaign } = useCampaign();
    const { userId, isLoggedIn } = useAuth()

    if( !campaign) {
        return null;
    }

    const [busy, setBusy] = useState(false);
    const [campaignTitle, setCampaignTitle] = useState(campaign.GetName());
    const [campaignDescription, setCampaignDescription] = useState(campaign.GetDescription());

    // Changes the campaign description
    const handleChangeCampaignDescription = ( text: string) => {
        if (campaign != null ) {
            if(text == campaign.GetDescription()) {
                return; // no changes
            }

            setBusy(true);

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.UpdateCampaign(
                    campaign.GetId(),
                    campaign.GetName(),
                    text
                ).then(() => {
                    setBusy(false);
                    toast.success('Description changed')
                })
            })
        }
    }

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
                        onSave={ handleChangeCampaignDescription }
                        canEdit={campaign.IsAdmin(userId ? userId : 0)}
                        isBusy={busy}
                    />
                </div>

                <CMLatestAnnouncement />

                {/*<CMProgressGraph />*/}
            </div>
        </div>
    );
};

export default CampaignSummary;