import { WarbandFactory } from "../../../factories/warband/WarbandFactory";
import { CampaignFactory } from "../../../factories/warband/CampaignFactory";
import { SumWarband } from "../Warband/WarbandManager";
import { ICampaignUser, CampaignUser } from "./CampaignUser";
import { ContextObject } from "../../contextevent/contextobject";
import { Campaign } from "./Campaign";

export interface ICampaignWarband {
    warband_id: number;
    faction_slug: string;
    faction_name: string;
    warband_name: string;
    warband_user: ICampaignUser;
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


// ---------- Domain: Warband ----------
export class CampaignWarband extends ContextObject {
    private _id = 0;
    private _name = "";
    private _factionSlug = "";
    private _factionName = "";
    private _owner!: CampaignUser;
    private _warband!: SumWarband | null;
    private _imageId? = 0;
    private _imageUrls?: Record<string, string>;
    private _imageSourceTitle?: string;
    private _imageSourceUrl?: string;
    private _ratingDucats = 0;
    private _ratingGlory = 0;
    private _victoryPoints = 0;
    private _parent!: Campaign;

    public constructor(data : ICampaignWarband, parent : Campaign) {
        super({
            contextdata: {},
            id: data.warband_id.toString(),
            name: data.warband_name,
            source: "",
            tags: {}
        }, null)     
        this._id = data.warband_id;
        this._name = data.warband_name;
        this._factionSlug = data.faction_slug;
        this._factionName = data.faction_name;
        this._imageId = data.warband_image?.image_id;
        this._imageUrls = data.warband_image?.urls;
        this._imageSourceTitle = data.warband_image?.source_title;
        this._imageSourceUrl = data.warband_image?.source_url;
        this._ratingDucats = data.warband_rating_ducats_current ?? 0;
        this._ratingGlory = data.warband_rating_glory_current ?? 0;
        this._victoryPoints = data.warband_vp_current ?? 0;
        this._parent = parent;
    }

    public async BuildUser(data : ICampaignWarband) {
        const NewPlayer = await CampaignFactory.CreateCampaignUser(data.warband_user);
        this._owner = (NewPlayer);
    }

    public async BuildWarband(data : ICampaignWarband) {
        this._warband = await WarbandFactory.GetWarbandPublicByID(data.warband_id)
        if (this._warband != null) {
            this._warband.warband_data.MyContext = this;
        }
    }

    get Id() { return this._id; }
    get WarbandName() { return this._name; }
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
