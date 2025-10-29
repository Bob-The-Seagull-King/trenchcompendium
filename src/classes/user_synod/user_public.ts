import { SynodProfilePicData } from "../_high_level_controllers/SynodImageCache";
import { IUserWarband, UserWarband } from "../saveitems/Warband/UserWarband";
import { IAchievement } from "./user_achievements";
import {ROUTES} from "../../resources/routes-constants";
import {SYNOD} from "../../resources/api-constants";
import { UserFactory } from "../../factories/synod/UserFactory";
import { WarbandFactory } from "../../factories/warband/WarbandFactory";
import { IFriend, ISynodWarband, ProfilePictureOption } from "./site_user";
import { AchievementFactory } from "../../factories/synod/AchievementFactory";
import { SumWarband } from "../saveitems/Warband/WarbandManager";

interface ISiteUserPublic {
    id: number,
    nickname : string,
    achievements: IAchievement[],
    friends: IFriend[],
    warbands: ISynodWarband[],
    campaigns: number[],
    profile_picture: SynodProfilePicData,
    is_premium: boolean
}

class SiteUserPublic {
    ID : number;
    Nickname : string;
    Achievements : IAchievement[] = []
    Friends : IFriend[] = []
    BuiltFriends : SiteUserPublic[] = []
    Requests : IFriend[] = [];
    Warbands : SumWarband[] = [];
    ProfilePic : SynodProfilePicData;
    Campaigns : number[] = []
    BuiltRequests: SiteUserPublic[] = [];
    Premium : boolean;
    SelfData : ISiteUserPublic;
    
    public constructor(data: ISiteUserPublic)
    {
        this.ID = data.id;
        this.Nickname = data.nickname;
        this.ProfilePic = data.profile_picture;
        this.Friends = data.friends;
        this.Achievements = data.achievements;
        this.Premium = data.is_premium;
        this.SelfData = data;

        this.Campaigns = Array.isArray(data.campaigns)
            ? data.campaigns
                .map((v) => Number(v))
                .filter((v) => Number.isFinite(v))
            : [];

    }

    public async BuildFriends() {
        this.BuiltFriends = []
        for (let i = 0; i < this.SelfData.friends.length; i++) {
            const newFriend = await UserFactory.CreatePublicUserByID(this.SelfData.friends[i].id)
            if (newFriend != null && this.BuiltFriends.filter((item) => item.ID == newFriend.ID ).length == 0) {
                this.BuiltFriends.push(newFriend);
            }
        }
    }
    
    public async ReBuildFriends() {
        this.BuiltFriends = []
        for (let i = 0; i < this.SelfData.friends.length; i++) {
            const newFriend = await UserFactory.CreatePublicUserByID(this.SelfData.friends[i].id)
            if (newFriend != null && this.BuiltFriends.filter((item) => item.ID == newFriend.ID ).length == 0) {
                this.BuiltFriends.push(newFriend);
            }
        }
    }

    public GetCampaignIDList(): number[] {
        return [...this.Campaigns]; // Kopie zurückgeben
    }

    public async BuildWarbands(data: ISiteUserPublic) {
        for (let i = 0; i < data.warbands.length; i++) {
            if (this.Warbands.filter((val : SumWarband) => val.id == data.warbands[i].id).length > 0) { continue; }
            try {
                const parsed = JSON.parse(data.warbands[i].warband_data)
                parsed["warband_invites"] = data.warbands[i].warband_campaign_invites
                parsed["warband_campaigns"] = data.warbands[i].warband_campaigns
                parsed["warband_user"] = this.GetUserId()
                const newarband : UserWarband = await WarbandFactory.CreateUserWarband(parsed, data.warbands[i].id)
                this.Warbands.push(
                    {
                        id: data.warbands[i].id,
                        warband_data : newarband
                    }
                )
            } catch (e) {
                console.log(e);
            }
        }
    }

