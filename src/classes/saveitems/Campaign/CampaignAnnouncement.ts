import { CampaignFactory } from "../../../factories/warband/CampaignFactory";
import { ICampaignUser, CampaignUser } from "./CampaignUser";
import {renderMiniMarkdown} from "../../../utility/util";


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

    public constructor(dto: ICampaignAnnouncement) {
        this._id = dto.announcement_id;
        this._title = dto.announcement_title;
        this._html = dto.announcement_content ?? "";
        this._dateTs = dto.announcement_date ?? 0;
    }

    public async BuildUser(data : ICampaignAnnouncement, hydrate = true) {

        const NewPlayer = await CampaignFactory.CreateCampaignUser(data.announcement_author, hydrate);
        this._author = (NewPlayer);
    }

    get Id() { return this._id; }
    get Title() { return this._title; }

    /**
     * Gets the HTML as Markdown as it is saved in the DB
     * @constructor
     */
    get Html() { return this._html; }

    /**
     * Gets the HTML as rendered and safe HTML
     * @constructor
     */
    get MarkupHtml () {
        return renderMiniMarkdown(this._html);
    }
    get Date() { return new Date(this._dateTs * 1000); }

    // Return data as readable string
    get DateStr() {
        return new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',   // 'long' → "August"
            year: 'numeric',
        }).format(this.Date);
    }
    get Author() { return this._author; }

}
