import React from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import WarbandListEntry from "../../components/Profile/WarbandListEntry";
import CMWarbandListEntry from "../micro-components/CMWarbandListEntry";

const CampaignWarbands: React.FC = () => {
    const { campaign } = useCampaign();


    return (
        <div className="CampaignWarbands CampaignManager-card">
            <div className={'CampaignManager-card-title'}>
                <h2>
                    {'Warbands'}
                </h2>
            </div>

            <div className={'CampaignManager-card-content'}>
                <ul className={'warbands-list'}>
                    {campaign.GetWarbands().map((warband, idx) => (
                        <li key={idx} className={'warband'}>
                            <CMWarbandListEntry warband={warband}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CampaignWarbands;