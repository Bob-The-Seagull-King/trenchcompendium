import { CompendiumItem, ObjectTag } from "../classes/CompendiumItem";
import { AdvancedDescription } from "../classes/AdvancedDescription";
import { ObjectImage } from "../classes/ObjectImage";
import { Requester } from "../factories/Requester";
import { IObjectImage } from "../classes/ObjectImage";
import { AdvancedDescriptionItemFactory } from "../factories/components/AdvancedDescriptionItemFactory";
import { BookRule } from "../classes/feature/bookrules/BookRule";
import { Equipment } from "../classes/feature/equipment/Equipment";
import { ExplorationLocation } from "../classes/feature/exploration/ExplorationLocation";
import { ExplorationTable } from "../classes/feature/exploration/ExplorationTable";
import { Faction } from "../classes/feature/faction/Faction";
import { Rule } from "../classes/feature/faction/Rule";
import { GlossaryRule } from "../classes/feature/glossary/Glossary";
import { Keyword } from "../classes/feature/glossary/Keyword";
import { Scenario } from "../classes/feature/scenario/Scenario";
import { GloriousDeed } from "../classes/feature/scenario/GloriousDeed";
import { Injury } from "../classes/feature/ability/Injury";
import { Patron } from "../classes/feature/skillgroup/Patron";
import { Skill } from "../classes/feature/ability/Skill";
import { SkillGroup } from "../classes/feature/skillgroup/SkillGroup";
import { Ability } from "../classes/feature/ability/Ability";
import { Model } from "../classes/feature/model/Model";
import { Upgrade } from "../classes/feature/ability/Upgrade";
import { ContextObject } from "../classes/contextevent/contextobject";
import { UserWarband } from "../classes/saveitems/Warband/UserWarband";

/**
 * Returns a capitalized version of a given string
 * @param stringVal The string to be capitalized
 * @returns The string with the first letter capitalized
 */
export function capitalizeString(stringVal: string) {
    if (stringVal.length > 0) {
        return stringVal[0].toUpperCase() + stringVal.slice(1).toLowerCase();
    }
    return "";
}

export function isValidList(listA: string[], bannedList: string[], requiredList: string[]): boolean {
    const hasBanned = bannedList.some(item => listA.includes(item));
    if (hasBanned) return false;

    if (requiredList.length > 0) {
        const hasRequired = requiredList.some(item => listA.includes(item));
        if (!hasRequired) return false;
    }

    return true;
}

export async function GetWarbandOrNull(object : ContextObject): Promise<null | UserWarband> {
    const { UserWarband } = await import("../classes/saveitems/Warband/UserWarband");
    let baseobject : ContextObject = object;
    if (object instanceof UserWarband) {
            return object;
        }
    for (let i = 0; i < 32; i++) {
        const tempobject : ContextObject | null = baseobject.MyContext;
        if (tempobject != null) {
            baseobject = tempobject;
            if (tempobject instanceof UserWarband) {
                return tempobject;
            }
        }
    }
    return null;
}

export function isstringdataID(stringval : string ) {
    const idsplits = stringval.split('_');
    if (idsplits.length > 1) {
        return (["gr","eq","el","et","fc","fv","rl","br","er","gl","kw","tb","sc","sr","gd","in","pt","sk","sg","ab","md","mv","up"].includes(idsplits[0]))
    }
    return false;
}

