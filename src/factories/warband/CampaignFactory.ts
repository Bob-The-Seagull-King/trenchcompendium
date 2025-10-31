// factories/warband/CampaignFactory.ts

import {SynodDataCache} from "../../classes/_high_level_controllers/SynodDataCache";
import {Campaign, ICampaign} from "../../classes/saveitems/Campaign/Campaign";
import {SYNOD} from "../../resources/api-constants";
import {CampaignWarband, ICampaignWarband} from "../../classes/saveitems/Campaign/CampaignWarband";
import {CampaignAnnouncement, ICampaignAnnouncement} from "../../classes/saveitems/Campaign/CampaignAnnouncement";
import {CampaignUser, ICampaignUser} from "../../classes/saveitems/Campaign/CampaignUser";

class CampaignFactory {
    static async CreateCampaign(data: ICampaign, hydrate = true) {
        // Always create a fresh Campaign instance so React gets a new reference
        const rule = new Campaign(data);
        await rule.BuildWarbands(data, hydrate);
        await rule.BuildPlayers(data, hydrate);
        await rule.BuildAnnouncements(data, hydrate);

        // --- mark hydration state on the instance ---
        rule.isHydrated = !!hydrate;

        return rule;
    }

    static async CreateCampaignUser(data: ICampaignUser, hydrate = true) {

        const id = (data.id? data.id : data.user_id? data.user_id : -1);
        const cache = SynodDataCache.getInstance();
        if (cache.CheckCampaignUserCache(id)) {
            return cache.campaignUserCache[id];
        }
        const user = new CampaignUser(
            id,
            data.nickname,
            !!data.is_premium,
            data.profile_picture?.urls,
            data.profile_picture?.source_title,
            data.profile_picture?.source_url,
            data.profile_picture?.image_id,
        );
        cache.AddCampaignUserCache(id, user);
        await user.BuildSelfUser(hydrate);
        return user;
    }

    static async CreateCampaignAnnouncement(data: ICampaignAnnouncement, hydrate = true) {

        if (data == null) {return null;}
        const cache = SynodDataCache.getInstance();
        if (cache.CheckCampaignAnnouncementCache(data.announcement_id)) {
            return cache.campaignAnnouncementCache[data.announcement_id];
        }
        const a = new CampaignAnnouncement(data);
        cache.AddCampaignAnnouncementCache(data.announcement_id, a);

        await a.BuildUser(data, hydrate);
        return a;
    }

    static async CreateCampaignWarband(data: ICampaignWarband, parent: Campaign, hydrate = true) {
        const cache = SynodDataCache.getInstance();
        if (cache.CheckCampaignWarbandCache(data.warband_id)) {
            return cache.campaignWarbandCache[data.warband_id];
        }
        const wb = new CampaignWarband(data, parent);
        cache.AddCampaignWarbandCache(data.warband_id, wb);
        await wb.BuildUser(data, hydrate);
        await wb.BuildWarband(data, hydrate);
        return wb;
    }

    static async GetCampaignPublicByID(id: number, opts?: { force?: boolean }, hydrate = false): Promise<Campaign | null> {
        const cache = SynodDataCache.getInstance();
        let data: ICampaign | undefined;

        // Only use data cache if not forced
        if (!opts?.force && cache.CheckCampaignCache(id)) {
            data = cache.campaignDataCache[id];
        }

        if (!data && cache.CheckCampaignCallCache(id)) {
            // wait up to ~100s for any in-flight request
            const EMERGENCY_OUT = 1000;
            let n = 0;
            while (!cache.CheckCampaignCache(id) && n < EMERGENCY_OUT) {
                await new Promise(r => setTimeout(r, 100));
                n++;
            }
            data = cache.campaignDataCache[id];
        }

        if (!data) {
            cache.AddCampaignCallCache(id);
            const res = await fetch(
                `${SYNOD.URL}/wp-json/synod/v1/campaigns/${id}`,
                { method: 'GET', headers: { Accept: 'application/json' } }
            );
            if (res.status === 400) return null;
            const json = (await res.json()) as ICampaign;

            cache.AddCampaignCache(id, json);
            data = json;
        }

        console.log('hydrate');
        console.log(hydrate);

        // Always return a fresh Campaign instance
        return data ? CampaignFactory.CreateCampaign(data, hydrate) : null;
    }

    static async ResetCampaign(val: Campaign, hydrate?: boolean): Promise<Campaign | null> {
        const cache = SynodDataCache.getInstance();
        delete cache.campaignDataCache[val.GetId()];
        delete cache.callCampaignCache[val.GetId()];
        delete cache.campaignObjectCache[val.GetId()];

        console.log('ResetCampaign');
        // Decide target hydration: explicit arg wins, otherwise preserve current state
        const targetHydrate = (typeof hydrate === 'boolean') ? hydrate : !!val.isHydrated;

        // clear sub-caches if du wirklich hart resetten willst …
        return CampaignFactory.GetCampaignPublicByID(val.GetId(), { force: true }, hydrate);
    }

    static async Rehydratecampaign( val : Campaign) {
        const WarbandList : CampaignWarband[] = val.GetWarbands()
        for (let i = 0; i < WarbandList.length; i++) {
            await WarbandList[i].RehydrateUser();
            await WarbandList[i].RehydrateWarbands();
        }

        const UserList : CampaignUser[] = val.GetInvitablePlayers_full();
        for (let i = 0; i < UserList.length; i++) {
            await UserList[i].RehydrateUser();
        }

        const AnnouncementList : CampaignAnnouncement[] = val.GetAnnouncements();
        for (let i = 0; i < AnnouncementList.length; i++) {
            await AnnouncementList[i].RehydrateUser();
        }

        const LatestAnnouncement : CampaignAnnouncement | null = val.GetLatestAnnouncement();
        if (LatestAnnouncement != null) { 
            await LatestAnnouncement.RehydrateUser();
        }

        // --- mark as hydrated after all related data has been upgraded ---
        val.isHydrated = true;
        
    }
}

export { CampaignFactory };
