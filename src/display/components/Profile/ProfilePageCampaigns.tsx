// ProfilePageCampaigns.tsx
import React from "react";
import { CampaignProvider } from "../../../context/CampaignContext";
import { SiteUser } from "../../../classes/user_synod/site_user";
import { SiteUserPublic } from "../../../classes/user_synod/user_public";
import CampaignListEntry from "./CampaignListEntry";
import CampaignListEntryInvitaion from "./CampaignListEntryInvitaion";

interface ProfilePageCampaignsProps {
    userData: SiteUser | SiteUserPublic | null;
}

// Helper type guards
function hasJoinedGetter(
    u: SiteUser | SiteUserPublic | null
): u is SiteUser | SiteUserPublic {
    return !!u && typeof (u as any).GetCampaignIDList === "function";
}
function hasInvitesGetter(u: SiteUser | SiteUserPublic | null): u is SiteUser {
    return !!u && typeof (u as any).GetCampaignInviteIDList === "function";
}

const ProfilePageCampaigns: React.FC<ProfilePageCampaignsProps> = ({ userData }) => {
    if (!userData) return null;

    const joinedIds = hasJoinedGetter(userData) ? userData.GetCampaignIDList() : [];
    const inviteIds = hasInvitesGetter(userData) ? userData.GetCampaignInviteIDList() : [];

    const hasJoined = joinedIds.length > 0;
    const hasInvites = inviteIds.length > 0;

    return (
        <div className="ProfilePageCampaigns">
            <div className="profile-card">
                <div className="profile-card-head">Campaigns</div>

                <div className="profile-card-content">
                    {hasInvites && (
                        <>
                            <ul className="campaigns-list">
                                {inviteIds.map((id) => (
                                    <li key={`inv-${id}`} className="campaign invited">
                                        <CampaignProvider campaignId={id} hydrate={false}>
                                            <CampaignListEntryInvitaion/>
                                        </CampaignProvider>
                                    </li>
                                ))}
                            </ul>

                            {hasJoined &&
                                <div className={'spacer-20'}></div>
                            }
                        </>

                    )}

                    {hasJoined && (
                        <ul className="campaigns-list">
                            {joinedIds.map((id) => (
                                <li key={id} className="campaign">
                                    <CampaignProvider campaignId={id}>
                                        <CampaignListEntry/>
                                    </CampaignProvider>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!hasJoined && !hasInvites && (
                        <div className="campaigns-list-empty">No campaigns found for this user.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePageCampaigns;
