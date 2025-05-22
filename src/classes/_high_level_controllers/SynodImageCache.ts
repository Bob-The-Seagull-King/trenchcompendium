import { ItemManager } from '../saveitems/itemmanager';
import { ContentPackManager } from '../contentpacks/contentmanager'
import { ScenarioGenerator } from '../feature/scenario/ScenarioGenerator';
import { WarbandManager } from '../saveitems/Warband/WarbandManager';


export interface SynodImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
}

/**
 * Contains the Controller objects for 'Tools' pages.
 * These controllers are varied, but each page should be given
 * one to help manage data and instances of objects.
 */
class SynodImageCache {
   

    // basic in-memory cache
    imageDataCache: Record<string, SynodImageData> = {};
    callCache: Record<string, boolean> = {};
    
    private static instance: SynodImageCache;
    
    public CheckCache(key : string) {
        return (this.imageDataCache[key])
    }
    public CheckCallCache(key : string) {
        return (this.callCache[key])
    }

    public AddCache(key : string, data : SynodImageData) {
        this.imageDataCache[key] = data;
    }

    public AddCallCache(key : string) {
        this.callCache[key] = true;
    }

    public static getInstance(): SynodImageCache {
        if (!SynodImageCache.instance) {
            SynodImageCache.instance = new SynodImageCache();
        }
        return SynodImageCache.instance;
    }

}

export {SynodImageCache}