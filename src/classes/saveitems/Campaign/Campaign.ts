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
    campaign_latest_announcement?: ICampaignAnnouncement | null;
    campaign_warbands: ICampaignWarband[];
    campaign_warbands_invited: string[];
    campaign_players: ICampaignUser[];
    campaign_players_invited: string[];
    campaign_announcements: ICampaignAnnouncement[];
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

    constructor(data : ICampaign) {
        this._id = data.campaign_id ?? null;
        this._adminId = data.campaign_admin_id ?? null;
        this._name = data.campaign_name ?? "";
        this._description = data.campaign_description ?? "";
        this._warbandsInvited = Array.isArray(data.campaign_warbands_invited) ? [...data.campaign_warbands_invited] : [];
    }

    public async BuildWarbands(data : ICampaign) {
        
        for (let i = 0; i < data.campaign_warbands.length; i++) {
            const NewPlayer = await CampaignFactory.CreateCampaignWarband(data.campaign_warbands[i], this);
            this._warbands.push(NewPlayer);
        }
    }

    public async BuildPlayers(data : ICampaign) {
        
        for (let i = 0; i < data.campaign_players.length; i++) {
            const NewPlayer = await CampaignFactory.CreateCampaignUser(data.campaign_players[i]);
            this._players.push(NewPlayer);
        }

        this._playersInvited = Array.isArray(data.campaign_players_invited)
            ? [...data.campaign_players_invited]
            : [];
    }

    public async BuildAnnouncements(data : ICampaign) {
        
        for (let i = 0; i < data.campaign_announcements.length; i++) {
            const NewPlayer = await CampaignFactory.CreateCampaignAnnouncement(data.campaign_announcements[i]);
            this._announcements.push(NewPlayer);
        }

        if (data.campaign_latest_announcement) {
            const NewPlayer = await CampaignFactory.CreateCampaignAnnouncement(data.campaign_latest_announcement);
            this._latestAnnouncement = (NewPlayer);

        }
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
