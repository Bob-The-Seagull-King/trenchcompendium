// classes/saveitems/Campaign/Campaign.ts

// ---------- API DTOs (shapes returned by your WP REST API) ----------
export interface CampaignUserDTO {
    id?: number;               // in campaign_players
    user_id?: number;          // in warband_user
    nickname: string;
    is_premium?: boolean;
    profile_picture?: {
        id: number;
        image_id: number;
        urls: Record<string, string>;     // sizes → url
        source_title?: string;
        source_url?: string;
    };
}

export interface CampaignWarbandDTO {
    warband_id: number;
    faction_slug: string;
    faction_name: string;
    warband_name: string;
    warband_user: CampaignUserDTO;
    warband_image?: {
        image_id: number;
        urls: Record<string, string>;
        source_title?: string;
        source_url?: string;
    };
    warband_rating_ducats_current: number;
    warband_rating_glory_current: number;
    warband_vp_current: number;
}

export interface CampaignAnnouncementDTO {
    announcement_id: number;
    announcement_title: string;
    announcement_content: string;       // HTML
    announcement_date: number;          // unix ts (seconds)
    announcement_author: CampaignUserDTO;
}

export interface CampaignResponseDTO {
    campaign_id: number;
    campaign_admin_id: string;
    campaign_name: string;
    campaign_description: string;
    campaign_latest_announcement?: CampaignAnnouncementDTO | null;
    campaign_warbands: CampaignWarbandDTO[];
    campaign_warbands_invited: string[];
    campaign_players: CampaignUserDTO[];
    campaign_players_invited: string[];
    campaign_announcements: CampaignAnnouncementDTO[];
}

// ---------- Domain: User ----------
export class CampaignUser {
    private _id: number;
    private _nickname: string;
    private _isPremium: boolean;
    private _avatarUrls?: Record<string, string>;
    private _avatarSourceTitle?: string;
    private _avatarSourceUrl?: string;
    private _avatarId = 0;       // e.g. WP attachment id

    private constructor(
        id: number,
        nickname: string,
        isPremium: boolean,
        avatarUrls?: Record<string, string>,
        avatarSourceTitle?: string,
        avatarSourceUrl?: string,
        avatarId?: number,
    ) {
        this._id = id ?? 0;
        this._nickname = nickname;
        this._isPremium = isPremium;
        this._avatarUrls = avatarUrls;
        this._avatarSourceTitle = avatarSourceTitle;
        this._avatarSourceUrl = avatarSourceUrl;
        this._avatarId = avatarId ?? 0;
    }

    static FromApi(dto: CampaignUserDTO): CampaignUser {
        const id = (dto.id ?? dto.user_id)!; // API provides either id or user_id
        return new CampaignUser(
            id,
            dto.nickname,
            !!dto.is_premium,
            dto.profile_picture?.urls,
            dto.profile_picture?.source_title,
            dto.profile_picture?.source_url,
            dto.profile_picture?.image_id,
        );
    }

    get Id() { return this._id; }
    get Nickname() { return this._nickname; }
    get Name() { return this._nickname; }
    get IsPremium() { return this._isPremium; }
    get AvatarUrls() { return this._avatarUrls; }
    get AvatarSourceTitle() { return this._avatarSourceTitle; }
    get AvatarSourceUrl() { return this._avatarSourceUrl; }
    get AvatarId() { return this._avatarId; }

    // --- Complex Getters ---

    GetSupporterStatus () : string {
        if( this.IsPremium ) {
            return 'Supporter';
        } else {
            return 'Free Member'
        }
    }

}

// ---------- Domain: Announcement ----------
export class CampaignAnnouncement {
    private _id = 0;
    private _title = "";
    private _html = "";
    private _dateTs = 0;
    private _author!: CampaignUser;

    // private constructor() {}

    static FromApi(dto: CampaignAnnouncementDTO): CampaignAnnouncement {
        const a = new CampaignAnnouncement();
        a._id = dto.announcement_id;
        a._title = dto.announcement_title;
        a._html = dto.announcement_content ?? "";
        a._dateTs = dto.announcement_date ?? 0;
        a._author = CampaignUser.FromApi(dto.announcement_author);
        return a;
    }

    get Id() { return this._id; }
    get Title() { return this._title; }
    get Html() { return this._html; }
    get Date() { return new Date(this._dateTs * 1000); }
    get Author() { return this._author; }
}

// ---------- Domain: Warband ----------
export class CampaignWarband {
    private _id = 0;
    private _name = "";
    private _factionSlug = "";
    private _factionName = "";
    private _owner!: CampaignUser;
    private _imageId? = 0;
    private _imageUrls?: Record<string, string>;
    private _imageSourceTitle?: string;
    private _imageSourceUrl?: string;
    private _ratingDucats = 0;
    private _ratingGlory = 0;
    private _victoryPoints = 0;

