import { SynodProfilePicData } from "../_high_level_controllers/SynodImageCache";
import { IUserWarband, UserWarband } from "../saveitems/Warband/UserWarband";
import { IAchievement } from "./user_achievements";
import {ROUTES} from "../../resources/routes-constants";
import {SYNOD} from "../../resources/api-constants";
import { UserFactory } from "../../factories/synod/UserFactory";
import { WarbandFactory } from "../../factories/warband/WarbandFactory";
import { ProfilePictureOption } from "./site_user";
import { AchievementFactory } from "../../factories/synod/AchievementFactory";

interface ISiteUserPublic {
    id: number,
    nickname : string,
    achievements: number[],
    friends: number[],
    warbands: IUserWarband[],
    campaigns: number[],
    profile_picture: SynodProfilePicData
}

class SiteUserPublic {
    ID : number;
    Nickname : string;
    Achievements : IAchievement[] = []
    Friends : SiteUserPublic[] = []
    Warbands : UserWarband[] = [];
    ProfilePic : SynodProfilePicData;
    Campaigns : number[] = []
    
    public constructor(data: ISiteUserPublic)
    {
        this.ID = data.id;
        this.Nickname = data.nickname;
        this.ProfilePic = data.profile_picture;
    }

    public async BuildAchievements(data: ISiteUserPublic) {
        for (let i = 0; i < data.achievements.length; i++) {
            const newach = await AchievementFactory.CreateAchievement(data.achievements[i])
            if (newach != null) {
                this.Achievements.push(newach);
            }
        }
    }

    public async BuildFriends(data: ISiteUserPublic) {
        for (let i = 0; i < data.friends.length; i++) {
            const newFriend = await UserFactory.CreatePublicUserByID(data.friends[i])
            if (newFriend != null) {
                this.Friends.push(newFriend);
            }
        }
    }

    public async BuildWarbands(data: ISiteUserPublic) {
        for (let i = 0; i < data.warbands.length; i++) {
            const band = await WarbandFactory.CreateUserWarband(data.warbands[i]);
            this.Warbands.push(band);
        }
    }

    public ConvertToInterface() {
        const achievementlist : number[] = []
        for (let i = 0; i < this.Achievements.length; i++) {
            achievementlist.push(this.Achievements[i].id)
        }
        const friendlist : number[] = []
        for (let i = 0; i < this.Friends.length; i++) {
            friendlist.push(this.Friends[i].ID)
        }
        const warbandlist : IUserWarband[] = []
        for (let i = 0; i < this.Warbands.length; i++) {
            warbandlist.push(this.Warbands[i].ConvertToInterface())
        }
        const requestfriendlist : number[] = []
        for (let i = 0; i < this.Campaigns.length; i++) {
            requestfriendlist.push(this.Campaigns[i])
        }

        const _objint : ISiteUserPublic = {
            id : this.ID,
            nickname : this.Nickname,
            achievements: achievementlist,
            friends: friendlist,
            warbands: warbandlist,
            profile_picture: this.ProfilePic,
            campaigns: requestfriendlist
        }
        
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
}

export {ISiteUserPublic, SiteUserPublic}

