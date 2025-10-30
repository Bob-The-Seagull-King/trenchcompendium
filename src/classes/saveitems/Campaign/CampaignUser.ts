import { UserFactory } from "../../../factories/synod/UserFactory";
import { ISiteUserPublic, SiteUserPublic } from "../../user_synod/user_public";
import {ROUTES} from "../../../resources/routes-constants";

export interface ICampaignUser {
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

// ---------- Domain: User ----------
export class CampaignUser {
    private _id: number;
    private _nickname: string;
    private _isPremium: boolean;
    private _avatarUrls?: Record<string, string>;
    private _avatarSourceTitle?: string;
    private _avatarSourceUrl?: string;
    private _avatarId = 0;       // e.g. WP attachment id
    private _userObject : SiteUserPublic | null = null;
    private _userBasic : ISiteUserPublic | null = null;

    public constructor(
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
    
    public async BuildSelfUser(hydrate = true) {
        if (hydrate) {
            const MyUser = await UserFactory.CreatePublicUserByID(this.Id);
            this._userObject = MyUser;
        } else {
            const MyUser = await UserFactory.GetPublicUserBasicByID(this.Id);
            this._userBasic = MyUser;
        }
    }

    get Id() { return this._id; }
    get Nickname() { return this._nickname; }
    get Name() { return this._nickname; }
    get IsPremium() { return this._isPremium; }
    get AvatarUrls() { return this._avatarUrls; }
    get AvatarSourceTitle() { return this._avatarSourceTitle; }
    get AvatarSourceUrl() { return this._avatarSourceUrl; }
    get AvatarId() { return this._avatarId; }
    get UserPublic() { return this._userObject; }
    get UserPublicBasic() { return this._userBasic; }

    get ProfileUrl () {
        return window.location.origin+'/profile/' + this.Id;
    }

    // --- Complex Getters ---
    GetSupporterStatus () : string {
        if( this.IsPremium ) {
            return 'Supporter';
        } else {
            return 'Free Member'
        }
    }

    // --- Getters from SiteUser ---


}