    // private constructor() {}

    static FromApi(dto: CampaignWarbandDTO): CampaignWarband {
        const w = new CampaignWarband();
        w._id = dto.warband_id;
        w._name = dto.warband_name;
        w._factionSlug = dto.faction_slug;
        w._factionName = dto.faction_name;
        w._owner = CampaignUser.FromApi(dto.warband_user);
        w._imageId = dto.warband_image?.image_id;
        w._imageUrls = dto.warband_image?.urls;
        w._imageSourceTitle = dto.warband_image?.source_title;
        w._imageSourceUrl = dto.warband_image?.source_url;
        w._ratingDucats = dto.warband_rating_ducats_current ?? 0;
        w._ratingGlory = dto.warband_rating_glory_current ?? 0;
        w._victoryPoints = dto.warband_vp_current ?? 0;
        return w;
    }

    get Id() { return this._id; }
    get Name() { return this._name; }
    get FactionSlug() { return this._factionSlug; }
    get FactionName() { return this._factionName; }
    get Owner() { return this._owner; }
    get ImageId() { return this._imageId; }
    get ImageUrls() { return this._imageUrls; }
    get RatingDucats() { return this._ratingDucats; }
    get RatingGlory() { return this._ratingGlory; }
    get VictoryPoints() { return this._victoryPoints; }

    get PlayerId() { return this._owner.Id; }
    get PlayerName() { return this._owner.Nickname; }

    get PlayerImageId() { return this._owner.AvatarId; }
}

// ---------- Domain: Campaign (root) ----------
export class Campaign {
    // Core fields
    private _id: number | null = null;
    private _adminId: string | null = null;
    private _name = "";
    private _description = "";

    // Relationships
    private _warbands: CampaignWarband[] = [];
    private _warbandsInvited: string[] = [];
    private _players: CampaignUser[] = [];
    private _playersInvited: string[] = [];
    private _announcements: CampaignAnnouncement[] = [];
    private _latestAnnouncement: CampaignAnnouncement | null = null;

    constructor() {
        // Keep empty default instance; Context will call hydrate() later.
    }

    // --- Mapper: turn API DTO into a fully-initialized domain object (in-place) ---
    public hydrate(dto: CampaignResponseDTO) {
        // Basic fields
        this._id = dto.campaign_id ?? null;
        this._adminId = dto.campaign_admin_id ?? null;
        this._name = dto.campaign_name ?? "";
        this._description = dto.campaign_description ?? "";

        // Warbands
        this._warbands = Array.isArray(dto.campaign_warbands)
            ? dto.campaign_warbands.map(CampaignWarband.FromApi)
            : [];

        // Invites
        this._warbandsInvited = Array.isArray(dto.campaign_warbands_invited)
            ? [...dto.campaign_warbands_invited]
            : [];

        // Players
        this._players = Array.isArray(dto.campaign_players)
            ? dto.campaign_players.map(CampaignUser.FromApi)
            : [];

        this._playersInvited = Array.isArray(dto.campaign_players_invited)
            ? [...dto.campaign_players_invited]
            : [];

        // Announcements
        this._announcements = Array.isArray(dto.campaign_announcements)
            ? dto.campaign_announcements.map(CampaignAnnouncement.FromApi)
            : [];

        this._latestAnnouncement = dto.campaign_latest_announcement
            ? CampaignAnnouncement.FromApi(dto.campaign_latest_announcement)
            : null;
    }

    // --- Public getters UI can use ---
    public GetId(): number | null { return this._id; }
    public GetAdminId(): string | null { return this._adminId; }
    public GetName(): string { return this._name; }
    public GetDescription(): string { return this._description; }

    public GetWarbands(): CampaignWarband[] { return this._warbands; }
    public GetPlayers(): CampaignUser[] { return this._players; }
    public GetAnnouncements(): CampaignAnnouncement[] { return this._announcements; }
    public GetLatestAnnouncement(): CampaignAnnouncement | null { return this._latestAnnouncement; }

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
        if (Number.isNaN(adminIdNum)) return false;  // ungültige Zahl

        return adminIdNum === userID;
    }


    public InvitePlayers( ids: string[]) {

        console.log('@TODO: invite players here');
    }

    public CreateAnnouncement (title: string, content: string) {

        console.log('@TODO: create announcement with');
        console.log(title);
        console.log(content);
    }

    /**
    * This returns a dummy game
    * @TODO
    */
    GetDummyGame () {
        return {
            warbands: this.GetWarbands(),
            date: '04.07.2025'
        };
    }
}


