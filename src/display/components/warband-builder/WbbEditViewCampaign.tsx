import React from 'react';

interface WbbEditViewCampaignProps {
    campaignName: string;
    patron: string;
    victoryPoints: number;
    campaignCycle: number;
    battlesFought: number;
}

const WbbEditViewCampaign: React.FC<WbbEditViewCampaignProps> = ({
         campaignName,
         patron,
         victoryPoints,
         campaignCycle,
         battlesFought
     }) => {

    return (
        <div className="WbbEditViewCampaign warband-meta">
            <div className={'meta-headline'}>{'Campaign'}</div>

            <div className="meta-item mb-2">{campaignName}</div>
            <div className="meta-item"><strong>{'Patron: '}</strong>
                { patron != '' &&
                    <>
                        {patron}
                    </>
                }
                { patron == '' &&
                    <>
                        {'No patron set'}
                    </>
                }
            </div>


            <div className="meta-item"><strong>{'Victory Points: '}</strong>{victoryPoints}</div>
            <div className="meta-item"><strong>{'Campaign Cycle: '}</strong>{campaignCycle}</div>
            <div className="meta-item"><strong>{'Battles Fought: '}</strong>{battlesFought}</div>
        </div>
    );
};

export default WbbEditViewCampaign;
