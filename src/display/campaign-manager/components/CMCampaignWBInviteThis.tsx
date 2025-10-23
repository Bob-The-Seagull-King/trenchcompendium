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


/**
 * This can display warband invites for the user in the campaign view.
 * -> It is however very heavy to load and run through all warbands currently
 * @constructor
 */
const CMCampaignWBInviteThis: React.FC = () => {

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

    return (
        <>
        </>

    );
}

export default CMCampaignWBInviteThis;
