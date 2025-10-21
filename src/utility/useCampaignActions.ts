import { useCampaign } from "../context/CampaignContext";
import { useCallback } from "react";
import {InviteDecline, InviteMake, PlayerRemove} from "../factories/warband/CampaignSynod";

function getToken(): string | null {
    return localStorage.getItem("jwtToken");
}

type InviteSummary = {
    ok: number[];
    failed: { id: number; reason: unknown }[];
};

export function useCampaignActions() {
    const { campaign, reload } = useCampaign();

    /**
     * Invite a single player.
     * Optional opts.skipReload um das automatische Reload zu unterdrücken
     * (praktisch für Batch-Invites).
     */
    const invitePlayer = useCallback(
        async (playerId: number, opts?: { skipReload?: boolean }) => {
            if (!campaign) throw new Error("Campaign not loaded.");
            const token = getToken();
            if (!token) throw new Error("Missing auth token.");

            const res = await InviteMake(
                { campaign_id: campaign.GetId(), player_id: playerId },
                { token }
            );

            if (res?.status === 200 && !opts?.skipReload) {
                await reload();
            }
            return res;
        },
        [campaign, reload]
    );

    /**
     * Invite multiple players:
     * - de-dupe
     * - parallel ausführen
     * - am Ende genau 1x reload, wenn etwas erfolgreich war
     */
    const invitePlayers = useCallback(
        async (playerIds: number[]): Promise<InviteSummary> => {
            if (!campaign) throw new Error("Campaign not loaded.");

            // De-dupe ohne Set/Spread (kompatibel mit ES5 Targets)
            const uniqueIds = playerIds
                .filter((id, idx, arr) => arr.indexOf(id) === idx)
                .filter((id) => typeof id === "number" && Number.isFinite(id));

            if (uniqueIds.length === 0) {
                return { ok: [], failed: [] };
            }

            const results = await Promise.allSettled(
                uniqueIds.map((id) => invitePlayer(id, { skipReload: true }))
            );

            const summary: InviteSummary = { ok: [], failed: [] };
            results.forEach((r, i) => {
                const id = uniqueIds[i];
                if (r.status === "fulfilled" && r.value?.status === 200) {
                    summary.ok.push(id);
                } else {
                    summary.failed.push({
                        id,
                        reason: r.status === "rejected" ? r.reason : r.value,
                    });
                }
            });

            if (summary.ok.length > 0) {
                await reload();
            }
            return summary;
        },
        [campaign, reload, invitePlayer]
    );

    /**
     * Cancel a pending invite for a given player.
     * Admin-only action; removes the player from the 'invited' list.
     */
    const cancelInvite = useCallback(
        async (playerId: number, opts?: { skipReload?: boolean }) => {
            if (!campaign) throw new Error("Campaign not loaded.");
            const token = getToken();
            if (!token) throw new Error("Missing auth token.");

            const res = await InviteDecline(
                { campaign_id: campaign.GetId(), player_id: playerId },
                { token }
            );

            // Auto-reload unless explicitly skipped
            if (res?.status === 200 && !opts?.skipReload) {
                await reload();
            }
            return res;
        },
        [campaign, reload]
    );

    const removePlayer = useCallback(
        async (playerId: number, opts?: { skipReload?: boolean }) => {
            if (!campaign) throw new Error("Campaign not loaded.");
            const token = getToken();
            if (!token) throw new Error("Missing auth token.");

            const res = await PlayerRemove(
                { campaign_id: campaign.GetId(), player_id: playerId },
                { token }
            );

            if (res?.status === 200 && !opts?.skipReload) {
                await reload();
            }
            return res;
        },
        [campaign, reload]
    );

    return { invitePlayer, invitePlayers, cancelInvite, removePlayer };
}
