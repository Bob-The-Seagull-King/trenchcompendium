

import React from 'react';
import {useNavigate} from "react-router-dom";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import CMContextualPopover from "../components/CMContextualPopover";
import {CampaignUser} from "../../../classes/saveitems/Campaign/CampaignUser";
import {useCampaign} from "../../../context/CampaignContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../../utility/AuthContext";

interface CMPlayerListEntryProps {
    player: CampaignUser;
}

const CMPlayerListEntry: React.FC<CMPlayerListEntryProps> = ({ player }) => {
    const navigate = useNavigate();
    const { campaign, reload, reloadCampaignDisplay, updateCampaignKey } = useCampaign();
    const { userId, isLoggedIn } = useAuth()

    if( !campaign ) {
        return (
            <>
                {/* @TODO: add loading state*/}
            </>
        );
    }

    const uid = userId; // kann number | string | null sein, je nach deinem Auth-Context

    const isSelf =
        uid != null && Number(uid) === Number(player.Id);

    const isAdmin =
        uid != null && campaign.IsAdmin(Number(uid));

    return (
        <div className="CMPlayerListEntry">
            <CustomNavLink
                classes={'user-name'}
                link={`/profile/${player.Id}`}
                runfunc={() => {
                    navigate(`/profile/${player.Id}`, {state: Date.now().toString()})
                }}>

                <div className={'pfp-wrap'}>
                    <SynodImageWithCredit
                        imageId={player.AvatarId}
                        size={'small'}
                        className={'pfp'}
                    />
                </div>
            </CustomNavLink>

            <CustomNavLink
                classes={'user-name'}
                link={`/profile/${player.Id}`}
                runfunc={() => {
                    navigate(`/profile/${player.Id}`, {state: Date.now().toString()})
                }}>
                {campaign?.IsAdmin(player.Id) &&
                    <FontAwesomeIcon icon={faCrown} className="me-2"/>
                }
                {player.Name}
            </CustomNavLink>

            <div className={'user-status'}>
                {player.GetSupporterStatus()}
            </div>

            {isSelf && !isAdmin &&
                <CMContextualPopover
                    id={`player-${player.Id}`}
                    type="player-self"
                    item={player}
                />
            }

            {userId && campaign.IsAdmin(userId) &&
                <CMContextualPopover
                    id={`player-${player.Id}`}
                    type="player"
                    item={player}
                />
            }

        </div>
    );
};

export default CMPlayerListEntry;