// export class Campaign {
//     id: string;
//     name: string;
//     players: any[];
//     warbands: any[];
//     created: Date;
//
//     constructor(data?: Partial<Campaign>) {
//         this.id = data?.id || '';
//         this.name = data?.name || 'New Campaign';
//         this.players = data?.players || [];
//         this.warbands = data?.warbands || [];
//         this.created = data?.created ? new Date(data.created) : new Date();
//     }
//
//
//     /**
//      * Returns the ID of the Campaign
//      *
//      */
//     GetID () {
//         return this.id;
//     }
//
//     /**
//      * Get Campaign Name
//      */
//     GetName () {
//         return this.name;
//     }
//
//     /**
//      * Returns the user ID of the Admin
//      * @TODO
//      */
//     GetAdminID () {
//         return 3;
//     }
//
//     /**
//      * Returns the username of the admin
//      * @TODO
//      */
//     GetAdminUserName () {
//         return 'Emitoo'
//     }
//
//     /**
//      * Is the user with this ID the admin of the campaign?
//      *
//      * @param ID
//      */
//     IsAdmin ( ID: number ) {
//         if( ID === this.GetAdminID() ) {
//             return true;
//         }
//         return false;
//     }
//
//     /**
//      * Returns the global campaign notes as string
//      */
//     GetDescription () {
//         return "This is a test campaign created for demonstration purposes.\n" +
//             "Feel free to explore all features without consequences.\n" +
//             "Data will not be saved permanently.";
//     }
//
//     /**
//      * Return the campaign warbands
//      * @TODO - this is dummy data
//      */
//     GetWarbands () {
//         return [
//             {
//                 warbandName: 'Serpentis Voluptia',
//                 warbandImageId: 2905,
//                 warbandId: 3,
//                 warbandImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Black-Grail-Dirge-Faction-Image.jpg',
//                 playerName: 'Player 1 name',
//                 playerProfileUrl: 'lorem',
//                 playerId: 3,
//                 playerImageId: 2828,
//                 playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Chorister-Profile-Picture.jpg',
//                 warbandRating: '699 Ducats | 2 Glory',
//                 warbandRound: 2
//             },
//             {
//                 warbandName: 'The knights of the holy father and son',
//                 warbandImageId: 2877,
//                 warbandId: 3,
//                 warbandImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/05/Court-of-the-seven-headed-serpent-Faction-Image-2.jpg',
//                 playerName: 'Player 2 name',
//                 playerProfileUrl: 'lorem',
//                 playerId: 3,
//                 playerImageId: 2818,
//                 playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Yuzbasi-Captain-Profile-Picture-300x300.jpg',
//                 warbandRating: '680 Ducats | 0 Glory',
//                 warbandRound: 3
//             }
//         ]
//     }
//
//     /**
//      * This returns a dummy game
//      * @TODO
//      */
//     GetDummyGame () {
//         return {
//             warbands: this.GetWarbands(),
//             date: '04.07.2025'
//         };
//     }
//
//     /**
//      * Get Campaign players info
//      * @TODO - this is dummy data
//      *
//      */
//     GetPlayers () {
//         return [
//             {
//                 playerName: 'Player 1 name',
//                 playerProfileUrl: 'lorem',
//                 playerId: 3,
//                 playerImageId: 2828,
//                 playerStatus: 'Free Member',
//                 playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Chorister-Profile-Picture.jpg',
//             },
//             {
//                 playerName: 'Player 2 name',
//                 playerProfileUrl: 'lorem',
//                 playerId: 3,
//                 playerImageId: 2818,
//                 playerStatus: 'Supporter',
//                 playerImageURL: 'https://synod.trench-companion.com/wp-content/uploads/2025/07/Yuzbasi-Captain-Profile-Picture-300x300.jpg',
//             }
//         ]
//     }
//
//     /**
//      * This should create an announcement for this campaign at the current timestamp
//      * @TODO: add functionality
//      */
//     public CreateAnnouncement ( announcement: string ) {
//         // @TODO: create announcement here
//
//         return;
//     }
//
//     /**
//      * Returns the most recent announcement for this campaign with date
//      * @TODO:
//      */
//     public GetLatestAnnouncement () {
//
//         return ({
//             date: '17.05.2025',
//             title: 'Welcome',
//             text: "Welcome to the new campaign!\n" +
//                 "Here are the initial rules:\n" +
//                 "- No cheating\n" +
//                 "- Report all bugs\n" +
//                 "- Have fun!\n" +
//                 "Let the games begin!"
//         });
//     }
//
//     /**
//      * Invita players to a campaign
//      *
//      * @TODO
//      */
//     public InvitePlayers(playerIDs: string[]) {
//         alert(playerIDs.join(', '));
//         // @TODO
//         return;
//     }
// }
