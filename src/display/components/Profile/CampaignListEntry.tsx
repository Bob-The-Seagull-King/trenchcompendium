/**
 * The list entry for a campaign
 */


import React from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {useCampaign} from "../../../context/CampaignContext";



const CampaignListEntry: React.FC = () => {

    const { campaign, reload } = useCampaign();

    const navigate = useNavigate();

    if( !campaign ) {
        return (
            <>
                {'Joined - can not be loaded or is loading'}
            </>
        );
    }

    return (
        <div className={'CampaignListEntry'}>
            <CustomNavLink
                classes={'CampaignListEntry-name'}
                link={`/campaign/${campaign?.GetId()}`}
                runfunc={() => {
                    navigate(`/campaign/${campaign?.GetId()}`)
                }}
            >
                {campaign.GetName()}
            </CustomNavLink>

            <div className={'CampaignListEntry-players'}>
                {'Players: '}
                {campaign.GetPlayers().map(p => p.Nickname).join(', ')}
            </div>

        </div>
    );
}

export default CampaignListEntry