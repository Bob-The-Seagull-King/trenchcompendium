import React from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import CMWarbandListEntry from "../micro-components/CMWarbandListEntry";
import CMPlayerListEntry from "../micro-components/CMPlayerListEntry";

const CampaignPlayers: React.FC = () => {
    const { campaign } = useCampaign();



    return (
        <div className="CampaignPlayers CampaignManager-card">
            <div className={'CampaignManager-card-title'}>
                <h2>
                    {'Players'}
                </h2>
            </div>

            <div className={'CampaignManager-card-content'}>
                <ul className={'players-list'}>
                    {campaign?.GetPlayers().map((player, idx) => (
                        <li key={idx} className={'player'}>
                            <CMPlayerListEntry player={player}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CampaignPlayers;