import { CompendiumItem, ICompendiumItemData, ItemType } from '../../../CompendiumItem'
import { DescriptionFactory } from '../../../../utility/functions';
import { INote } from '../../../Note';

interface IWarbandContextItem {
    id : string,
    value_ducat: number,
    value_glory: number
}

class WarbandContextItem {
    public ValueDucat;
    public ValueGlory;
    public ID;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandContextItem)
    {
        this.ID = data.id;
        this.ValueDucat = data.value_ducat;
        this.ValueGlory = data.value_glory;
    }

    public ConvertToInterface() {
        const _objint : IWarbandContextItem = {
            id : this.ID,
            value_ducat: this.ValueDucat,
            value_glory: this.ValueGlory
        }
        
        return _objint;
    }

}

export {IWarbandContextItem, WarbandContextItem}

