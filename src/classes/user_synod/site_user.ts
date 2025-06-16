import { SynodProfilePicData } from "../_high_level_controllers/SynodImageCache";
import { IUserWarband, UserWarband } from "../saveitems/Warband/UserWarband";
import { IAchievement } from "./user_achievements";
import {ROUTES} from "../../resources/routes-constants";
import {SYNOD} from "../../resources/api-constants";
import { SiteUserPublic } from "./user_public";
import { SynodDataCache } from "../_high_level_controllers/SynodDataCache";
import { ISumWarband, SumWarband } from "../saveitems/Warband/WarbandManager";
import { WarbandFactory } from "../../factories/warband/WarbandFactory";
import {UserFactory} from "../../factories/synod/UserFactory";

interface ISiteUser {
    id: number,
    nickname : string,
    achievments: number[],
    friends: IFriend[],
    friend_requests: IFriend[],
    warbands: ISynodWarband[],
    campaigns: number[],
    profile_picture: SynodProfilePicData
}

export interface ISynodWarband {
    id : number // -1 means LOCAL warband
    warband_data : string
}

export interface ProfilePictureOption {
    id: number
    available: boolean
    url: string
    tier: string
}

export interface IFriend {
    id : number,
    nickname : string,
    profile_picture_url : string
    status: string
}

class SiteUser {
    ID : number;
    Nickname : string;
    Achievements : IAchievement[] = []
    Friends : IFriend[] = []
    Requests : IFriend[] = [];
    BuiltFriends : SiteUserPublic[] = [];
    Warbands : SumWarband[] = [];
    ProfilePic : SynodProfilePicData;
    Campaigns : number[] = []
    
    public constructor(data: ISiteUser)
    {
        this.ID = data.id;
        this.Nickname = data.nickname;
        this.ProfilePic = data.profile_picture;
        this.Friends = data.friends
        this.Requests = data.friend_requests
    }

    public async GenerateWarbands(data: ISiteUser) {
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


    public async BuildFriends(data: ISiteUser) {
        for (let i = 0; i < data.friends.length; i++) {
            const newFriend = await UserFactory.CreatePublicUserByID(data.friends[i].id)
            if (newFriend != null) {
                this.BuiltFriends.push(newFriend);
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

        const _objint : ISiteUser = {
            id : this.ID,
            nickname : this.Nickname,
            achievments: achievementlist,
            friends: this.Friends,
            friend_requests : this.Requests,
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
     * Sets a new profile picture for the user
     *
     * @param newProfilePictureId
     */
    public async updateProfilePicture(newProfilePictureId: number): Promise<void> {
        const token = localStorage.getItem('jwtToken'); // You can refactor this to use a better auth system
        if (!token) throw new Error('User is not authenticated');

        const response = await fetch(`${SYNOD.URL}/wp-json/wp/v2/users/me`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                profile_picture_id: newProfilePictureId,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update profile picture: ${errorText}`);
        }        

        // Optionally update the local property
        this.ProfilePic.id = newProfilePictureId;

        // @TODO: get the new user data maybe?

    }


    /**
     * Check if a user with ID is a friend of this site_user
     * @param user_id
     * @constructor
     */
    public async IsUserFriend(user_id: number): Promise<boolean> {
        for (let i = 0; i < this.Friends.length; i++) {
            if (this.Friends[i].id == user_id) { return true;}
        }
        return false;

    }

    /**
     * Check if a user with ID has sent a friend request to this site_user
     * - This is probably not needed anymore
     * @param user_id
     * @constructor
     */
    public async HasUserFriendRequestReceived (user_id: number): Promise<boolean> {

        console.log('@TODO: HasUserFriendRequestReceived in site_user - which is deprecated (probably)');

        for (let i = 0; i < this.Requests.length; i++) {
            if (this.Requests[i].id == user_id) { return true;}
        }
        return false;
    }

    /**
     * Accept a friend request from the user_id for the current user
     *
     * @param user_id
     */
    public async acceptFriendRequest ( user_id: number ): Promise<boolean> {
        const token = localStorage.getItem('jwtToken') // @TODO: This is probably not the best way to do it

        const res = await fetch(`${SYNOD.URL}/wp-json/synod/v1/friends/accept`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
            })
        })

        if (!res.ok) {
            throw new Error('Failed to accept friend request')
        }

        const data = await res.json()

        if( data.value ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Decline a friend request from the user_id for the current user
     *
     * @param user_id
     */
    public async declineFriendRequest ( user_id: number ): Promise<boolean> {
        const token = localStorage.getItem('jwtToken') // @TODO: This is probably not the best way to do it

        const res = await fetch(`${SYNOD.URL}/wp-json/synod/v1/friends/decline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
            })
        })

        if (!res.ok) {
            throw new Error('Failed to decline friend request')
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
     * - duplicate of user_public
     * @constructor
     */
    public async GetWarbands () {

        // @TODO
        console.log(' @TODO: return the list of warbands for this user here. @site_user -> GetWarbands()')

        return []
    }
}

export {ISiteUser, SiteUser}

