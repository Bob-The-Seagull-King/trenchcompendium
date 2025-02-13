import { ICompendiumItemData, CompendiumItem } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';
import { ITableItem } from './tableitem';
import { TableItemFactory } from '../../../factories/features/TableItemFactory';

interface ITable extends ICompendiumItemData {
    description: [] // Description of the table,
    colnames: string[], // Names of each of the columns
    items: ITableItem[] // items in the column
}

class TableBody extends CompendiumItem {

    public readonly Description
    public readonly ColNames;
    public readonly Items;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     */
    public constructor(data: ITable)
    {
        super(data)
        this.Description = DescriptionFactory(data.description, this);
        this.ColNames = data.colnames;
        this.Items = TableItemFactory.CreateTableItems(data.items);
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

export {ITable, TableBody}

