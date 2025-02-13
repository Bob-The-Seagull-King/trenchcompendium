import { ITableItem, TableItem } from '../../classes/feature/table/tableitem'

class TableItemFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateTableItem(_item: ITableItem) {
        const item = new TableItem(_item)
        return item;
    }

    static CreateTableItems(_items : ITableItem[]) {
        const list : TableItem[] = []
        let i = 0;

        for (i = 0; i < _items.length ; i++) {
            list.push(TableItemFactory.CreateTableItem(_items[i]))
        }

        return list;
    }

}

export {TableItemFactory}