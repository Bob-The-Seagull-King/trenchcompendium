import { byPropertiesOf } from "../../../utility/functions";
import { ViewCollectionsModel } from "./ViewCollectionsModel";
import { ViewTableItem } from "./ViewTableItem";
import { getColour } from "../../../utility/functions";
import { IGlossaryRule, GlossaryRule } from "../../feature/glossary/Glossary";
import { GlossaryRuleFactory } from "../../../factories/features/GlossaryFactory";
import { IKeyword } from "../../feature/glossary/Keyword";
import { KeywordFactory } from "../../../factories/features/KeywordFactory";

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
    }
}