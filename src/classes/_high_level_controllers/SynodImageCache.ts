import { ItemManager } from '../saveitems/itemmanager';
import { ContentPackManager } from '../contentpacks/contentmanager'
import { ScenarioGenerator } from '../feature/scenario/ScenarioGenerator';
import { WarbandManager } from '../saveitems/Warband/WarbandManager';

/**
 * Contains the Controller objects for 'Tools' pages.
 * These controllers are varied, but each page should be given
 * one to help manage data and instances of objects.
 */
class SynodImageCache {
   
    
    private static instance: SynodImageCache;
    /**
     * Initializes all controllers, this also means all initialization
     * is done at once on the page load.
     */
    constructor () {
    }

    public static getInstance(): SynodImageCache {
        if (!SynodImageCache.instance) {
            SynodImageCache.instance = new SynodImageCache();
        }
        return SynodImageCache.instance;
    }

}

export {SynodImageCache}