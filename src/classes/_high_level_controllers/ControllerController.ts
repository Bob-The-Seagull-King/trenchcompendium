import { CollectionsListPage } from "./../viewmodel/pages/CollectionListPage"

/**
 * Contains the Controller objects for 'Collection' pages.
 * These controllers are the gallery type page, and each page has
 * its own controller.
 */
class ControllerController {
   
    GlossaryCollectionController;
    KeywordCollectionController;
    ModelCollectionController;
    EquipmentCollectionController;
    FactionCollectionController;
    ScenarioCollectionController;
    GameRulesCollectionController;
    CampaignRulesCollectionController;
    ExplorationTableCollectionController;

    /**
     * Initializes all controllers, this also means all searching
     * is done at once on the page load.
     */
    constructor () {
        this.GlossaryCollectionController = new CollectionsListPage('glossary');
        this.KeywordCollectionController = new CollectionsListPage('keyword');
        this.ModelCollectionController = new CollectionsListPage('model');
        this.EquipmentCollectionController = new CollectionsListPage('equipment');
        this.FactionCollectionController = new CollectionsListPage('faction');
        this.ScenarioCollectionController = new CollectionsListPage('scenario');
        this.GameRulesCollectionController = new CollectionsListPage('gamerule');
        this.CampaignRulesCollectionController = new CollectionsListPage('campaignrule');
        this.ExplorationTableCollectionController = new CollectionsListPage('explorationtable');
    }
}

export {ControllerController}