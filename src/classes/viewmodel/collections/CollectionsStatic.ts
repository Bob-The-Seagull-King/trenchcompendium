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
import { ExplorationFactory } from "../../../factories/features/ExplorationFactory";
import { IContextObject } from "../../contextevent/contextobject";
import { IInjury } from "../../feature/ability/Injury";
import { InjuryFactory } from "../../../factories/features/InjuryFactory";
import { SkillFactory } from "../../../factories/features/SkillFactory";
import { IPatron } from "../../feature/skillgroup/Patron";

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
        async postSearch(model : ViewCollectionsModel) {
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
        async postSearch(model : ViewCollectionsModel) {
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
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IModel>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await ModelFactory.CreateModelCollection(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour(summonNew.Team));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    armoury: {
        searchId: 'equipment', 
        pageName: 'armoury',
        sort: ["name", "id"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IEquipment>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await EquipmentFactory.CreateEquipment(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    faction: {
        searchId: 'faction', 
        pageName: 'faction',
        sort: ["name", "id"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IFaction>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await FactionFactory.CreateFactionCollection(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour(summonNew.Team));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    scenario: {
        searchId: 'scenario', 
        pageName: 'scenario',
        sort: ["name", "id"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IScenario>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await ScenarioFactory.CreateScenario(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    gamerule: {
        searchId: 'gamerule', 
        pageName: 'gamerule',
        sort: ["item_index"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IBookRule>(["item_index"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await BookRuleFactory.CreateBookRule(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    errata: {
        searchId: 'errata', 
        pageName: 'errata',
        sort: ["item_index"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IBookRule>(["item_index"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await BookRuleFactory.CreateBookRule(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    campaignrule: {
        searchId: 'campaignrule', 
        pageName: 'campaignrule',
        sort: ["item_index"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IBookRule>(["item_index"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await BookRuleFactory.CreateBookRule(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    explorationtable: {
        searchId: 'explorationtable', 
        pageName: 'explorationtable',
        sort: ["id"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IContextObject>(["id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await ExplorationFactory.CreateExplorationTable(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    injury: {
        searchId: 'injury', 
        pageName: 'injury',
        sort: ["table_val"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IInjury>(["table_val"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await InjuryFactory.CreateInjury(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour('default'));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    skillgroup: {
        searchId: 'skillgroup', 
        pageName: 'skillgroup',
        sort: ["name", "id"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IContextObject>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await SkillFactory.CreateSkillGroup(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour("default"));
                model.itemcollection.push(ItemNew);
            }
        }
    },
    patron: {
        searchId: 'patron', 
        pageName: 'patron',
        sort: ["name", "id"],
        async postSearch(model : ViewCollectionsModel) {
            model.CleanupItems();
            model.CleanupCollection();
            let i = 0;
            model.dataresults.sort(byPropertiesOf<IPatron>(["name", "id"]))
            for (i = 0; i < model.dataresults.length; i++) {
                const summonNew = await SkillFactory.CreatePatron(model.dataresults[i], null);
                const ItemNew = new ViewTableItem(summonNew, getColour("default"));
                model.itemcollection.push(ItemNew);
            }
        }
    }
}