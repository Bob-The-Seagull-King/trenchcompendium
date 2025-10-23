/**
 * The list entry for a campaign
 */


import React, {useState} from 'react'
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {useCampaign} from "../../../context/CampaignContext";
import LoadingOverlay from "../generics/Loading-Overlay";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {ToolsController} from "../../../classes/_high_level_controllers/ToolsController";
import {toast} from "react-toastify";



const CampaignListEntryInvitaion: React.FC = () => {

    const { campaign, reload, reloadCampaignDisplay } = useCampaign();

    const navigate = useNavigate();

    const [busy, setBusy] = useState(false);

    if ( !campaign ) {
        return (
            <div className={'CampaignListEntry CampaignListEntryInvitaion'}>
                <LoadingOverlay
                    message={'Loading Invite'}
                    variant={'small-icon'}
                />
            </div>
        );
    }


    const handleAcceptCampaignInvite = () => {
        if (campaign != null) {
            setBusy(true);

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.CampaignInviteAccept(
                    campaign.GetId()
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    toast.success('Accepted campaign invite')
                })
            })
        }
    }

    const handleDeclineCampaignInvite = () => {
        if (campaign != null) {
            setBusy(true);

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.CampaignInviteReject(
                    campaign.GetId()
                ).then(() => {
                    reloadCampaignDisplay();
                    setBusy(false);
                    toast.success('Declined campaign invite')
                })
            })
        }
    }



    return (
        <div className={'CampaignListEntry CampaignListEntryInvitaion'}>
            <div className={'fw-bold'}>{'New Campaign Invite'}</div>
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

            { busy ? (
                <>
                    <div className={'loading-wrapper'}>
                    </div>
                    <LoadingOverlay
                        message={'Loading'}
                        variant={'small-icon'}
                    />
                </>

            ): (
                <div className={'CampaignListEntry-actions'}>
                    <Button
                        variant={'primary'} className={'btn-sm me-3'}
                        onClick={handleAcceptCampaignInvite}
                    >
                        <FontAwesomeIcon icon={faCheck} className={'me-2'}/>
                        {'Accept'}
                    </Button>
                    <Button
                        variant={'secondary'} className={'btn-sm'}
                        onClick={handleDeclineCampaignInvite}
                    >
                        <FontAwesomeIcon icon={faTimes} className={'me-2'}/>
                        {'Decline'}
                    </Button>
                </div>
            )}
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