import React from 'react';
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import {useWarband} from "../../../context/WarbandContext";
import UserNotification from "../Profile/micro-components/UserNotification";
import {useAuth} from "../../../utility/AuthContext";

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
    const { userId, isLoggedIn } = useAuth()

    const Patron = warband.warband_data.GetPatron();

    return (
        <div className={`WbbEditViewCampaign warband-meta ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className={'meta-headline'}>
                {'Campaign'}
                {userId && warband.warband_data.IsOwner(userId) &&
                 warband.warband_data.GetCampaignInvites().length > 0 &&
                    <UserNotification
                        content={'!'}
                        size={'small'}
                    />
                }
            </div>

            {/*<div className="meta-item mb-2">{warband.warband_data.GetCampaignName()}</div>*/}
            <div className="meta-item"><strong>{'Patron: '}</strong>
                { (Patron != null) ? (
                    <>
                        {Patron?.GetTrueName()}
                    </>
                ): (
                    <>
                        {'No patron set'}
                    </>
                )}
            </div>

            <div className="meta-item">
                <strong>{'Victory Points: '}</strong>
                {warband.warband_data.GetVictoryPoints()}
            </div>

            <div className="meta-item">
                <strong>
                    {'Campaign Cycle: '}
                </strong>
                {warband.warband_data.GetCampaignCycleView()}
                {' / '}
                {warband.warband_data.GetCampaignCycleMax()}
            </div>
        </div>
    );
};

export default WbbEditViewCampaign;
