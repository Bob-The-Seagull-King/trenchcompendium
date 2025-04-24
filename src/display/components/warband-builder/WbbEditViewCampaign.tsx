import React from 'react';
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import {useWarband} from "../../../context/WarbandContext";

interface WbbEditViewCampaignProps {
    onClick?: () => void;
    isActive?: boolean;
}

const WbbEditViewCampaign: React.FC<WbbEditViewCampaignProps> = ({
         onClick,
         isActive
     }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    return (
        <div className={`WbbEditViewCampaign warband-meta ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className={'meta-headline'}>{'Campaign'}</div>

            <div className="meta-item mb-2">{warband.GetCampaignName()}</div>
            <div className="meta-item"><strong>{'Patron: '}</strong>
                { warband.GetPatronName() != '' &&
                    <>
                        {warband.GetPatron()}
                    </>
                }
                { warband.GetPatronName() == '' &&
                    <>
                        {'No patron set'}
                    </>
                }
            </div>


            <div className="meta-item"><strong>{'Victory Points: '}</strong>{warband.GetVictoryPoints()}</div>
            <div className="meta-item"><strong>{'Campaign Cycle: '}</strong>{warband.GetCampaignCycle()}</div>
            <div className="meta-item"><strong>{'Battles Fought: '}</strong>{warband.GetBattleCount()}</div>
        </div>
    );
};

export default WbbEditViewCampaign;
