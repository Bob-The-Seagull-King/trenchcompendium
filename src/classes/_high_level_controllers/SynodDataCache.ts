import { ItemManager } from '../saveitems/itemmanager';
import { ContentPackManager } from '../contentpacks/contentmanager'
import { ScenarioGenerator } from '../feature/scenario/ScenarioGenerator';
import { WarbandManager } from '../saveitems/Warband/WarbandManager';
import { ISiteUser, SiteUser } from '../user_synod/site_user';
import { IAchievement } from '../user_synod/user_achievements';
import { ISiteUserPublic, SiteUserPublic } from '../user_synod/user_public';


class SynodDataCache {
   

    private static instance: SynodDataCache;    // basic in-memory cache
    

    public static getInstance(): SynodDataCache {
        if (!SynodDataCache.instance) {
            SynodDataCache.instance = new SynodDataCache();
        }
        return SynodDataCache.instance;
    }
    
    /* PRIVATE */
    userDataCache: Record<number, ISiteUser> = {};
    userObjectCache: Record<number, SiteUser> = {};
    callUserDataCache: Record<number, boolean> = {};
        
    public CheckCache(key : number) { return (this.userDataCache[key]) }
    public CheckCallCache(key : number) { return (this.callUserDataCache[key]) }

    public AddCache(key : number, data : ISiteUser) { this.userDataCache[key] = data; }
    public AddCallCache(key : number) { this.callUserDataCache[key] = true; }

    /* PUBLIC */
    
    publicDataCache: Record<number, ISiteUserPublic> = {};
    publicObjectCache: Record<number, SiteUserPublic> = {};
    callPublicDataCache: Record<number, boolean> = {};
        
    public CheckPublicCache(key : number) { return (this.publicDataCache[key]) }
    public CheckPublicCallCache(key : number) { return (this.callPublicDataCache[key]) }

    public AddPublicCache(key : number, data : ISiteUserPublic) { this.publicDataCache[key] = data; }
    public AddPublicCallCache(key : number) { this.callPublicDataCache[key] = true; }

    /* ACHIEVMENTS */
    
    achievmentDataCache: Record<number, IAchievement> = {};
    callAchievmentCache: Record<number, boolean> = {};
        
    public CheckAchievementCache(key : number) { return (this.achievmentDataCache[key]) }
    public CheckAchievementCallCache(key : number) { return (this.callAchievmentCache[key]) }

    public AddAchievementCache(key : number, data : IAchievement) { this.achievmentDataCache[key] = data; }
    public AddAchievementCallCache(key : number) { this.callAchievmentCache[key] = true; }
}

export {SynodDataCache}