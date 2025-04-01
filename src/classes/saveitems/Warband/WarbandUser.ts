import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './WarbandContextItem';

interface IWarbandUser {
    name : String;
}

class WarbandUser {
    public Name;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandUser)
    {
        this.Name = data.name;
    }

    public ConvertToInterface() {
        const _objint : IWarbandUser = {
            name : this.Name
        }
        
        return _objint;
    }

}

export {IWarbandUser, WarbandUser}