    public ConvertToInterface() {

        const warbandlist : ISynodWarband[] = []
        for (let i = 0; i < this.Warbands.length; i++) {
            warbandlist.push(
                {
                    id : this.Warbands[i].id,
                    warband_data: JSON.stringify(this.Warbands[i].warband_data.ConvertToInterface()),
                    warband_campaign_invites: this.Warbands[i].warband_data.GetCampaignInvites(),
                    warband_campaigns: this.Warbands[i].warband_data.GetCampaigns(),
                    warband_user_id: this.GetUserId()
                })
        }

        const campaignIds: number[] = [...this.Campaigns];

        const _objint : ISiteUserPublic = {
            is_premium: this.Premium,
            id : this.ID,
            nickname : this.Nickname,
            achievements: this.Achievements,
            friends: this.Friends,
            warbands: warbandlist,
            profile_picture: this.ProfilePic,
            campaigns: campaignIds
        }
        this.SelfData = _objint
        return _objint;
    }


    /**
     * Returns the nickname of the user
     */
    public GetNickname () {
        return this.Nickname;
    }

    /**
     * Returns the user ID
     */
    public GetUserId () {
        return this.ID;
    }

    /**
     * Returns the profile picture ID
     * - can NOT be loaded as image
     */
    public GetProfilePictureId () {
        return this.ProfilePic.id;
    }
    /**
     * Returns the profile picture Image ID
     * - can be loaded as image
     */
    public GetProfilePictureImageId () {
        if (this.ProfilePic == undefined) {
            return 0;
        }
        return this.ProfilePic.image_id;
    }

    /**
     * Gets Profile Picture Options from API
     */
    async getProfilePictureOptions(): Promise<ProfilePictureOption[]> {
        const token = localStorage.getItem('jwtToken') // @TODO: This is probably not the best way to do it

        const res = await fetch(`${SYNOD.URL}/wp-json/synod/v1/user-pfp-options/${this.GetUserId()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            throw new Error('Failed to fetch profile picture options')
        }

        const data = await res.json()
        return data as ProfilePictureOption[]
    }

    /**
     * Check if a user with ID is a friend of this user_public
     * @param user_id - The user id to check friendship for
     * @constructor
     */
    public async IsUserFriend(user_id: number): Promise<boolean> {
        for (let i = 0; i < this.Friends.length; i++) {
            if (this.Friends[i].id == user_id) { return true;}
        }
        return false;
    }

    /**
     * Check if a user with ID of requester_id has sent a friend request to this user_public
     * - only logged in users can get check for their own user_id
     *
     * @param user_id
     * @constructor
     */
    public async HasUserFriendRequestReceived ( user_id: number ): Promise<boolean> {

        if( this.GetUserId() == user_id) {
            return false; // cant request yourself
        }

        const token = localStorage.getItem('jwtToken') // @TODO: This is probably not the best way to do it

        const res = await fetch(`${SYNOD.URL}/wp-json/synod/v1/friends/request_received/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requester_id: user_id,
                requestee_id: this.GetUserId()
            })
        })

        if (!res.ok) {
            throw new Error('Failed to fetch friend request check')
        }

        const data = await res.json()

        if( data.value ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns an array of warbands for this user
     * - to show on the profile page for example
     *
     * - duplicated in site_user
     * @constructor
     */
    public async GetWarbands () {
        return this.Warbands;
    }

    /**
     * Returns an array of achievments for this user
     * - to show on the profile page for example
     *
     * - duplicate of user_public
     * @constructor
     */
    public async GetAchievements () {
        return this.Achievements;
    }

    /**
     * Returns the string of the users supporter status
     *
     * 'Supporter' if is premium
     * 'Free Member' if not premium
     */
    public GetUserStatus () {
        return (this.Premium == true)? '❤️ Supporter' : 'Free Member'
    }


}

export {ISiteUserPublic, SiteUserPublic}

