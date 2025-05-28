import { ItemManager } from '../saveitems/itemmanager';
import { ContentPackManager } from '../contentpacks/contentmanager'
import { ScenarioGenerator } from '../feature/scenario/ScenarioGenerator';
import { WarbandManager } from '../saveitems/Warband/WarbandManager';


export interface SynodImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
}

export interface SynodProfilePicData {
    urls: any; // Record<string, string>
    id: string;
}

/**
 * Gets synod image data for a model by its slug
 */


export interface ModelImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
    imageId: number;
    modelName: string;
    modelId: number;
    loading: boolean;
    error: boolean;
}


/**
 * Gets synod image data for a faction by its slug
 */

export interface FactionImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
    imageId: number;
    factionName: string;
    factionId: number;
    loading: boolean;
    error: boolean;
}

/**
 * Contains the Controller objects for 'Tools' pages.
 * These controllers are varied, but each page should be given
 * one to help manage data and instances of objects.
 */
class SynodImageCache {
   

    private static instance: SynodImageCache;    // basic in-memory cache
    

    public static getInstance(): SynodImageCache {
        if (!SynodImageCache.instance) {
            SynodImageCache.instance = new SynodImageCache();
        }
        return SynodImageCache.instance;
    }


    // BASIC IMAGES
    imageDataCache: Record<string, SynodImageData> = {};
    callCache: Record<string, boolean> = {};
    
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

    // MODEL IMAGES
    imageModelCache: Record<string, ModelImageData> = {};
    callModelCache: Record<string, boolean> = {};
    
    public CheckModelCache(key : string) {
        return (this.imageModelCache[key])
    }
    public CheckModelCallCache(key : string) {
        return (this.callModelCache[key])
    }

    public AddModelCache(key : string, data : ModelImageData) {
        this.imageModelCache[key] = data;
    }
    public AddModelCallCache(key : string) {
        this.callModelCache[key] = true;
    }

    // FACTION IMAGES
    imageFactionCache: Record<string, FactionImageData> = {};
    callFactionCache: Record<string, boolean> = {};
    
    public CheckFactionCache(key : string) {
        return (this.imageFactionCache[key])
    }
    public CheckFactionCallCache(key : string) {
        return (this.callFactionCache[key])
    }

    public AddFactionCache(key : string, data : FactionImageData) {
        this.imageFactionCache[key] = data;
    }
    public AddFactionCallCache(key : string) {
        this.callFactionCache[key] = true;
    }

    // FACTION IMAGES
    imageProfileCache: Record<string, SynodProfilePicData> = {};
    callProfileCache: Record<string, boolean> = {};
    
    public CheckProfileCache(key : string) {
        return (this.imageProfileCache[key])
    }
    public CheckProfileCallCache(key : string) {
        return (this.callProfileCache[key])
    }

    public AddProfileCache(key : string, data : SynodProfilePicData) {
        this.imageProfileCache[key] = data;
    }
    public AddProfileCallCache(key : string) {
        this.callProfileCache[key] = true;
    }

}

export {SynodImageCache}