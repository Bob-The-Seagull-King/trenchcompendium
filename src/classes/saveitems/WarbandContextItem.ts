import { CompendiumItem, ICompendiumItemData, ItemType } from '../CompendiumItem'
import { DescriptionFactory } from '../../utility/functions';
import { INote } from '../Note';

interface IWarbandContextItem {
    id : string,
    title : string
}

class WarbandContextItem {
    public Title;
    public ID;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandContextItem)
    {
        this.ID = data.id;
        this.Title = data.title;
    }

    public ConvertToInterface() {
        const _objint : IWarbandContextItem = {
            id : this.ID,
            title : this.Title
        }
        
        return _objint;
    }

}

export {IWarbandContextItem, WarbandContextItem}

