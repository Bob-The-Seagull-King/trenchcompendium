import { ISiteUser, SiteUser } from '../user_synod/site_user';
import { IAchievement } from '../user_synod/user_achievements';
import { ISiteUserPublic, SiteUserPublic } from '../user_synod/user_public';
import { IUserWarband } from '../saveitems/Warband/UserWarband';
import { Campaign, ICampaign } from '../saveitems/Campaign/Campaign';
import { CampaignUser } from '../saveitems/Campaign/CampaignUser';
import { CampaignAnnouncement } from '../saveitems/Campaign/CampaignAnnouncement';
import { CampaignWarband } from '../saveitems/Campaign/CampaignWarband';

/**
 * Stores non image data from Synod, to prevent uneeded 
 * calls from being made.
 */
class SynodDataCache {
   
    private static instance: SynodDataCache;    // basic in-memory cache
    
    // Gets the single instance of the cache
    public static getInstance(): SynodDataCache {
        if (!SynodDataCache.instance) {
            SynodDataCache.instance = new SynodDataCache();
        }
        return SynodDataCache.instance;
    }
    
    /* PRIVATE Users */

    userDataCache: Record<number, ISiteUser> = {}; // Cache of user data
    userObjectCache: Record<number, SiteUser> = {}; // Cache of user objects
    callUserDataCache: Record<number, boolean> = {}; // Objects that haven't been found, but are currently already being searched for
        
    public CheckCache(key : number) { return (this.userDataCache[key]) } // Sees if an object is in the cache
    public CheckCallCache(key : number) { return (this.callUserDataCache[key]) } // Sees if an object is in the process of being found

    public AddCache(key : number, data : ISiteUser) { this.userDataCache[key] = data; } // Adds an object to the cache
    public AddCallCache(key : number) { this.callUserDataCache[key] = true; } // Adds an identifier when the call for an object is first made

    /* PUBLIC Users */
    
    publicDataCache: Record<number, ISiteUserPublic> = {}; // Cache of user data
    publicObjectCache: Record<number, SiteUserPublic> = {}; // Cache of user objects
    callPublicDataCache: Record<number, boolean> = {}; // Objects that haven't been found, but are currently already being searched for
        
    public CheckPublicCache(key : number) { return (this.publicDataCache[key]) } // Sees if an object is in the cache
    public CheckPublicCallCache(key : number) { return (this.callPublicDataCache[key]) } // Sees if an object is in the process of being found

    public AddPublicCache(key : number, data : ISiteUserPublic) { this.publicDataCache[key] = data; } // Adds an object to the cache
    public AddPublicCallCache(key : number) { this.callPublicDataCache[key] = true; } // Adds an identifier when the call for an object is first made

    /* ACHIEVMENTS */
    
    achievmentDataCache: Record<number, IAchievement> = {}; // Cache of achievement data
    callAchievmentCache: Record<number, boolean> = {}; // Objects that haven't been found, but are currently already being searched for
        
    public CheckAchievementCache(key : number) { return (this.achievmentDataCache[key]) } // Sees if an object is in the cache
    public CheckAchievementCallCache(key : number) { return (this.callAchievmentCache[key]) } // Sees if an object is in the process of being found

    public AddAchievementCache(key : number, data : IAchievement) { this.achievmentDataCache[key] = data; } // Adds an object to the cache
    public AddAchievementCallCache(key : number) { this.callAchievmentCache[key] = true; } // Adds an identifier when the call for an object is first made

    /* WARBANDS */
    
    warbandDataCache: Record<number, IUserWarband> = {}; // Cache of warband data
    callWarbandCache: Record<number, boolean> = {};  // Objects that haven't been found, but are currently already being searched for
        
    public CheckWarbandCache(key : number) { return (this.warbandDataCache[key]) } // Sees if an object is in the cache
    public CheckWarbandCallCache(key : number) { return (this.callWarbandCache[key]) } // Sees if an object is in the process of being found

    public AddWarbandCache(key : number, data : IUserWarband) { this.warbandDataCache[key] = data; } // Adds an object to the cache
    public AddWarbandCallCache(key : number) { this.callWarbandCache[key] = true; } // Adds an identifier when the call for an object is first made

    /* Campaigns */
    
    campaignDataCache: Record<number, ICampaign> = {}; // Cache of warband data
    campaignObjectCache: Record<number, Campaign> = {}; // Cache of warband data
    callCampaignCache: Record<number, boolean> = {};  // Objects that haven't been found, but are currently already being searched for
        
    public CheckCampaignCache(key : number) { return this.campaignDataCache[key] !== undefined;  } // Sees if an object is in the cache
    public CheckCampaignObjectCache(key : number) { return this.campaignObjectCache[key] !== undefined; } // Sees if an object is in the cache
    public CheckCampaignCallCache(key : number) { return this.campaignObjectCache[key] !== undefined;  } // Sees if an object is in the process of being found

    public AddCampaignCache(key : number, data : ICampaign) { this.campaignDataCache[key] = data; } // Adds an object to the cache
    public AddCampaignObjectCache(key : number, data : Campaign) { this.campaignObjectCache[key] = data; } // Adds an object to the cache
    public AddCampaignCallCache(key : number) { this.callCampaignCache[key] = true; } // Adds an identifier when the call for an object is first made

    
    /* Campaigns User */
    
    campaignUserCache: Record<number, CampaignUser> = {}; // Cache of warband data
        
    public CheckCampaignUserCache(key : number) { return this.campaignUserCache[key] !== undefined;  } // Sees if an object is in the cache
    public AddCampaignUserCache(key : number, data : CampaignUser) { this.campaignUserCache[key] = data; } // Adds an object to the cache
    
    /* Campaigns Announcement */
    
    campaignAnnouncementCache: Record<number, CampaignAnnouncement> = {}; // Cache of warband data
        
    public CheckCampaignAnnouncementCache(key : number) { return this.campaignAnnouncementCache[key] !== undefined; } // Sees if an object is in the cache
    public AddCampaignAnnouncementCache(key : number, data : CampaignAnnouncement) { this.campaignAnnouncementCache[key] = data; } // Adds an object to the cache
    
    /* Campaigns Warband */
    
    campaignWarbandCache: Record<number, CampaignWarband> = {}; // Cache of warband data
        
    public CheckCampaignWarbandCache(key : number) { return this.campaignWarbandCache[key] !== undefined; } // Sees if an object is in the cache
    public AddCampaignWarbandCache(key : number, data : CampaignWarband) { this.campaignWarbandCache[key] = data; } // Adds an object to the cache

}

export {SynodDataCache}