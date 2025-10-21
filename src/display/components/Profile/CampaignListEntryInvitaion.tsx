/**
 * The list entry for a campaign
 */


import React from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {useCampaign} from "../../../context/CampaignContext";



const CampaignListEntryInvitaion: React.FC = () => {

    const { campaign, reload } = useCampaign();

    const navigate = useNavigate();


    // let status_string = '';
    // if( campaignStatus == 'active') {
    //     status_string = 'Campaign active';
    // } else {
    //     status_string = 'Campaign closed';
    // }


    if ( !campaign ) {
        return (
            <>
                {'Invited - can not be loaded or is loading'}
            </>
        );

    }

    return (
        <div className={'CampaignListEntry CampaignListEntryInvitaion'}>
            <CustomNavLink
                classes={'CampaignListEntry-name'}
                link={`/campaign/${campaign?.GetId()}`}
                runfunc={() => {
                    navigate(`/campaign/${campaign?.GetId()}`)
                }}
            >
                Inv: {campaign.GetName()}
            </CustomNavLink>
        </div>
    );

    // return (
    //     <div className="CampaignListEntry">
    //         <CustomNavLink
    //             classes={'CampaignListEntry-image-wrap'}
    //             link={`/campaign/${campaignID}`}
    //             runfunc={() => {
    //                 navigate(`/campaign/${campaignID}`)
    //             }}>
    //             <SynodImage
    //                 imageId={campaignImageID}
    //                 className={'CampaignListEntry-image'}
    //             />
    //         </CustomNavLink>
    //
    //         <div className={'CampaignListEntry-text'}>
    //             <CustomNavLink
    //                 classes={'campaign-name'}
    //                 link={`/campaign/${campaignID}`}
    //                 runfunc={() => {
    //                     navigate(`/campaign/${campaignID}`)
    //                 }}>
    //                 {campaignName}
    //             </CustomNavLink>
    //
    //             <div className={'campaign-status'}>
    //                 {status_string}
    //             </div>
    //         </div>
    //     </div>
    // )
}

export default CampaignListEntryInvitaion