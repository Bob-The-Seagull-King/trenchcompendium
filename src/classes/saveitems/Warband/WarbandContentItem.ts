import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './WarbandContextItem';

interface IWarbandContentItem {
    id : string,
    title : string
    context : IWarbandContextItem;
}

class WarbandContentItem {
    public Title;
    public ID;
    public Context : WarbandContextItem;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandContentItem)
    {
        this.ID = data.id;
        this.Title = data.title;
        this.Context = new WarbandContextItem(data.context);
    }

    public ConvertToInterface() {
        const _objint : IWarbandContentItem = {
            id : this.ID,
            title : this.Title,
            context : this.Context.ConvertToInterface()
        }
        
        return _objint;
    }

}

export {IWarbandContentItem, WarbandContentItem}

