/**
 * The campaigns list on profiles
 */

import React from 'react'
import UserListEntry from "./UserListEntry";
import CampaignListEntry from "./CampaignListEntry";
import {SiteUser} from "../../../classes/user_synod/site_user";
import {SiteUserPublic} from "../../../classes/user_synod/user_public";

interface ProfilePageCampaignsProps {
    userData: SiteUser | SiteUserPublic | null;
}

const ProfilePageCampaigns: React.FC<ProfilePageCampaignsProps> = ({ userData }) => {

    // @TODO: Replace with Synod Data
    const campaigns: {
        campaignID: number;
        campaignImageID: number;
        campaignName: string;
        campaignStatus: 'active' | 'complete';
    }[] = [
        // {
        //     campaignID: 1,
        //     campaignImageID: 178,
        //     campaignName: 'Crusade of Avarice',
        //     campaignStatus: 'active',
        // },
        // {
        //     campaignID: 2,
        //     campaignImageID: 185,
        //     campaignName: 'TC 2025 - MS lorem',
        //     campaignStatus: 'active',
        // },
        // {
        //     campaignID: 4,
        //     campaignImageID: 214,
        //     campaignName: 'A very cool Campaign name',
        //     campaignStatus: 'complete',
        // },

    ]

    return (
        <div className="ProfilePageCampaigns">
            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Campaigns'}
                </div>

                <div className={'profile-card-content'}>
                    {campaigns.length > 0 ? (
                        <ul className={'campaigns-list'}>
                            {campaigns.map((campaign) => (
                                <li key={campaign.campaignID} className={'campaign'}>
                                    <CampaignListEntry
                                        campaignID={campaign.campaignID}
                                        campaignImageID={campaign.campaignImageID}
                                        campaignName={campaign.campaignName}
                                        campaignStatus={campaign.campaignStatus}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="campaigns-list-empty">
                            {'No campaigns found for this user.'}
                            <br/>
                            <br/>
                            {'This feature is still in developement, stay tuned for the next update.'}
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ProfilePageCampaigns
