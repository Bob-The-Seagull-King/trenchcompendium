/**
 * 
 * For any given MODEL, its ModelCollection contains the base
 * as well as building any relevant variant models
 * 
 */
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { BaseAddon, IBaseAddon } from './BaseAddon';

interface IInjury extends IBaseAddon {
    table_val : number
}

class Injury extends BaseAddon {
    public TableVal : number;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IInjury, parent : ContextObject | null)
    {
        super(data, parent)
        this.TableVal = data.table_val;
    }

}

export {IInjury, Injury}

