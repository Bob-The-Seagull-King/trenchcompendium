import { CollectionsListPage } from "./../viewmodel/pages/CollectionListPage"

/**
 * Contains the Controller objects for 'Collection' pages.
 * These controllers are the gallery type page, and each page has
 * its own controller.
 */
class ControllerController {

    private static instance: ControllerController;
   
    GlossaryCollectionController;
    KeywordCollectionController;
    ModelCollectionController;
    EquipmentCollectionController;
    FactionCollectionController;
    ScenarioCollectionController;
    GameRulesCollectionController;
    CampaignRulesCollectionController;
    ExplorationTableCollectionController;
    InjuryCollectionController;
    SkillGroupCollectionController;
    PatronCollectionController;
    ErrataRulesCollectionController;

    /**
     * Initializes all controllers, this also means all searching
     * is done at once on the page load.
     */
    constructor () {
        this.GlossaryCollectionController = new CollectionsListPage('glossary');
        this.KeywordCollectionController = new CollectionsListPage('keyword');
        this.ModelCollectionController = new CollectionsListPage('model');
        this.EquipmentCollectionController = new CollectionsListPage('armoury');
        this.FactionCollectionController = new CollectionsListPage('faction');
        this.ScenarioCollectionController = new CollectionsListPage('scenario');
        this.GameRulesCollectionController = new CollectionsListPage('gamerule');
        this.CampaignRulesCollectionController = new CollectionsListPage('campaignrule');
        this.ExplorationTableCollectionController = new CollectionsListPage('explorationtable');
        this.InjuryCollectionController = new CollectionsListPage('injury');
        this.SkillGroupCollectionController = new CollectionsListPage('skillgroup');
        this.PatronCollectionController = new CollectionsListPage('patron');
        this.ErrataRulesCollectionController = new CollectionsListPage('errata');
    }    

    // Gets the single instance of this cache
    public static getInstance(): ControllerController {
        if (!ControllerController.instance) {
            ControllerController.instance = new ControllerController();
        }
        return ControllerController.instance;
      }
}

export {ControllerController}