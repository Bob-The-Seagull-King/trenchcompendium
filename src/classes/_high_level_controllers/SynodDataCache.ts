import { ItemManager } from '../saveitems/itemmanager';
import { ContentPackManager } from '../contentpacks/contentmanager'
import { ScenarioGenerator } from '../feature/scenario/ScenarioGenerator';
import { WarbandManager } from '../saveitems/Warband/WarbandManager';
import { ISiteUser, SiteUser } from '../user_synod/site_user';


class SynodDataCache {
   

    private static instance: SynodDataCache;    // basic in-memory cache
    

    public static getInstance(): SynodDataCache {
        if (!SynodDataCache.instance) {
            SynodDataCache.instance = new SynodDataCache();
        }
        return SynodDataCache.instance;
    }
    
    userDataCache: Record<number, ISiteUser> = {};
    userObjectCache: Record<number, SiteUser> = {};
    callUserDataCache: Record<number, boolean> = {};
        
    public CheckCache(key : number) { return (this.userDataCache[key]) }
    public CheckCallCache(key : number) { return (this.callUserDataCache[key]) }

    public AddCache(key : number, data : ISiteUser) { this.userDataCache[key] = data; }
    public AddCallCache(key : number) { this.callUserDataCache[key] = true; }


}

export {SynodDataCache}