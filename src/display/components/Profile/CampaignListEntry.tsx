/**
 * The list entry for a campaign
 */


import React from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";

interface CampaignListEntryProps {
    campaignID: number
    campaignImageID: number
    campaignName: string
    campaignStatus: string
}

const CampaignListEntry: React.FC<CampaignListEntryProps> = ({
        campaignID,
        campaignImageID,
        campaignName,
        campaignStatus
    }) => {

    const navigate = useNavigate();


    let status_string = '';
    if( campaignStatus == 'active') {
        status_string = 'Campaign active';
    } else {
        status_string = 'Campaign closed';
    }


    return (
        <div className="CampaignListEntry">
            <CustomNavLink
                classes={'CampaignListEntry-image-wrap'}
                link={`/campaign/${campaignID}`}
                runfunc={() => {
                    navigate(`/campaign/${campaignID}`)
                }}>
                <SynodImage
                    imageId={campaignImageID}
                    className={'CampaignListEntry-image'}
                />
            </CustomNavLink>

            <div className={'CampaignListEntry-text'}>
                <CustomNavLink
                    classes={'campaign-name'}
                    link={`/campaign/${campaignID}`}
                    runfunc={() => {
                        navigate(`/campaign/${campaignID}`)
                    }}>
                    {campaignName}
                </CustomNavLink>

                <div className={'campaign-status'}>
                    {status_string}
                </div>
            </div>
        </div>
    )
}

export default CampaignListEntry