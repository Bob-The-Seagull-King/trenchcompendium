/**
 * The list entry for a campaign
 */


import React from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {useCampaign} from "../../../context/CampaignContext";
import LoadingOverlay from "../generics/Loading-Overlay";



const CampaignListEntry: React.FC = () => {

    const { campaign, reload } = useCampaign();

    const navigate = useNavigate();

    if( !campaign ) {
        return (
            <div className={'CampaignListEntry loading'}>
                <LoadingOverlay
                    message={'Loading Campaign'}
                    variant={'small-icon'}
                />
            </div>
        );
    }

    return (
        <div className={'CampaignListEntry'}>
            <CustomNavLink
                classes={'CampaignListEntry-name'}
                link={`/campaigns/${campaign?.GetId()}`}
                runfunc={() => {
                    navigate(`/campaigns/${campaign?.GetId()}`)
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