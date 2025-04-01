import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './High_Level/WarbandContextItem';
import { IWarbandExplorationSet, WarbandExplorationSet } from './Exploration/WarbandExplorationSet';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { IContextObject } from '../../contextevent/contextobject';

interface IWarbandContentItem extends IContextObject {
    id : string,
    ducat_bank : number,
    glory_bank : number,
    context : IWarbandContextItem;
    exploration : IWarbandExplorationSet
}

class WarbandContentItem extends DynamicContextObject {
    public ID;
    public Context : WarbandContextItem;
    public Exploration : WarbandExplorationSet;
    public Ducats;
    public Glory;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandContentItem)
    {
        super(data, null)
        this.ID = data.id;
        this.Context = new WarbandContextItem(data.context);
        this.Exploration = new WarbandExplorationSet(data.exploration, this)
        this.Ducats = data.ducat_bank;
        this.Glory = data.glory_bank;
    }

    public ConvertToInterface() {
        const _objint : IWarbandContentItem = {
            id : this.ID,
            context : this.Context.ConvertToInterface(),
            exploration : this.Exploration.ConvertToInterface(),
            contextdata : this.ContextData,   
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags,
            ducat_bank: this.Ducats,
            glory_bank: this.Glory
        }
        
        return _objint;
    }

}

export {IWarbandContentItem, WarbandContentItem}

