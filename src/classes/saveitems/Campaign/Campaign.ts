// classes/saveitems/Campaign/Campaign.ts

import { CampaignFactory } from "../../../factories/warband/CampaignFactory";
import { CampaignAnnouncement, ICampaignAnnouncement } from "./CampaignAnnouncement";
import { ICampaignUser, CampaignUser } from "./CampaignUser";
import { ICampaignWarband, CampaignWarband } from "./CampaignWarband";

export interface ICampaign {
    campaign_id: number;
    campaign_admin_id: string;
    campaign_name: string;
    campaign_description: string;
    campaign_latest_announcement?: ICampaignAnnouncement;
    campaign_warbands: ICampaignWarband[];
    campaign_warbands_invited: string[];
    campaign_players: ICampaignUser[];
    campaign_players_invited: ICampaignUser[];
    campaign_players_invitable: ICampaignUser[];
    campaign_announcements: ICampaignAnnouncement[];
}

export class Campaign {
    // Core fields
    private _id: number;
    private _adminId: string | null = null;
    private _name = "";
    private _description = "";

    // Relationships
    private _warbands: CampaignWarband[] = [];
    private _warbandsInvited: string[] = [];
    private _players: CampaignUser[] = [];
    private _playersInvited: CampaignUser[] = [];
    private _playersInvitable: CampaignUser[] = [];
    private _announcements: CampaignAnnouncement[] = [];
    private _latestAnnouncement: CampaignAnnouncement | null = null;

    constructor(data : ICampaign) {

        this._id = data.campaign_id ?? null;
        this._adminId = data.campaign_admin_id ?? null;
        this._name = data.campaign_name ?? "";
        this._description = data.campaign_description ?? "";
        this._warbandsInvited = Array.isArray(data.campaign_warbands_invited) ? [...data.campaign_warbands_invited] : [];
    }

    public async BuildWarbands(data : ICampaign, hydrate = true) {
        
        for (let i = 0; i < data.campaign_warbands.length; i++) {
            const NewPlayer = await CampaignFactory.CreateCampaignWarband(data.campaign_warbands[i], this, hydrate);
            this._warbands.push(NewPlayer);
        }
    }

    public async BuildPlayers(data : ICampaign, hydrate = true) {

        // Parallel faszer; Sorting stays via map()
        const [joined, invited, invitable] = await Promise.all([
            Promise.all(
                (data.campaign_players ?? []).map((u) =>
                    CampaignFactory.CreateCampaignUser(u, hydrate)
                )
            ),
            Promise.all(
                (data.campaign_players_invited ?? []).map((u) =>
                    CampaignFactory.CreateCampaignUser(u, hydrate)
                )
            ),
            Promise.all(
                (data.campaign_players_invitable ?? []).map((u) =>
                    CampaignFactory.CreateCampaignUser(u, hydrate)
                )
            ),
        ]);

        this._players = joined;
        this._playersInvited = invited;
        this._playersInvitable = invitable;
    }

    public async BuildAnnouncements(data : ICampaign, hydrate = true) {
        for (let i = 0; i < data.campaign_announcements.length; i++) {
            const NewAnnouncement = await CampaignFactory.CreateCampaignAnnouncement(data.campaign_announcements[i], hydrate);
            if (NewAnnouncement != null) {
                this._announcements.push(NewAnnouncement);
            }
        }


        //@Lane, please check. This is my attempt at fixing the latest announcement error
        // -> Somehow latest announcement sometimes is sometimes an empty array which is truthy and causing the crash
        const latestRaw: any = (data as any).campaign_latest_announcement;

        let latestObj: any = null;
        if (Array.isArray(latestRaw)) {
            console.warn('campaign_latest_announcement unexpectedly is array, taking first element', latestRaw);
            latestObj = latestRaw[0] ?? null;
        } else if (latestRaw && typeof latestRaw === 'object') {
            latestObj = latestRaw;
        } else if (latestRaw != null) {
            console.warn('campaign_latest_announcement malformed:', latestRaw);
        }

        if (latestObj) {
            const latest = await CampaignFactory.CreateCampaignAnnouncement(latestObj, hydrate);
            this._latestAnnouncement = latest ?? null;
        } else {
            this._latestAnnouncement = null;
        }
    }