export async function convertstringIDtoName(stringval : string) {
    const idsplits = stringval.split('_');
    
    try {
        switch (idsplits[0]) {
            case "gr": {
                const { BookRuleFactory } = await import("../factories/features/BookRuleFactory");
                const realitem : BookRule = await BookRuleFactory.CreateNewBookRule(stringval, null)
                return realitem.GetTrueName();
            }        
            case "eq": {
                const { EquipmentFactory } = await import("../factories/features/EquipmentFactory");
                const realitem : Equipment = await EquipmentFactory.CreateNewEquipment(stringval, null)
                return realitem.GetTrueName();
            }         
            case "el": {
                const { ExplorationFactory } = await import("../factories/features/ExplorationFactory");
                const realitem : ExplorationLocation = await ExplorationFactory.CreateNewExplorationLocation(stringval, null)
                return realitem.GetTrueName();
            }           
            case "et": {
                const { ExplorationFactory } = await import("../factories/features/ExplorationFactory");
                const realitem : ExplorationTable = await ExplorationFactory.CreateNewExplorationTable(stringval, null)
                return realitem.GetTrueName();
            }            
            case "fc": {
                const { FactionFactory } = await import("../factories/features/FactionFactory");
                const realitem : Faction = await FactionFactory.CreateNewFaction(stringval, null)
                return realitem.GetTrueName();
            }           
            case "fv": {
                const { FactionFactory } = await import("../factories/features/FactionFactory");
                const realitem : Faction = await FactionFactory.CreateNewFaction(stringval, null)
                return realitem.GetTrueName();
            }              
            case "rl": {
                const { RuleFactory } = await import("../factories/features/RuleFactory");
                const realitem : Rule = await RuleFactory.CreateNewRule(stringval, null)
                return realitem.GetTrueName();
            }    
            case "br": {
                const { BookRuleFactory } = await import("../factories/features/BookRuleFactory");
                const realitem : BookRule = await BookRuleFactory.CreateNewBookRule(stringval, null)
                return realitem.GetTrueName();
            } 
            case "er": {
                const { BookRuleFactory } = await import("../factories/features/BookRuleFactory");
                const realitem : BookRule = await BookRuleFactory.CreateNewBookRule(stringval, null)
                return realitem.GetTrueName();
            }    
            case "gl": {
                const { GlossaryRuleFactory } = await import("../factories/features/GlossaryFactory");
                const realitem : GlossaryRule | null = await GlossaryRuleFactory.CreateNewGlossaryRule(stringval)
                if (realitem == null) {return makestringpresentable(stringval);}
                return realitem.Name? realitem.Name : makestringpresentable(stringval);
            }    
            case "kw": {
                const { KeywordFactory } = await import("../factories/features/KeywordFactory");
                const realitem : Keyword = await KeywordFactory.CreateNewKeyword(stringval, null)
                return realitem.GetTrueName();
            }    
            case "sc": {
                const { ScenarioFactory } = await import("../factories/features/ScenarioFactory");
                const realitem : Scenario = await ScenarioFactory.CreateNewScenario(stringval, null)
                return realitem.GetTrueName();
            }             
            case "sr": {
                const { RuleFactory } = await import("../factories/features/RuleFactory");
                const realitem : Rule = await RuleFactory.CreateNewScenarioRule(stringval, null)
                return realitem.GetTrueName();
            }              
            case "gd": {
                const { GloriousDeedFactory } = await import("../factories/features/GloriousDeedFactory");
                const realitem : GloriousDeed = await GloriousDeedFactory.CreateNewGloriousDeed(stringval, null)
                return realitem.GetTrueName();
            }                 
            case "in": {
                const { InjuryFactory } = await import("../factories/features/InjuryFactory");
                const realitem : Injury = await InjuryFactory.CreateNewInjury(stringval, null)
                return realitem.GetTrueName();
            }                 
            case "pt": {
                const { SkillFactory } = await import("../factories/features/SkillFactory");
                const realitem : Patron = await SkillFactory.CreateNewPatron(stringval, null)
                return realitem.GetTrueName();
            }                 
            case "sk": {
                const { SkillFactory } = await import("../factories/features/SkillFactory");
                const realitem : Skill = await SkillFactory.CreateNewSkill(stringval, null)
                return realitem.GetTrueName();
            }                   
            case "sg": {
                const { SkillFactory } = await import("../factories/features/SkillFactory");
                const realitem : SkillGroup = await SkillFactory.CreateNewSkillGroup(stringval, null)
                return realitem.GetTrueName();
            }                     
            case "ab": {
                const { AbilityFactory } = await import("../factories/features/AbilityFactory");
                const realitem : Ability = await AbilityFactory.CreateNewAbility(stringval, null)
                return realitem.GetTrueName();
            }                     
            case "md": {
                const { ModelFactory } = await import("../factories/features/ModelFactory");
                const realitem : Model = await ModelFactory.CreateNewModel(stringval, null)
                return realitem.GetTrueName();
            }                      
            case "mv": {
                const { ModelFactory } = await import("../factories/features/ModelFactory");
                const realitem : Model = await ModelFactory.CreateNewModel(stringval, null)
                return realitem.GetTrueName();
            }                      
            case "up": {
                const { UpgradeFactory } = await import("../factories/features/UpgradeFactory");
                const realitem : Upgrade = await UpgradeFactory.CreateNewUpgrade(stringval, null)
                return realitem.GetTrueName();
            }            
            default: {
                return BreadcrumbPresentable(stringval);
            }
        }
    } catch (e) {
        return BreadcrumbPresentable(stringval);
    }
}


