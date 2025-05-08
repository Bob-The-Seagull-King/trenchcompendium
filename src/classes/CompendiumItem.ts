import { Requester } from "../factories/Requester";
import { IObjectImage, ObjectImage } from "./ObjectImage";

/**
 * Basic data package for any Item
 */
interface ICompendiumItemData {
    id: string, // The id of the item
    name: string, // The name of the item
    source: string, // The source of the item (core book, homebrew, etc)
    tags: ObjectTag // Tags associated with that item (used for sorting and synergies)
}

type ObjectTag = {[_name : string] : string | boolean | number | null | []}

enum ItemType {
    None = '',
    GlossaryRule = 'Glossary'
}

abstract class CompendiumItem {
    public Source;
    public ID;
    public Tags;
    public Name;

    /**
     * Assigns data values to the parameters of the item
     * @param data The item data
     */
    public constructor(data?: ICompendiumItemData)
    {
        if (data) {
            this.ID = data.id;
            this.Source = data.source;
            this.Name = data.name;
            this.Tags = data.tags;
        } else {
            this.Tags = {};
            this.ID = "";
        }
    }

    /**
     * Return Name as string
     */
    GetName () {
        return this.Name;
    }

    /**
     * Return ID as string
     */
    GetID () {
        return this.ID;
    }
}

export {ICompendiumItemData, CompendiumItem, ItemType, ObjectTag}