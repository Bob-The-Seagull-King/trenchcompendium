import { SynodProfilePicData } from "../_high_level_controllers/SynodImageCache";
import { IUserWarband, UserWarband } from "../saveitems/Warband/UserWarband";
import { IAchievement } from "./user_achievements";

interface ISiteUser {
    id: number,
    nickname : string,
    achievments: number[],
    friends: number[],
    warbands: IUserWarband[],
    campaigns: number[],
    profile_picture: SynodProfilePicData
}

/**
interface ISiteUser {
    id: number,
    nickname : string,
    email: string,
    requests : number[],
    achievments: number[],
    friends: number[],
    warbands: IUserWarband[],
    profile_picture: SynodProfilePicData,
    Lets not include campaigns at the moment, or at least just put them as a number[] for future use.
}
 */

interface SiteUserPublic {
    id: number,
    nickname : string,
    achievments: number[],
    profile_pic: SynodProfilePicData
}

class SiteUser {
    ID : number;
    Nickname : string;
    Achievements : IAchievement[] = []
    Friends : SiteUserPublic[] = []
    Warbands : UserWarband[] = [];
    ProfilePic : SynodProfilePicData;
    Campaigns : number[] = []
    
    public constructor(data: ISiteUser)
    {
        console.log("DONE")
        this.ID = data.id;
        this.Nickname = data.nickname;
        this.ProfilePic = data.profile_picture;
    }

    public async BuildAchievements(data: ISiteUser) {
        undefined;
    }
    public async BuildFriends(data: ISiteUser) {
        undefined;
    }
    public async BuildWarbands(data: ISiteUser) {
        undefined;
    }
    public async BuildRequests(data: ISiteUser) {
        undefined;
    }

    public ConvertToInterface() {
        const achievementlist : number[] = []
        for (let i = 0; i < this.Achievements.length; i++) {
            achievementlist.push(this.Achievements[i].id)
        }
        const friendlist : number[] = []
        for (let i = 0; i < this.Friends.length; i++) {
            friendlist.push(this.Friends[i].id)
        }
        const warbandlist : IUserWarband[] = []
        for (let i = 0; i < this.Warbands.length; i++) {
            warbandlist.push(this.Warbands[i].ConvertToInterface())
        }
        const requestfriendlist : number[] = []
        for (let i = 0; i < this.Campaigns.length; i++) {
            requestfriendlist.push(this.Campaigns[i])
        }

        const _objint : ISiteUser = {
            id : this.ID,
            nickname : this.Nickname,
            achievments: achievementlist,
            friends: friendlist,
            warbands: warbandlist,
            profile_picture: this.ProfilePic,
            campaigns: requestfriendlist
        }
        
        return _objint;
    }

}

export {ISiteUser, SiteUser, SiteUserPublic}

