import React from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import WarbandListEntry from "../../components/Profile/WarbandListEntry";
import CMWarbandListEntry from "../micro-components/CMWarbandListEntry";
import AlertCustom from "../../components/generics/AlertCustom";

const CampaignWarbands: React.FC = () => {
    const { campaign } = useCampaign();

    if( !campaign) {
        return null;
    }

    return (
        <div className="CampaignWarbands CampaignManager-card">
            <div className={'CampaignManager-card-title'}>
                <h2>
                    {'Warbands'}
                </h2>
            </div>

            <div className={'CampaignManager-card-content'}>

                {campaign.GetWarbands().length > 0 ? (
                    <ul className={'warbands-list'}>
                        {campaign.GetWarbands().map((warband, idx) => (
                            <li key={idx} className={'warband'}>
                                <CMWarbandListEntry warband={warband}/>
                            </li>
                        ))}
                    </ul>
                ):(
                    <AlertCustom
                        type={'info'}
                    >
                        <div className={'fw-bold'}>
                            {'Peace will not last'}
                        </div>
                        <div className={''}>
                            {'No warbands have joined this campaign yet'}
                        </div>
                    </AlertCustom>
                )}

            </div>
        </div>
    );
};

export default CampaignWarbands;