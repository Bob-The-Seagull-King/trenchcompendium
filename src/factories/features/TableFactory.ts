import { Requester } from '../Requester';
import { ITable } from '../../classes/feature/table/tablebody'
import { TableBody } from '../../classes/feature/table/tablebody'
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';

class TableFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateTable(_table: ITable) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('table', _table.id))
        if (isValid == false) {
            return cache.GlossaryCache[_table.id];
        }
        const table = new TableBody(_table)
        cache.AddToCache('table', table);
        return table;
    }

    static CreateNewTable(_val : string) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('table', _val))
        if (isValid == false) {
            return cache.GlossaryCache[_val];
        }
        const tabledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "table", id: _val}}) as ITable
        const tablenew = TableFactory.CreateTable(tabledata)
        return tablenew;
    }

}

export {TableFactory}