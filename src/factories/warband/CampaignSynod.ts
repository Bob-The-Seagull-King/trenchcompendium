import { SYNOD } from "../../resources/api-constants";
import { ICampaignBasics, ICampaignUserInvite, ISubmitBasics, ICampaignWarbandInvite, ICampaignAnnouncementBasics } from "../../classes/saveitems/Campaign/CampaignManager";

export async function CreateNewCampaign(data : ICampaignBasics, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function UpdateCampaign(data : ICampaignBasics, submits : ISubmitBasics) {
    if (data.id == undefined) { return 400; }
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/update`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function InviteMake(data : ICampaignUserInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/invite-player`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function InviteDecline(data : ICampaignUserInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/invite-player/cancel`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function InviteAccept(data : ICampaignUserInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/invite-player/accept`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function PlayerRemove(data : ICampaignUserInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/remove-player`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function AdminChange(data : ICampaignUserInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/change-admin`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function WarbandInvite(data : ICampaignWarbandInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/invite-warband`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function WarbandAccept(data : ICampaignWarbandInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/invite-warband/accept`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function WarbandCancel(data : ICampaignWarbandInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/invite-warband/cancel`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function WarbandRemove(data : ICampaignWarbandInvite, submits : ISubmitBasics) {
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/remove-warband`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function AnnouncementCreate(data : ICampaignAnnouncementBasics, submits : ISubmitBasics) {
    if (data.campaign_id == undefined) { return null; }
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/announcement-create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function AnnouncementEdit(data : ICampaignAnnouncementBasics, submits : ISubmitBasics) {
    if (data.announcement_id == undefined) { return null; }
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/announcement-edit`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function AnnouncementDelete(data : ICampaignAnnouncementBasics, submits : ISubmitBasics) {
    if (data.announcement_id == undefined) { return null; }
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/campaigns/announcement-delete`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response;
}

export async function GetPlayerCampaigns(submits : ISubmitBasics) {
    if (submits.id == undefined) { return null; }
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/user/campaigns/`+submits.id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        }
    })

    return response;
}

export async function GetPlayerCampaignInvites(submits : ISubmitBasics) {
    if (submits.id == undefined) { return null; }
    const response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/user/campaign-invites/`+submits.id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${submits.token}`,
            'Content-Type': 'application/json',
        }
    })

    return response;
}