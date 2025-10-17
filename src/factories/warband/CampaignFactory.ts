import { SumWarband } from '../../classes/saveitems/Warband/WarbandManager';
import { SynodDataCache } from '../../classes/_high_level_controllers/SynodDataCache';
import { SYNOD } from '../../resources/api-constants';
import { Campaign, ICampaign } from '../../classes/saveitems/Campaign/Campaign';
import { CampaignUser, ICampaignUser } from '../../classes/saveitems/Campaign/CampaignUser';
import { CampaignAnnouncement, ICampaignAnnouncement } from '../../classes/saveitems/Campaign/CampaignAnnouncement';
import { CampaignWarband, ICampaignWarband } from '../../classes/saveitems/Campaign/CampaignWarband';

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

class CampaignFactory {
    
    static async CreateCampaign(data: ICampaign) {
        const rule = new Campaign(data);
        await rule.BuildWarbands(data);
        await rule.BuildPlayers(data);
        await rule.BuildAnnouncements(data);
        
        return rule;
    }

    static async CreateCampaignUser(data : ICampaignUser) {
        const id = (data.id ?? data.user_id)!; // API provides either id or user_id
        const cache = SynodDataCache.getInstance();
        const isValid = (cache.CheckCampaignUserCache(id))
        if (isValid == false) {
            return cache.campaignUserCache[id];
        }
        const rule = new CampaignUser(
            id,
            data.nickname,
            !!data.is_premium,
            data.profile_picture?.urls,
            data.profile_picture?.source_title,
            data.profile_picture?.source_url,
            data.profile_picture?.image_id,
        )
        cache.AddCampaignUserCache(id, rule);
        await rule.BuildSelfUser();
        return rule;
    }

    static async CreateCampaignAnnouncement(data : ICampaignAnnouncement) {
        const cache = SynodDataCache.getInstance();
        const isValid = (cache.CheckCampaignAnnouncementCache(data.announcement_id))
        if (isValid == false) {
            return cache.campaignAnnouncementCache[data.announcement_id];
        }
        const rule = new CampaignAnnouncement(data);
        cache.AddCampaignAnnouncementCache(data.announcement_id, rule);
        await rule.BuildUser(data);

        return rule;
    }

    static async CreateCampaignWarband(data : ICampaignWarband) {
        const cache = SynodDataCache.getInstance();
        const isValid = (cache.CheckCampaignWarbandCache(data.warband_id))
        if (isValid == false) {
            return cache.campaignWarbandCache[data.warband_id];
        }
        const rule = new CampaignWarband(data);
        cache.AddCampaignWarbandCache(data.warband_id, rule);
        await rule.BuildUser(data);
        await rule.BuildWarband(data);

        return rule;
    }

    static async GetCampaignPublicByID( _val : number) : Promise<Campaign | null> {
        const synodcache : SynodDataCache = SynodDataCache.getInstance();
        let userdata : any = undefined;

        if (synodcache.CheckCampaignCache(_val)) {
            userdata = (synodcache.campaignDataCache[_val]);
        }

        if (synodcache.CheckCampaignCallCache(_val)) {
            const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one user, just give up
            let count_check = 0;
            while ((!synodcache.CheckCampaignCache(_val)) && (count_check < EMERGENCY_OUT)) {
                await delay(100);
                count_check += 1;
            }                   
            userdata = (synodcache.campaignDataCache[_val]);
        }

        if (!synodcache.CheckCampaignCache(_val)) {
            synodcache.AddCampaignCallCache(_val);

            const controller = new AbortController();
            const response : Response = await fetch(
                            `${SYNOD.URL}/wp-json/synod/v1/campaigns/${_val}`,
                            {
                                method: "GET",
                                headers: { Accept: "application/json" },
                                signal: controller.signal,
                            }
                        );

            // warband does not exist -> same as default return
            if( response.status === 400 ) {
                return null;
            }

            if (response) {
                const json : any = await response.json();          
                userdata = json.warband_data
                synodcache.AddCampaignCache(_val, json.warband_data)
            }
        }

        if (userdata != undefined) {
            try {
                const user = await CampaignFactory.CreateCampaign(JSON.parse(userdata) as ICampaign)
                return user;
            } catch (e) {console.log(e)}
        }

        return null;
    }

}

export {CampaignFactory}