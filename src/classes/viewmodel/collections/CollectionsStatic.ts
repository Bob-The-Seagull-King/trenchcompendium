import { byPropertiesOf } from "../../../utility/functions";
import { ViewCollectionsModel } from "./ViewCollectionsModel";
import { ViewTableItem } from "./ViewTableItem";
import { getColour } from "../../../utility/functions";
import { IGlossaryRule, GlossaryRule } from "../../feature/glossary/Glossary";
import { GlossaryRuleFactory } from "../../../factories/features/GlossaryFactory";
import { IKeyword } from "../../feature/glossary/Keyword";
import { KeywordFactory } from "../../../factories/features/KeywordFactory";
import { IModel } from "../../feature/model/Model";
import { ModelFactory } from "../../../factories/features/ModelFactory";
import { IEquipment } from "../../feature/equipment/Equipment";
import { EquipmentFactory } from "../../../factories/features/EquipmentFactory";
import { IFaction } from "../../feature/faction/Faction";
import { FactionFactory } from "../../../factories/features/FactionFactory";
import { IScenario } from "../../feature/scenario/Scenario";
import { ScenarioFactory } from "../../../factories/features/ScenarioFactory";
import { IBookRule } from "../../feature/bookrules/BookRule";
import { BookRuleFactory } from "../../../factories/features/BookRuleFactory";

export interface CollectionType {
    searchId      : string,
    pageName      : string,
    sort          : string[],
    postSearch: (model : ViewCollectionsModel) => void;
}

export interface CollectionDataTable {[moveid: Lowercase<string>]: CollectionType}

export const CollectionDataDex : CollectionDataTable = {
    glossary: {
        searchId: 'glossary', 
        pageName: 'Glossary',
        sort: ["name", "id"],
        postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IGlossaryRule>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = GlossaryRuleFactory.CreateGlossaryRule(model.dataresults[i]);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    keyword: {
        searchId: 'keyword', 
        pageName: 'Keyword',
        sort: ["name", "id"],
        postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IKeyword>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = KeywordFactory.CreateKeyword(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    model: {
        searchId: 'model', 
        pageName: 'model',
        sort: ["name", "id"],
        postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IModel>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = ModelFactory.CreateModelCollection(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour(summonNew.Team));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    equipment: {
        searchId: 'equipment', 
        pageName: 'equipment',
        sort: ["name", "id"],
        postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IEquipment>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = EquipmentFactory.CreateEquipment(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    faction: {
        searchId: 'faction', 
        pageName: 'faction',
        sort: ["name", "id"],
        postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IFaction>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = FactionFactory.CreateFactionCollection(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour(summonNew.Team));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    scenario: {
        searchId: 'scenario', 
        pageName: 'scenario',
        sort: ["name", "id"],
        postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IScenario>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = ScenarioFactory.CreateScenario(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    gamerule: {
        searchId: 'gamerule', 
        pageName: 'gamerule',
        sort: ["item_index"],
        postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IBookRule>(["item_index"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = BookRuleFactory.CreateBookRule(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    campaignrule: {
        searchId: 'campaignrule', 
        pageName: 'campaignrule',
        sort: ["item_index"],
        postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IBookRule>(["item_index"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = BookRuleFactory.CreateBookRule(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    }
}