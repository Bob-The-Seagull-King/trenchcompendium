// factories/warband/CampaignFactory.ts

import {SynodDataCache} from "../../classes/_high_level_controllers/SynodDataCache";
import {Campaign, ICampaign} from "../../classes/saveitems/Campaign/Campaign";
import {SYNOD} from "../../resources/api-constants";
import {CampaignWarband, ICampaignWarband} from "../../classes/saveitems/Campaign/CampaignWarband";
import {CampaignAnnouncement, ICampaignAnnouncement} from "../../classes/saveitems/Campaign/CampaignAnnouncement";
import {CampaignUser, ICampaignUser} from "../../classes/saveitems/Campaign/CampaignUser";

class CampaignFactory {
    static async CreateCampaign(data: ICampaign) {
        // Always create a fresh Campaign instance so React gets a new reference
        const rule = new Campaign(data);
        await rule.BuildWarbands(data);
        await rule.BuildPlayers(data);
        await rule.BuildAnnouncements(data);
        return rule;
    }

    static async CreateCampaignUser(data: ICampaignUser) {
        const id = (data.id ?? data.user_id)!;
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
        await user.BuildSelfUser();
        return user;
    }

    static async CreateCampaignAnnouncement(data: ICampaignAnnouncement) {
        if (data == null || data == undefined) {return null;}
        const cache = SynodDataCache.getInstance();
        if (cache.CheckCampaignAnnouncementCache(data.announcement_id)) {
            return cache.campaignAnnouncementCache[data.announcement_id];
        }
        const a = new CampaignAnnouncement(data);
        cache.AddCampaignAnnouncementCache(data.announcement_id, a);
        await a.BuildUser(data);
        return a;
    }

    static async CreateCampaignWarband(data: ICampaignWarband, parent: Campaign) {
        const cache = SynodDataCache.getInstance();
        if (cache.CheckCampaignWarbandCache(data.warband_id)) {
            return cache.campaignWarbandCache[data.warband_id];
        }
        const wb = new CampaignWarband(data, parent);
        cache.AddCampaignWarbandCache(data.warband_id, wb);
        await wb.BuildUser(data);
        await wb.BuildWarband(data);
        return wb;
    }

    static async GetCampaignPublicByID(id: number, opts?: { force?: boolean }): Promise<Campaign | null> {
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

        // Always return a fresh Campaign instance
        return data ? CampaignFactory.CreateCampaign(data) : null;
    }

    static async ResetCampaign(val: Campaign): Promise<Campaign | null> {
        const cache = SynodDataCache.getInstance();
        delete cache.campaignDataCache[val.GetId()];
        delete cache.callCampaignCache[val.GetId()];
        delete cache.campaignObjectCache[val.GetId()];

        // clear sub-caches if du wirklich hart resetten willst …
        return CampaignFactory.GetCampaignPublicByID(val.GetId(), { force: true });
    }
}

export { CampaignFactory };
