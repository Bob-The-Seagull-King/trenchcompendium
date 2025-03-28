import { CompendiumItem, ObjectTag } from "../classes/CompendiumItem";
import { AdvancedDescription } from "../classes/AdvancedDescription";
import { ObjectImage } from "../classes/ObjectImage";
import { Requester } from "../factories/Requester";
import { IObjectImage } from "../classes/ObjectImage";
import { AdvancedDescriptionItemFactory } from "../factories/components/AdvancedDescriptionItemFactory";

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

export function DescriptionFactory(data: any[], parent : any | null) {
    let i = 0;
    const array: AdvancedDescription[] = []
    for (i = 0; i < data.length; i++) {
        const tempAD = AdvancedDescriptionItemFactory.CreateAdvancedDescriptionItem(data[i], parent)
        array.push(tempAD)
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