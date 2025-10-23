// CMCampaignInviteThis.tsx
import React, {useState} from "react";
import {useCampaign} from "../../../context/CampaignContext";
import {useAuth} from "../../../utility/AuthContext";
import LoadingOverlay from "../../components/generics/Loading-Overlay";
import {SiteUser} from "../../../classes/user_synod/site_user";
import {SiteUserPublic} from "../../../classes/user_synod/user_public";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {ToolsController} from "../../../classes/_high_level_controllers/ToolsController";
import {toast} from "react-toastify";



const CMCampaignInviteThis: React.FC = () => {

    const { campaign, reload, reloadCampaignDisplay } = useCampaign();

    const { userId, isLoggedIn } = useAuth()

    const [busy, setBusy] = useState(false);
    const [isInvited, setIsInvited] = useState(false);

    if( !userId || !campaign) {
        return null;
    }

    if(!campaign.IsInvited(userId)) {
        return null;
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
                    toast.success('Joined Campaign')
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
                    toast.success('Invite declined')
                })
            })
        }
    }


    return (
        <div className={`CMCampaignInviteThis`}>
            <div className={'fw-bold'}>
                {'Campaign invite'}
            </div>
            <div className={'small'}>
                {'You are invited to this campaign. Click below to join or decline the invitation.'}
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
                        {'Join'}
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
};

export default CMCampaignInviteThis;
