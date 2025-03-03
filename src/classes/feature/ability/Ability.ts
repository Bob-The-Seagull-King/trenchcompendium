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

interface IAbility extends IBaseAddon {
    ability_category? : string
}

class Ability extends BaseAddon {
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IAbility, parent : ContextObject | null)
    {
        super(data, parent)
    }

}

export {IAbility, Ability}

