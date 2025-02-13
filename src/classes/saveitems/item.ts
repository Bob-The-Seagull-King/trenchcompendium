import { CompendiumItem, ICompendiumItemData, ItemType } from '../CompendiumItem'
import { DescriptionFactory } from '../../utility/functions';
import { INote } from '../Note';

interface IItem {
    id : string,
    title : string
}

class Item {
    public Title;
    public ID;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IItem)
    {
        this.ID = data.id;
        this.Title = data.title;
    }

    public ConvertToInterface() {
        const _objint : IItem = {
            id : this.ID,
            title : this.Title
        }
        
        return _objint;
    }

}

export {IItem, Item}

