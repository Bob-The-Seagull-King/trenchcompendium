// CMCampaignInviteThis.tsx
import React, {useState} from "react";
import {useAuth} from "../../../../utility/AuthContext";
import {useCampaign} from "../../../../context/CampaignContext";
import LoadingOverlay from "../../generics/Loading-Overlay";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {ToolsController} from "../../../../classes/_high_level_controllers/ToolsController";
import {toast} from "react-toastify";
import {useWarband} from "../../../../context/WarbandContext";




const WbbCampaignInvite: React.FC = () => {

    const { userId, isLoggedIn } = useAuth()
    const [busy, setBusy] = useState(false);
    const { campaign, reload, loading, reloadCampaignDisplay } = useCampaign();
    const { warband, reloadDisplay, updateKey } = useWarband();

    // not all components can be loaded
    if( !userId || (!campaign && !loading) || !warband) {
        return null;
    }

    // Double-checking if warband is invited
    if( !loading && !campaign?.IsInvitedWarband(warband.warband_data.GetPostId()) ||
        (userId && !warband.warband_data.IsOwner(userId))
    ) {
        return null;
    }

    if( loading && userId && warband.warband_data.IsOwner(userId)) {
        return (
            <div className={`WbbCampaignInvite`}>
                <LoadingOverlay
                    message={'Loading Campaign Invites'}
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
                Tools.UserCampaignManager.CampaignWarbandAccept(
                    campaign.GetId(),
                    warband.warband_data.GetPostId()
                ).then(() => {
                    reloadCampaignDisplay();
                    reloadDisplay();
                    setBusy(false);
                    toast.success('Joined Campaign')
                })
            })
        }
    }

    const handleDeclineCampaignInvite = () => {
        if (campaign != null) {
            setBusy(true);

            console.log('cancelling wb invite');

            const Tools = ToolsController.getInstance();
            Tools.UserCampaignManager.RunInit().then(() => {
                Tools.UserCampaignManager.CampaignWarbandReject(
                    campaign.GetId(),
                    warband.warband_data.GetPostId()
                ).then(() => {
                    reloadCampaignDisplay();
                    reloadDisplay();
                    setBusy(false);
                    toast.success('Invite declined')
                })
            })
        }
    }

    return (
        <div className={`WbbCampaignInvite`}>
            <div className={'fw-bold'}>
                {'Campaign invite'}
            </div>
            <div className={'small'}>
                {'This warband is invited to a campaign. Click below to join or decline the invitation.'}
            </div>

            {busy ? (
                <>
                    <div className={'loading-wrapper'}>
                    </div>
                    <LoadingOverlay
                        message={'Loading'}
                        variant={'small-icon'}
                    />
                </>

            ) : (
                <div className={'WbbCampaignInvite-actions'}>
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
}

export default WbbCampaignInvite;