/**
 * 
 * For any given MODEL, its ModelCollection contains the base
 * as well as building any relevant variant models
 * 
 */
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';

interface IAbility extends IStaticOptionContextObject {
    description: []
}

class Ability extends StaticOptionContextObject {
    public Description;
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IAbility, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
    }

}

export {IAbility, Ability}