    // --- Public getters UI can use ---
    public GetId(): number { return this._id; }
    public GetAdminId(): string | null { return this._adminId; }
    public GetName(): string { return this._name; }
    public GetDescription(): string { return this._description; }

    public GetWarbands(): CampaignWarband[] { return this._warbands; }
    public GetWarbandIDList(): number[] { return this._warbands.map(item => (item.WarbandID)); }
    public GetPlayers(): CampaignUser[] { return this._players; }
    public GetAnnouncements(): CampaignAnnouncement[] { return this._announcements; }
    public GetLatestAnnouncement(): CampaignAnnouncement | null { return this._latestAnnouncement; }
    public GetInvitedPlayers(): CampaignUser[] { return this._playersInvited; }
    public GetInvitablePlayers(): CampaignUser[] { return this._playersInvitable; }

    /**
     * Returns a list of players that can be or have been invited or joined
     * - sorted by username
     */
    public GetInvitablePlayers_full(): CampaignUser[] {
        // Merge joined, invited, invitable (dedupe by user id)
        const merged = new Map<number, CampaignUser>();

        // helper to add unique users while preserving first occurrence
        const addUnique = (arr: CampaignUser[]) => {
            for (const u of arr) {
                const key = Number(u.Id);
                if (!merged.has(key)) merged.set(key, u);
            }
        };

        addUnique(this._players);          // joined
        addUnique(this._playersInvited);   // invited
        addUnique(this._playersInvitable); // can be invited

        // sort alphabetically by nickname (case-insensitive), then by id as tiebreaker
        return Array.from(merged.values()).sort((a, b) => {
            const nameA = (a.Nickname ?? "").trim();
            const nameB = (b.Nickname ?? "").trim();
            const cmp = nameA.localeCompare(nameB, undefined, {
                sensitivity: "base",
                numeric: true,
            });
            if (cmp !== 0) return cmp;
            return Number(a.Id) - Number(b.Id);
        });
    }


    // --- Convenience helpers ---
    public GetWarbandById(id: number): CampaignWarband | undefined {
        return this._warbands.find(w => w.Id === id);
    }
    public GetPlayerById(id: number | string): CampaignUser | undefined {
        return this._players.find(p => p.Id === id);
    }

    // Optional: quick loaded flag
    public IsLoaded(): boolean {
        return this._id !== null && this._name.length > 0;
    }
    public IsAdmin (userID: number) : boolean {
        const adminIdStr = this.GetAdminId();        // string | null

        if (adminIdStr == null) return false;        // null-safe

        const adminIdNum = parseInt(adminIdStr, 10); // string -> number
        if (Number.isNaN(adminIdNum)) return false;  // invalid number

        return adminIdNum === userID;
    }

    /**
     * Check if a player is invited to this campaign
     * @param userID
     */
    public IsInvited(userID: number): boolean {
        return this._playersInvited.some(u => u.Id === userID);
    }

    /**
     * Check if a player joined this campaign
     * @param userID
     */
    public IsJoined(userID: number): boolean {
        return this._players.some(u => u.Id === userID);
    }

    /**
     * Is a warband invited to this campaign?
     * @param warband_id
     */
    public IsInvitedWarband(warband_id : number) : boolean {
        for (let i = 0; i < this._warbandsInvited.length; i++) {
            const pl : number = parseInt(this._warbandsInvited[i])
            if (pl == warband_id && !Number.isNaN(pl)) { return true; }
        }  
        return false;
    }
    public IsJoinedWarband(warband_id : number) : boolean {
        for (let i = 0; i < this.GetWarbandIDList().length; i++) {
            const pl : number = this.GetWarbandIDList()[i]
            if (pl == warband_id && !Number.isNaN(pl)) { return true; }
        }
        return false;
    }


}

