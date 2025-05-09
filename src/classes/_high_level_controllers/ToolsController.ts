import { ItemManager } from '../saveitems/itemmanager';
import { ContentPackManager } from '../contentpacks/contentmanager'
import { ScenarioGenerator } from '../feature/scenario/ScenarioGenerator';
import { WarbandManager } from '../saveitems/Warband/WarbandManager';

/**
 * Contains the Controller objects for 'Tools' pages.
 * These controllers are varied, but each page should be given
 * one to help manage data and instances of objects.
 */
class ToolsController {
   
    
    private static instance: ToolsController;
    //ContentManager;
    //SaveItemManager;
    RandomScenarioManager;
    UserWarbandManager

    /**
     * Initializes all controllers, this also means all initialization
     * is done at once on the page load.
     */
    constructor () {
        this.UserWarbandManager = new WarbandManager();
        this.RandomScenarioManager = new ScenarioGenerator();
        this.UserWarbandManager.GetItemsAll();
    }

    public static getInstance(): ToolsController {
        if (!ToolsController.instance) {
            ToolsController.instance = new ToolsController();
        }
        return ToolsController.instance;
    }

}

export {ToolsController}