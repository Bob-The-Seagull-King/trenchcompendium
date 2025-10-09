/**
 * 
 * For any given MODEL, its ModelCollection contains the base
 * as well as building any relevant variant models
 * 
 */
import { ContextObject } from '../../contextevent/contextobject';
import { BaseAddon, IBaseAddon } from './BaseAddon';

interface IInjury extends IBaseAddon {
    table_val : number[]
}

class Injury extends BaseAddon {
    public TableVal : string;

    /**
     * Assigns parameters and creates a series of objects
     * @param data Object data in IInjury format
     */
    public constructor(data: IInjury, parent : ContextObject | null)
    {
        super(data, parent)
        this.TableVal = data.table_val.join('-');
    }

}

export {IInjury, Injury}

