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
    achievements: number[],
    friends: IFriend[],
    warbands: ISynodWarband[],
    campaigns: number[],
    profile_picture: SynodProfilePicData
}

class SiteUserPublic {
    ID : number;
    Nickname : string;
    Achievements : IAchievement[] = []
    Friends : IFriend[] = []
    BuiltFriends : SiteUserPublic[] = []
    Warbands : SumWarband[] = [];
    ProfilePic : SynodProfilePicData;
    Campaigns : number[] = []
    
    public constructor(data: ISiteUserPublic)
    {
        this.ID = data.id;
        this.Nickname = data.nickname;
        this.ProfilePic = data.profile_picture;
        this.Friends = data.friends;
    }

    public async BuildAchievements(data: ISiteUserPublic) {
        if (data.achievements == undefined) { return; }
        for (let i = 0; i < data.achievements.length; i++) {
            const newach = await AchievementFactory.CreateAchievement(data.achievements[i])
            if (newach != null) {
                this.Achievements.push(newach);
            }
        }
    }

    public async BuildFriends(data: ISiteUserPublic) {
        for (let i = 0; i < data.friends.length; i++) {
            const newFriend = await UserFactory.CreatePublicUserByID(data.friends[i].id)
            if (newFriend != null) {
                this.BuiltFriends.push(newFriend);
            }
        }
    }

    public async BuildWarbands(data: ISiteUserPublic) {
        for (let i = 0; i < data.warbands.length; i++) {
            if (this.Warbands.filter((val : SumWarband) => val.id == data.warbands[i].id).length > 0) { continue; }
            try {
                const newarband : UserWarband = await WarbandFactory.CreateUserWarband(JSON.parse(data.warbands[i].warband_data))
                this.Warbands.push(
                    {
                        id: data.warbands[i].id,
                        warband_data : newarband
                    }
                )
            } catch (e) {

                console.log('@TODO: Error if no warbands for user are present');
                console.log(e);
            }
        }
    }

    public ConvertToInterface() {
        const achievementlist : number[] = []
        for (let i = 0; i < this.Achievements.length; i++) {
            achievementlist.push(this.Achievements[i].id)
        }
        const warbandlist : ISynodWarband[] = []
        for (let i = 0; i < this.Warbands.length; i++) {
            warbandlist.push(
                {
                    id : this.Warbands[i].id,
                    warband_data: JSON.stringify(this.Warbands[i].warband_data.ConvertToInterface())
                })
        }
        const requestfriendlist : number[] = []
        for (let i = 0; i < this.Campaigns.length; i++) {
            requestfriendlist.push(this.Campaigns[i])
        }

        const _objint : ISiteUserPublic = {
            id : this.ID,
            nickname : this.Nickname,
            achievements: achievementlist,
            friends: this.Friends,
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

        if( this.GetUserId() === user_id) {
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

        // @TODO
        console.log(' @TODO: return the list of achievements for this user here. @site_user -> GetAchievements()')
        console.log(this.Achievements);

        /*
        * return like this:
        */
        const achievements = [
            {
                "id": 84,
                "name": "Friends with the Devil",
                "description": "",
                "image_id": 413, // deprecated
                "image_url": 'https://synod.trench-companion.com/wp-content/uploads/2025/06/friends_with_dev-300x300.png'
            },
            {
                "id": 358,
                "name": "The First Forging",
                "description": "Created a warband",
                "image_id": 421, // deprecated
                "image_url": 'https://synod.trench-companion.com/wp-content/uploads/2025/06/warband_creation_1-300x300.png'
            }
        ];


        return achievements
    }
}

export {ISiteUserPublic, SiteUserPublic}

