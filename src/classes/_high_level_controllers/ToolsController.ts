import { ItemManager } from '../saveitems/itemmanager';
import { ContentPackManager } from '../contentpacks/contentmanager'
import { ScenarioGenerator } from '../feature/scenario/ScenarioGenerator';

/**
 * Contains the Controller objects for 'Tools' pages.
 * These controllers are varied, but each page should be given
 * one to help manage data and instances of objects.
 */
class ToolsController {
   
    ContentManager;
    SaveItemManager;
    RandomScenarioManager;

    /**
     * Initializes all controllers, this also means all initialization
     * is done at once on the page load.
     */
    constructor () {
        this.ContentManager = new ContentPackManager()
        this.SaveItemManager = new ItemManager();
        this.RandomScenarioManager = new ScenarioGenerator();
    }

}

export {ToolsController}