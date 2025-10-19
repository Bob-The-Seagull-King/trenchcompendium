import { UserFactory } from "../../../factories/synod/UserFactory";
import { SiteUser } from "../../user_synod/site_user";
import { Campaign } from "./Campaign";


interface ICampaignBasics {
    id? : number,
    title : string,
    description: string
}

interface ICampaignUserInvite {
    campaign_id : number,
    player_id : number
}

interface ICampaignWarbandInvite {
    campaign_id : number,
    warband_id : number
}

interface ICampaignAnnouncementBasics {
    campaign_id? : number,
    announcement_id? : number,
    title : string,
    description: string
}

interface ISubmitBasics {
    id?: number,
    token : string
}

class CampaignManager {
    private UserProfile : SiteUser | null = null;

    public ListOfWarbands : Campaign[] = [];

    public constructor() {}

    public async SetLoggedUser(id : number) {
        const NewUser : SiteUser | null = await UserFactory.CreatePrivateUserByID(id);
        this.UserProfile = NewUser;
    }

    public RemoveLoggedUser() {
        this.UserProfile = null;
    }

    public async GrabUser() {
        
        const storedToken = localStorage.getItem('jwtToken');
        const storedUserId = localStorage.getItem('synodUserId');
        if (storedToken && storedUserId && this.UserProfile == null) {
            await this.SetLoggedUser(parseInt(storedUserId, 10));
        }
    }

    /*

    get user campaigns

    get campaigns they're a part of (and announcements)

    get campaign invites

    change campaign admin

    accept/reject invite

    accept/reject warband

    make invite

    remove player

    remove warband

    make announcement

    edit announcement

    */

}

export {CampaignManager, ICampaignBasics, ISubmitBasics, ICampaignUserInvite, ICampaignWarbandInvite, ICampaignAnnouncementBasics}