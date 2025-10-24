import {
    AdminChange,
    AnnouncementCreate,
    AnnouncementDelete,
    AnnouncementEdit,
    GetPlayerCampaignInvites,
    GetPlayerCampaigns,
    InviteAccept,
    InviteDecline,
    InviteMake,
    PlayerRemove,
    UpdateCampaign,
    WarbandAccept,
    WarbandCancel,
    WarbandInvite,
    WarbandRemove
} from "../../../factories/warband/CampaignSynod";
import { UserFactory } from "../../../factories/synod/UserFactory";
import { SiteUser } from "../../user_synod/site_user";
import { Campaign } from "./Campaign";
import { CampaignAnnouncement } from "./CampaignAnnouncement";
import { CampaignFactory } from "../../../factories/warband/CampaignFactory";


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
    title? : string,
    description?: string
}

interface ISubmitBasics {
    id?: number,
    token : string
}

class CampaignManager {
    private UserProfile : SiteUser | null = null;
    private Complete = false;

    public ListOfCampaigns : Campaign[] = [];
    public ListOfWarbandCampaigns : Campaign[] = [];
    public ListOfAdminCampaigns : Campaign[] = [];
    public ListOfAnnouncements : CampaignAnnouncement[] = [];
    public ListOfInvites : Campaign[] = [];
    public ListOfWarbandInvites : Campaign[] = [];

    public async SetLoggedUser(id : number) {
        const NewUser : SiteUser | null = await UserFactory.CreatePrivateUserByID(id);
        this.UserProfile = NewUser;
    }

    public RemoveLoggedUser() {
        this.UserProfile = null;
    }

    public async RunInit() {
        if (!this.IsComplete()) {
            await this.BuildAll();
        }
    }

    public IsComplete() {
        return this.Complete;
    }

    public async BuildAll() {
        this.Complete = false;
        this.ListOfCampaigns = [];
        this.ListOfInvites = [];
        if (this.UserProfile == null) {
            await this.GrabUser();
        }
        const submission = this.GetUserSubmitBasics(true);
        if (submission != null) {
            const campaigns = await GetPlayerCampaigns(submission)
            if (campaigns != null) {
                const json = (await campaigns.json()) as number[];
                for (let i = 0; i < json.length; i++) {
                    const CampaignVal = await CampaignFactory.GetCampaignPublicByID(json[i]);
                    if (CampaignVal != null) {
                        this.ListOfCampaigns.push(CampaignVal)
                    }
                }
            }
            const invites = await GetPlayerCampaignInvites(submission)
            if (invites != null) {
                const json = (await invites.json()) as number[];
                for (let i = 0; i < json.length; i++) {
                    const CampaignVal = await CampaignFactory.GetCampaignPublicByID(json[i]);
                    if (CampaignVal != null) {
                        this.ListOfInvites.push(CampaignVal)
                    }
                }
            }
        }
        this.SortMyCampaigns();
        this.Complete = true;
    }

    public async GrabUser() {
        
        const storedToken = localStorage.getItem('jwtToken');
        const storedUserId = localStorage.getItem('synodUserId');
        if (storedToken && storedUserId && this.UserProfile == null) {
            await this.SetLoggedUser(parseInt(storedUserId, 10));
        }
    }

