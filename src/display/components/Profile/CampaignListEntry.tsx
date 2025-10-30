/**
 * The list entry for a campaign
 */


import React from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {useCampaign} from "../../../context/CampaignContext";
import LoadingOverlay from "../generics/Loading-Overlay";
import WbbWarbandListItem from "../warband-builder/WbbWarbandListItem";
import CMPlayerSmall from "../../campaign-manager/micro-components/CMPlayerSmall";
import CMPlayerSmallVertical from "../../campaign-manager/micro-components/CMPlayerSmallVertical";
import CMWarbandSmallVertical from "../../campaign-manager/micro-components/CMWarbandSmallVertical";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";



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
        <CustomNavLink
            classes={'CampaignListEntry'}
            link={`/campaigns/${campaign?.GetId()}`}
            runfunc={() => {
                navigate(`/campaigns/${campaign?.GetId()}`)
            }}
        >
            <div className={'CampaignListEntry-name'}>
                <div className={'CampaignListEntry-name-link'} >
                    {campaign.GetName()}
                </div>
            </div>

            <div className={'CampaignListEntry-desc'}>
                {campaign.GetDescription()}
            </div>

            <div className={'CampaignListEntry-players'}>
                <div className={'players-headline'}>
                    {'Players:'}
                </div>
                <div className={'players-list'}>
                    {campaign.GetPlayers().map((player, index) => (
                        <CMPlayerSmallVertical
                            key={player.Id}
                            useNav={false}
                            player={player}
                        />
                    ))}
                </div>
            </div>

            <div className={'CampaignListEntry-warbands'}>
                <div className={'warbands-headline'}>
                    {'Warbands:'}
                </div>
                <div className={'warbands-list'}>
                    {campaign.GetWarbands().length > 0 ? (
                        <>
                            {campaign.GetWarbands().map((warband, index) => (
                                <CMWarbandSmallVertical
                                    key={index}
                                    useNav={false}
                                    warband={warband}
                                />
                            ))}
                        </>
                    ):(
                        <div className={'no-warbands'}>
                            {'No warbands joined yet'}
                        </div>
                    )}

                </div>
            </div>

            <div className={'CampaignListEntry-Summary'}>
                {'Players: '}
                {campaign.GetPlayers().length}
                {' | '}
                {'Warbands: '}
                {campaign.GetWarbands().length}
            </div>
        </CustomNavLink>
    );
}

export default CampaignListEntry