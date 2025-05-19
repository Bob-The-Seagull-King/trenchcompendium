import { FilterItem, FilterRange, FilterTag, FilterText, IFilterItem, IFilterRange, IFilterTag, IFilterText } from "./FilterInterfaces";
import { Requester } from "../../../../factories/Requester";
import { ModelFactory } from "../../../../factories/features/ModelFactory";

export interface FilterType {
    searchId      : string,
    variantSearch?: VariantSearch,
    findText?: () => FilterText[],
    findMisc?: () => FilterItem[],
    findTags?: () => FilterTag[],
    findRange?: () => FilterRange[]
}

export interface VariantSearch {
    item_type : string,
    base_var_key : string,
    base_var_type : string
}

export interface FilterDataTable {[moveid: Lowercase<string>]: FilterType}

export const FitlerDataDex : FilterDataTable = {
    glossary: {
        searchId: 'glossary',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    keyword: {
        searchId: 'keyword',
        findTags() {
            const tempTags: FilterTag[] = []
            const foundTags = (Requester.MakeRequest({ searchtype: 'tags', searchparam: { type: 'keyword' } })).sort();
    
            let i = 0;
            for (i = 0; i < foundTags.length; i++) {
                const tempTagText: IFilterText = { group: "tags", val: "", isstrict: false}
                const tempTagObject: IFilterItem = { group: "tags", isactive: false, doinclude: false, name: foundTags[i]}
                const tempTagInterface: IFilterTag = { group: "tags", tagtype: tempTagObject, tagval: tempTagText }
                const tempTagConstructed = new FilterTag(tempTagInterface);
                tempTags.push(tempTagConstructed);
            }
    
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            const keytypes = ["source"]
            keytypes.sort();
    
            let i = 0;
            for (i = 0; i < keytypes.length; i ++) {
                const foundVals = Requester.MakeRequest({ searchtype: 'keyvalues', searchparam: { type: 'keyword' , id: keytypes[i]} }).sort();
                
                let j = 0;
                for (j = 0; j < foundVals.length; j++) {
                    const tempItemObject: IFilterItem = { group: keytypes[i], isactive: false, doinclude: false, name: foundVals[j]}
                    const tempItemConstructed = new FilterItem(tempItemObject);
                    tempMisc.push(tempItemConstructed);
                }
            }
    
            return tempMisc;
        },
        findText() {
            return [new FilterText({group: "name", val: "", isstrict: false})]
        }
    },
    model: {
        searchId: 'model',
        variantSearch: {
            item_type : "modelvariant",
            base_var_key : "base_id",
            base_var_type : "model"
        },
        findTags() {
            const tempTags: FilterTag[] = []
            const foundTags = (Requester.MakeRequest({ searchtype: 'tags', searchparam: { type: 'model' } })).sort();
            const foundTagsVariant = (Requester.MakeRequest({ searchtype: 'tags', searchparam: { type: 'modelvariant' } })).sort();
    
            const allTags = Array.from(new Set([...foundTags, ...foundTagsVariant]));

            let i = 0;
            for (i = 0; i < allTags.length; i++) {
                const tempTagText: IFilterText = { group: "tags", val: "", isstrict: false}
                const tempTagObject: IFilterItem = { group: "tags", isactive: false, doinclude: false, name: allTags[i]}
                const tempTagInterface: IFilterTag = { group: "tags", tagtype: tempTagObject, tagval: tempTagText }
                const tempTagConstructed = new FilterTag(tempTagInterface);
                tempTags.push(tempTagConstructed);
            }
    
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            const keytypes = ["source","keywords"]
            keytypes.sort();
    
            let i = 0;
            for (i = 0; i < keytypes.length; i ++) {
                const foundVals = (keytypes[i] == "variant_name")? [] : Requester.MakeRequest({ searchtype: 'keyvalues', searchparam: { type: 'model' , id: keytypes[i]} }).sort();
                const foundValsVariant = Requester.MakeRequest({ searchtype: 'keyvalues', searchparam: { type: 'modelvariant' , id: keytypes[i]} }).sort();
                let allVals = Array.from(new Set([...foundVals, ...foundValsVariant]));
                
                if (keytypes[i] == "keywords") {
                    const tempallVals = []
                    for (let j = 0; j < allVals.length; j++) {
                        for (let k = 0; k < allVals[j].length; k++) {
                            tempallVals.push(allVals[j][k])
                        }
                    }

                    allVals = Array.from(new Set([...tempallVals]));
                }

                let j = 0;
                for (j = 0; j < allVals.length; j++) {
                    const tempItemObject: IFilterItem = { group: keytypes[i], isactive: false, doinclude: false, name: allVals[j]}
                    const tempItemConstructed = new FilterItem(tempItemObject);
                    tempMisc.push(tempItemConstructed);
                }
            }
    
            return tempMisc;
        },
        findText() {
            return [new FilterText({group: "name", val: "", isstrict: false})]
        }
    },
    armoury: {
        searchId: 'equipment',
        findTags() {
            const tempTags: FilterTag[] = []
    
            const allTags = (Requester.MakeRequest({ searchtype: 'tags', searchparam: { type: 'equipment' } })).sort();

            let i = 0;
            for (i = 0; i < allTags.length; i++) {
                const tempTagText: IFilterText = { group: "tags", val: "", isstrict: false}
                const tempTagObject: IFilterItem = { group: "tags", isactive: false, doinclude: false, name: allTags[i]}
                const tempTagInterface: IFilterTag = { group: "tags", tagtype: tempTagObject, tagval: tempTagText }
                const tempTagConstructed = new FilterTag(tempTagInterface);
                tempTags.push(tempTagConstructed);
            }
    
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            const keytypes = ["source","category","keywords"]
            keytypes.sort();
    
            let i = 0;
            for (i = 0; i < keytypes.length; i ++) {
                let allVals = Requester.MakeRequest({ searchtype: 'keyvalues', searchparam: { type: 'equipment' , id: keytypes[i]} }).sort();
                
                if (keytypes[i] == "keywords") {
                    const tempallVals = []
                    for (let j = 0; j < allVals.length; j++) {
                        for (let k = 0; k < allVals[j].length; k++) {
                            tempallVals.push(allVals[j][k])
                        }
                    }

                    allVals = Array.from(new Set([...tempallVals]));
                }

                let j = 0;
                for (j = 0; j < allVals.length; j++) {
                    const tempItemObject: IFilterItem = { group: keytypes[i], isactive: false, doinclude: false, name: allVals[j]}
                    const tempItemConstructed = new FilterItem(tempItemObject);
                    tempMisc.push(tempItemConstructed);
                }
            }
    
            return tempMisc;
        },
        findText() {
            return [new FilterText({group: "name", val: "", isstrict: false})]
        }
    },
    faction: {
        searchId: 'faction',
        variantSearch: {
            item_type : "factionvariant",
            base_var_key : "base_id",
            base_var_type : "faction"
        },
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    scenario: {
        searchId: 'scenario',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    gamerule: {
        searchId: 'gamerule',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    errata: {
        searchId: 'errata',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    campaignrule: {
        searchId: 'campaignrule',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    explorationtable: {
        searchId: 'explorationtable',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    injury: {
        searchId: 'injury',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    skillgroup: {
        searchId: 'skillgroup',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    },
    patron: {
        searchId: 'patron',
        findTags() {
            const tempTags: FilterTag[] = []
            return tempTags;
        },
        findMisc() {
            const tempMisc: FilterItem[] = []
            return tempMisc;
        },
        findText() {
            return []
        }
    }
}