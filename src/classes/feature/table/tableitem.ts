import { ICompendiumItemData, CompendiumItem } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';

/**
 * Data structure for the player addon's
 */
interface ITableItem extends ICompendiumItemData {
    description: any[] // Descriptive text of the Addon
}

class TableItem extends CompendiumItem {
    public readonly Description;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IPlayerAddon format
     */
    public constructor(data: ITableItem)
    {
        super(data)
        this.Description = DescriptionFactory(data.description, this);
    }
    
    /**
     * When destroyed, also delete all associated
     * addon objects.
     */
    destructor() {
        let i = 0;
        for (i = 0; i < this.Description.length; i++) {
            delete this.Description[i];
        }
    }
}

export { ITableItem, TableItem}