    public GetUserSubmitBasics(add_id = true): ISubmitBasics | null {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken == null || 
            storedToken == undefined || 
            (add_id == true && this.UserProfile == null)) {
            return null;
        }
        if (add_id == true) {
            return {
                token: storedToken,
                id: this.UserProfile?.GetUserId()
            }
        } else {
            return {
                token: storedToken
            }
        }
    }

    /**
     * Is this user the campaign admin?
     * @param id | campaign ID
     */
    public OwnsCampaign(id : number) {
        for (let i = 0; i < this.ListOfAdminCampaigns.length; i++) {
            if (this.ListOfAdminCampaigns[i].GetId() == id) {
                return true;
            }
        }
        return false;
    }

    public InCampaign(id : number) {
        for (let i = 0; i < this.ListOfCampaigns.length; i++) {
            if (this.ListOfCampaigns[i].GetId() == id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Is this user invited to this campaign?
     * @param id
     */
    public IsInvited(id : number) {
        if (this.UserProfile == null) { return false; }
        for (let i = 0; i < this.ListOfInvites.length; i++) {
            if (this.ListOfInvites[i].GetId() != id) { continue; }
            if (this.ListOfInvites[i].IsInvited(this.UserProfile.GetUserId())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Is this warband invited to the campaign?
     * @param campaignId
     * @param warbandId
     * @constructor
     */
    public IsInvitedWarband(campaignId : number, warbandId : number) {

        // @TODO: this.ListOfWarbandInvites is empty
        console.log(this.ListOfWarbandInvites);

        if (this.UserProfile == null) { return false; }
        for (let i = 0; i < this.ListOfWarbandInvites.length; i++) {
            if (this.ListOfWarbandInvites[i].GetId() != campaignId) { continue; }
            if (this.ListOfWarbandInvites[i].IsInvitedWarband(warbandId)) {
                return true;
            }
        }
        return false;
    }

    public async ResetCampaignByID(_val : number) {
        this.Complete = false;
        let NewCampaign : Campaign | null = null;
        let IndexVal : number | null = null;
        for (let i = 0; i < this.ListOfCampaigns.length; i++) {
            if (this.ListOfCampaigns[i].GetId() == _val) {
                NewCampaign = await CampaignFactory.ResetCampaign(this.ListOfCampaigns[i])
                IndexVal = i;
                break;
            }
        }

        if (NewCampaign != null && IndexVal != null) {
            this.ListOfCampaigns[IndexVal] = NewCampaign;
            this.SortMyCampaigns();
        }
        this.Complete = true;
    }

    public SortMyCampaigns() {
        this.ListOfAdminCampaigns = []
        this.ListOfWarbandCampaigns = []
        if (this.UserProfile == null) {return;}
        const UserWarbands = this.UserProfile.GetWarbandIDList();
        for (let i = 0; i < this.ListOfCampaigns.length; i++) {
            if (this.ListOfCampaigns[i].IsAdmin(this.UserProfile.GetUserId())) {
                this.ListOfAdminCampaigns.push(this.ListOfCampaigns[i]);
            }
            if (this.ListOfCampaigns[i].GetWarbandIDList().some( ai => UserWarbands.includes(ai))) {
                this.ListOfWarbandCampaigns.push(this.ListOfCampaigns[i])
            }
        }
    }

    public async MoveInviteCampiagn(_val : number, _accepted : boolean) {
        let NewCampaign : Campaign | null = null;
        for (let i = 0; i < this.ListOfInvites.length; i++) {
            if (this.ListOfInvites[i].GetId() == _val) {
                NewCampaign = this.ListOfInvites[i]
                this.ListOfInvites.splice(i, 1);
                break;
            }
        }

        if (_accepted && NewCampaign != null) {
            const Added = await CampaignFactory.ResetCampaign(NewCampaign)
            if (Added != null) { 
                this.ListOfCampaigns.push(Added)
                this.SortMyCampaigns();
            }
        }
    }

    public async MoveWarandInviteCampiagn(_val : number, _accepted : boolean) {
        let NewCampaign : Campaign | null = null;
        for (let i = 0; i < this.ListOfWarbandInvites.length; i++) {
            if (this.ListOfWarbandInvites[i].GetId() == _val) {
                NewCampaign = this.ListOfWarbandInvites[i]
                this.ListOfInvites.splice(i, 1);
                break;
            }
        }

        if (_accepted && NewCampaign != null) {
            const Added = await CampaignFactory.ResetCampaign(NewCampaign)
            if (Added != null) { 
                this.ListOfCampaigns.push(Added)
                this.SortMyCampaigns();
            }
        }
    }

    public async ChangeCampaignAdmin(_campaign_id: number, _player_id : number) {
        if (this.OwnsCampaign(_campaign_id)) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit != null) {
                const responseVal = await AdminChange({campaign_id: _campaign_id, player_id: _player_id }, Submit)
                if (responseVal.status == 200) {
                    await this.ResetCampaignByID(_campaign_id);
                }
                return responseVal;
            }
        }
    }

    /**
     * Cancel a player campaign invite
     * @param _campaign_id
     * @param playerId
     */
    public async CampaignInviteCancel(_campaign_id: number, playerId: number) {
        const Submit = this.GetUserSubmitBasics(false);
        if (Submit == null || this.UserProfile == null) { return 400; }

        // @TODO: check if user with playerId is invited to this campaign
        const responseVal = await InviteDecline({campaign_id: _campaign_id, player_id: playerId }, Submit)
        if (responseVal.status == 200) {
            await this.MoveInviteCampiagn(_campaign_id, false);
        }
        return responseVal;
    }

    /**
     * Reject a player campaign invite
     * @param _campaign_id
     */
    public async CampaignInviteReject(_campaign_id: number) {
        const Submit = this.GetUserSubmitBasics(false);
        if (Submit == null || this.UserProfile == null) { return 400; }
        if (this.IsInvited(_campaign_id)) {

            const responseVal = await InviteDecline({campaign_id: _campaign_id, player_id: this.UserProfile.GetUserId() }, Submit)
            if (responseVal.status == 200) {
                await this.MoveInviteCampiagn(_campaign_id, false);
            }
            return responseVal;
        }
    }

    public async CampaignInviteAccept(_campaign_id: number) {
        const Submit = this.GetUserSubmitBasics(false);
        if (Submit == null || this.UserProfile == null) { return 400; }
        if (this.IsInvited(_campaign_id)) {
            
            const responseVal = await InviteAccept({campaign_id: _campaign_id, player_id: this.UserProfile.GetUserId() }, Submit)
            if (responseVal.status == 200) {
                await this.MoveInviteCampiagn(_campaign_id, true);
            }
            return responseVal;
        }
    }

    public async CampaignInviteCreate(_campaign_id: number, _player_id : number) {
        if (this.OwnsCampaign(_campaign_id)) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit == null) { return 400; }
            const responseVal = await InviteMake({campaign_id: _campaign_id, player_id: _player_id }, Submit)
                if (responseVal.status == 200) {
                    await this.ResetCampaignByID(_campaign_id);
                }
                return responseVal;
        }
    }

    public async CampaignWarbandAccept(_campaign_id : number, _warband_id : number) {
        const Submit = this.GetUserSubmitBasics(false);
        if (Submit == null || this.UserProfile == null) { return 400; }
        if (this.IsInvitedWarband(_campaign_id, _warband_id)) {
            
            const responseVal = await WarbandAccept({campaign_id: _campaign_id, warband_id : _warband_id }, Submit)
            if (responseVal.status == 200) {
                await this.MoveInviteCampiagn(_campaign_id, true);
            }
            return responseVal;
        }
    }

    public async CampaignWarbandReject(_campaign_id : number, _warband_id : number) {

        const Submit = this.GetUserSubmitBasics(false);

        if (Submit == null || this.UserProfile == null) { return 400; }
        if (this.IsInvitedWarband(_campaign_id, _warband_id)) {

            const responseVal = await WarbandCancel({campaign_id: _campaign_id, warband_id : _warband_id }, Submit)
            if (responseVal.status == 200) {
                await this.MoveInviteCampiagn(_campaign_id, false);
            }
            return responseVal;
        }
    }

    public async CampaignWarbandCreate(_campaign_id : number, _warband_id : number) {
        if (this.OwnsCampaign(_campaign_id)) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit == null) { return 400; }
            const responseVal = await WarbandInvite({campaign_id: _campaign_id, warband_id : _warband_id }, Submit)
                if (responseVal.status == 200) {
                    await this.ResetCampaignByID(_campaign_id);
                }
                return responseVal;
        }
    }

    /**
     * Removes a player from the campaign
     * @param _campaign_id
     * @param _player_id
     */
    public async ForceRemovePlayer(_campaign_id : number, _player_id : number) {

        if (
            this.OwnsCampaign(_campaign_id) || // is the admin
            this.UserProfile?.GetUserId() == _player_id // is the player self
        ) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit == null) { return 400; }
            const responseVal = await PlayerRemove({campaign_id: _campaign_id, player_id : _player_id }, Submit)
                if (responseVal.status == 200) {
                    await this.ResetCampaignByID(_campaign_id);
                }
                return responseVal;
        }
    }

    public async ForceRemoveWarband(_campaign_id : number, _warband_id : number) {
        if (this.OwnsCampaign(_campaign_id)) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit == null) { return 400; }
            const responseVal = await WarbandRemove({campaign_id: _campaign_id, warband_id : _warband_id }, Submit)
                if (responseVal.status == 200) {
                    await this.ResetCampaignByID(_campaign_id);
                }
                return responseVal;
        }
    }

    public async AddAnnouncement(_campaign_id : number, _title : string, body : string) {
        if (this.InCampaign(_campaign_id)) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit == null) { return 400; }
            const responseVal = await AnnouncementCreate({campaign_id: _campaign_id, description: body, title: _title }, Submit)
                if (responseVal != null && responseVal.status == 200) {
                    await this.ResetCampaignByID(_campaign_id);
                }
                return responseVal;
        }
    }

    public async EditAnnouncement(_campaign_id : number, announcement : CampaignAnnouncement, _title : string, body : string) {
        if (this.InCampaign(_campaign_id)) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit == null) { return 400; }
            const responseVal = await AnnouncementEdit({announcement_id: announcement.Id, description: body, title: _title }, Submit)
            if (responseVal != null && responseVal.status == 200) {
                await this.ResetCampaignByID(_campaign_id);
            }
            return responseVal;
        }
    }

    public async DeleteAnnouncement(_campaign_id : number, announcement : CampaignAnnouncement) {
        if (this.InCampaign(_campaign_id)) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit == null) { return 400; }
            const responseVal = await AnnouncementDelete({announcement_id: announcement.Id }, Submit)
                if (responseVal != null && responseVal.status == 200) {
                    await this.ResetCampaignByID(_campaign_id);
                }
                return responseVal;
        }
    }

    public async UpdateCampaign (_campaign_id : number, title: string, description : string){
        if (this.InCampaign(_campaign_id)) {
            const Submit = this.GetUserSubmitBasics(false);
            if (Submit == null) { return 400; }
            const responseVal = await UpdateCampaign(
            {
                    id: _campaign_id,
                    title: title,
                    description: description
                },
                Submit
            )
            if (responseVal != null && responseVal.status == 200) {
                await this.ResetCampaignByID(_campaign_id);
            }
            return responseVal;
        }
    }

    public async DeleteCampaign ( _campaign_id : number ) {
        /**
         * @TODO delete Campaign here:
         * POST /wp-json/synod/v1/campaigns/delete
         *
         * Args: {
         * "campaign_id": <id>
         * }
         *
         * Response: {
         * "status": "success",
         * "message": "Campaign deleted"
         * }
         *
         */
        alert ();
    }

}

export {CampaignManager, ICampaignBasics, ISubmitBasics, ICampaignUserInvite, ICampaignWarbandInvite, ICampaignAnnouncementBasics}