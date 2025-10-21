import { CampaignFactory } from "../../../factories/warband/CampaignFactory";
import { ICampaignUser, CampaignUser } from "./CampaignUser";


export interface ICampaignAnnouncement {
    announcement_id: number;
    announcement_title: string;
    announcement_content: string;       // HTML
    announcement_date: number;          // unix ts (seconds)
    announcement_author: ICampaignUser;
}

// ---------- Domain: Announcement ----------
export class CampaignAnnouncement {
    private _id = 0;
    private _title = "";
    private _html = "";
    private _dateTs = 0;
    private _author!: CampaignUser;

    // private constructor() {}

    public constructor(dto: ICampaignAnnouncement) {

        // @TODO: not all campaigns have announcements.
        // If no announcement is present in campaign BuildUser crashes
        console.log('dto');
        console.log(dto); // dto possibly empty

        this._id = dto.announcement_id;
        this._title = dto.announcement_title;
        this._html = dto.announcement_content ?? "";
        this._dateTs = dto.announcement_date ?? 0;
    }

    public async BuildUser(data : ICampaignAnnouncement) {
        const NewPlayer = await CampaignFactory.CreateCampaignUser(data.announcement_author);
        this._author = (NewPlayer);
    }

    get Id() { return this._id; }
    get Title() { return this._title; }
    get Html() { return this._html; }
    get Date() { return new Date(this._dateTs * 1000); }
    get Author() { return this._author; }
}
