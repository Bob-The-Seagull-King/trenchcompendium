import { ISiteUserPublic } from "../../classes/user_synod/user_public";
import { SynodDataCache } from "../../classes/_high_level_controllers/SynodDataCache";
import { ISiteUser, SiteUser } from "../../classes/user_synod/site_user";
import {SYNOD} from "../../resources/api-constants";
import { IAchievement } from "../../classes/user_synod/user_achievements";

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

class AchievementFactory {

    static async CreateAchievement(_val : number) {

        const synodcache : SynodDataCache = SynodDataCache.getInstance();
        let achData : IAchievement | undefined = undefined;

        if (synodcache.CheckAchievementCache(_val)) {
            achData = (synodcache.achievmentDataCache[_val]);
        }

        if (synodcache.CheckAchievementCallCache(_val)) {
            const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one user, just give up
            let count_check = 0;
            while ((!synodcache.CheckAchievementCache(_val)) && (count_check < EMERGENCY_OUT)) {
                await delay(100);
                count_check += 1;
            }                   
            achData = (synodcache.achievmentDataCache[_val]);
        }

        if (!synodcache.CheckAchievementCache(_val)) {
            synodcache.AddAchievementCallCache(_val);
            
            /* @TODO David Achivement Call goes here */
            const response : Response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/user-private/${_val}`)
            if (response) {
                const json : any = await response.json();              
                achData = json
                synodcache.AddAchievementCache(_val, json)
            }
        }

        if (achData != undefined) {
            return achData;
        }

        return null;
    }

}

export {AchievementFactory}