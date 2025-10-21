import React from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import CMWarbandListEntry from "../micro-components/CMWarbandListEntry";
import CMManagePanel_AddWarband from "./CMManagePanel_AddWarband";
import CMManagePanel_InvitePlayer from "./CMManagePanel_InvitePlayer";
import CMManagePanel_AddGameResults from "./CMManagePanel_AddGameResults";
import CMManagePanel_CreateAnnouncement from "./CMManagePanel_CreateAnnouncement";
import CMManagePanel_AdvanceCampaignRound from "./CMManagePanel_AdvanceCampaignRound";
import {useAuth} from "../../../utility/AuthContext";

const CMManagePanel: React.FC = () => {
    const { campaign } = useCampaign();
    const { userId } = useAuth()

    // do not show if current user is not admin
    if ( !campaign || campaign.GetAdminId() !== userId ) {
        return null;
    }

    // @TODO: users could be allowed to add game results

    return (
        <div className="CMManagePanel CampaignManager-card">
            <div className={'CampaignManager-card-title'}>
                <h2>
                    {'Manage'}
                </h2>
            </div>

            <div className={'CampaignManager-card-content'}>
                <CMManagePanel_AddWarband />

                <CMManagePanel_InvitePlayer />

                <CMManagePanel_AddGameResults />

                <CMManagePanel_CreateAnnouncement />

                <CMManagePanel_AdvanceCampaignRound />
            </div>
        </div>
    );
};

export default CMManagePanel;