export function DoesContainRestrictionType(restriction_list : any[], type_val : string) : boolean {
    for (let i = 0; i < restriction_list.length; i++) {
        const temp = restriction_list[i]
        if (temp.added) {
            let found_bad = false;
            let found_good = false;
            for (let j = 0; j < temp.added.length; j++) {
                if (temp.added[j].res_type == type_val) {found_bad = true;} else {found_good = true}
            }
            if (found_bad == true && found_good == false) {
                return true;
            }
        }
        if (temp.banned) {
            let found_bad = false;
            let found_good = false;
            for (let j = 0; j < temp.banned.length; j++) {
                if (temp.banned[j].res_type == type_val) {found_bad = true;} else {found_good = true}
            }
            if (found_bad == true && found_good == false) {
                return true;
            }
        }
        if (temp.permitted) {
            let found_bad = false;
            let found_good = false;
            for (let j = 0; j < temp.permitted.length; j++) {
                if (temp.permitted[j].res_type == type_val) {found_bad = true;} else {found_good = true}
            }
            if (found_bad == true && found_good == false) {
                return true;
            }
        }
        if (temp.removed) {
            let found_bad = false;
            let found_good = false;
            for (let j = 0; j < temp.removed.length; j++) {
                if (temp.removed[j].res_type == type_val) {found_bad = true;} else {found_good = true}
            }
            if (found_bad == true && found_good == false) {
                return true;
            }
        }
        if (temp.required) {
            let found_bad = false;
            let found_good = false;
            for (let j = 0; j < temp.required.length; j++) {
                if (temp.required[j].res_type == type_val) {found_bad = true;} else {found_good = true}
            }
            if (found_bad == true && found_good == false) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Takes a long string featuring underscores and turns it
 * into a form usable on the frontend.
 * @param stringVal The string to convert
 * @returns The string with "_" replaced with " " and all
 *          individual words capitalized.
 */
export function makestringpresentable(stringVal: string) {
    const headers = ['gl','id','kw']
    if (stringVal === null || stringVal === "") {
        return '-';
    }
    const pairedString = stringVal.toString().split("_"); 
    let stringreturned = "";
    
    let i = 0 
    for (i = 0; i < pairedString.length; i++) {
        if ((headers.includes(pairedString[i]))) {
            continue;
        }
        const tempstring = capitalizeString(pairedString[i])
        stringreturned = stringreturned + ((i == 0)?  "" : " ") + tempstring
    }
    return stringreturned;
}

export function isNumber(value?: string | number): boolean
{
   return ((value != undefined) && (value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

export function BreadcrumbPresentable(stringVal : string) {
    const rtrn = makestringpresentable(stringVal);

    const DirectSwapDict : Record<string, string> = {
        'faction' : "Factions"
    }

    if (DirectSwapDict[stringVal]) {
        return DirectSwapDict[stringVal]
    }

    return rtrn;
}

export function getMoveType(type : number) {
    if (type === undefined) {
        return 'Infantry'
    }

    switch (type) {
        case 0: {
            return "Infantry"
        }
        case 1: {
            return "Flying"
        }
        default: {
            return "default"
        }
    }
}

export function getPotential(type : number) {
    if (type === undefined) {
        return 'Standard'
    }

    switch (type) {
        case 0: {
            return "Standard"
        }
        case 1: {
            return "Limited"
        }
        default: {
            return "None"
        }
    }
}

export function getCostType(type : number) {
    if (type === undefined) {
        return 'Ducats'
    }

    switch (type) {
        case 0: {
            return "Ducats"
        }
        case 1: {
            return "Glory"
        }
        default: {
            return "Ducats"
        }
    }
}

export function getBaseSize(size : number[]) {
    return size.join('x') + "mm";
}

/**
 * Returns the class-colour based on the provided name
 * @param name The job or class of the given item
 * @returns The colour associated with that job or class
 */
export function getColour(name: string){

    if (name === undefined) {
        return 'default'
    }

    switch (name.toLowerCase()) {
        case "yellow": {
            return "yellow"
        }
        case "red": {
            return "red"
        }
        case "green": {
            return "green"
        }
        case "blue": {
            return "blue"
        }
        case "grey": {
            return "grey"
        }
        case "bgbase": {
            return "BgBase"
        }
        case "bgcard": {
            return "BgCard"
        }
        case "basictext": {
            return "BasicText"
        }
        case "highlighttext": {
            return "HighlightText"
        }
        default: {
            return "default"
        }
    }
}

/**
 * Checks if a tag-set contains a specific value
 * @param tag the array of {} tags
 * @param value the value of the tag_name to be checked
 * @returns Boolean, if one of the tags has tag_name
 * that matches the value.
 */
export function containsTag(tag: ObjectTag, value:string) {
    return (tag[value])? true : false;
}

/**
 * Gets the value of a tage from a tag array
 * @param tag the array of {} tags
 * @param value the tag_name to get the value of
 * @returns the val of a given tag, returns ""
 * if no tag exists within the param tag.
 */
export function getTagValue(tag: ObjectTag, value:string) {
    
    if (tag[value]) {
        return tag[value]
    } else {
        return "";
    }
}

export function getTagSetValue(tag:any, value:string) {
    let i = 0;
    
    if (tag.length === undefined) {
        if (tag[value]) {
            return tag[value]
        } else {
            return "";
        }
    }
    for (i = 0; i < tag.length; i++) {
        if (tag[i][value]) {
            return tag[i][value]
        }
    }
    return "";
}

export function GetObjectTagSpecialActionVal(tag: ObjectTag) {
    const Val = getTagValue(tag, 'example_a')
    if ((Val === 'eg_a')) {
        return "(A)"
    }

    const Int = getTagValue(tag, 'example_b')
    if (Int != "") {
        return "(B)"
    }

    return "";
}

/**
 * Finds the human-readable title for any given
 * page route.
 * @param _route The current route of the page.
 * @returns A string name for the route endpoint.
 */
export function getRouteName(_route: string) {
    switch (_route) {
        case '/compendium/gamerule': return "Game Rules";
        case '/compendium/campaignrule': return "Campaign Rules";
        case '/compendium/keyword': return "Keywords";
        case '/compendium/glossary': return "Glossary";
        case '/compendium/faction': return "Factions";
        case '/compendium/equipment': return "Equipment & Weapons";
        case '/compendium/model': return "Models";
        case '/compendium/scenario': return "Scenarios";
        case '/compendium/explorationtable': return "Locations";
        case '/compendium/injury': return "Injuries";
        case '/compendium/patron': return "Patrons";
        case '/compendium/skillgroup': return "Skills";
        default: return "Trench Crusade"
    }
}

type sortArg<T> = keyof T | `-${string & keyof T}`

/**
 * Returns a comparator for objects of type T that can be used by sort
 * functions, were T objects are compared by the specified T properties.
 *
 * @param sortBy - the names of the properties to sort by, in precedence order.
 *                 Prefix any name with `-` to sort it in descending order.
 */
export function byPropertiesOf<T extends object> (sortBy: Array<sortArg<T>>) {
    function compareByProperty (arg: sortArg<T>) {
        let key: keyof T
        let sortOrder = 1
        if (typeof arg === 'string' && arg.startsWith('-')) {
            sortOrder = -1
            // Typescript is not yet smart enough to infer that substring is keyof T
            key = arg.substr(1) as keyof T
        } else {
            // Likewise it is not yet smart enough to infer that arg here is keyof T
            key = arg as keyof T
        }
        return function (a: T, b: T) {
            const result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0

            return result * sortOrder
        }
    }

    return function (obj1: T, obj2: T) {
        let i = 0
        let result = 0
        const numberOfProperties = sortBy?.length
        while (result === 0 && i < numberOfProperties) {
            result = compareByProperty(sortBy[i])(obj1, obj2)
            i++
        }

        return result
    }
}

/**
 * Sorts an array of T by the specified properties of T.
 *
 * @param arr - the array to be sorted, all of the same type T
 * @param sortBy - the names of the properties to sort by, in precedence order.
 *                 Prefix any name with `-` to sort it in descending order.
 */
export function sort<T extends object> (arr: T[], ...sortBy: Array<sortArg<T>>) {
    arr.sort(byPropertiesOf<T>(sortBy))
}

export function DescriptionFactory(data: any, parent: any | null) {
    const list = Array.isArray(data) ? data : (data == null ? [] : [data]);
    const array: AdvancedDescription[] = [];
    for (let i = 0; i < list.length; i++) {
        array.push(AdvancedDescriptionItemFactory.CreateAdvancedDescriptionItem(list[i], parent));
    }
    return array;
}

export function ImageBuilder(source_obj : CompendiumItem) {
    const ImageList : ObjectImage[] = [];
    
    const _data = Requester.MakeRequest({searchtype: "complex", searchparam: {type: "images", request: {
        operator: "and",
        terms: [{
            item: "tags",
            value: source_obj.ID,
            equals: true,
            strict: false,
            istag: true,
            tagvalue: ""
        }],
        subparams: []
    }}}) as IObjectImage[]
    let i = 0;
    for (i = 0; i < _data.length; i++) {
        ImageList.push(new ObjectImage(_data[i]))
    }

    return ImageList;
}


export function MergeLists(add_lists : string[][], remove_lists : string[][]) {
    let FinalArray : string[] = []

    add_lists.forEach( _list => {
        FinalArray = FinalArray.concat(_list)
    })

    remove_lists.forEach( _list => {
        FinalArray = FinalArray.filter(item => !(_list.includes(item)))
    })
    
    FinalArray = FinalArray.filter((item, index) => FinalArray.indexOf(item) === index);
    FinalArray.sort((one, two) => (one > two ? -1 : 1));

    return FinalArray;
}