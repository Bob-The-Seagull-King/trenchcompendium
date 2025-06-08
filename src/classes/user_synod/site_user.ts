import { SynodProfilePicData } from "../_high_level_controllers/SynodImageCache";
import { IUserWarband, UserWarband } from "../saveitems/Warband/UserWarband";
import { IAchievement } from "./user_achievements";
import {ROUTES} from "../../resources/routes-constants";
import {SYNOD} from "../../resources/api-constants";
import { SiteUserPublic } from "./user_public";
import { SynodDataCache } from "../_high_level_controllers/SynodDataCache";
import { ISumWarband, SumWarband } from "../saveitems/Warband/WarbandManager";

interface ISiteUser {
    id: number,
    nickname : string,
    achievments: number[],
    friends: number[],
    warbands: ISumWarband[],
    campaigns: number[],
    profile_picture: SynodProfilePicData
}

export interface ProfilePictureOption {
    id: number
    available: boolean
    url: string
    tier: string
}

class SiteUser {
    ID : number;
    Nickname : string;
    Achievements : IAchievement[] = []
    Friends : SiteUserPublic[] = []
    Warbands : SumWarband[] = [];
    ProfilePic : SynodProfilePicData;
    Campaigns : number[] = []
    
    public constructor(data: ISiteUser)
    {
        this.ID = data.id;
        this.Nickname = data.nickname;
        this.ProfilePic = data.profile_picture;
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

        const warbandlist : ISumWarband[] = []
        for (let i = 0; i < this.Warbands.length; i++) {
            warbandlist.push(
                {
                    id : this.Warbands[i].id,
                    warband_data: this.Warbands[i].warband_data.ConvertToInterface()
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

}

export {ISiteUser, SiteUser}

