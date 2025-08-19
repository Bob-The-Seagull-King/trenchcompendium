import { ContextObject } from '../../contextevent/contextobject';
import { BaseAddon, IBaseAddon } from './BaseAddon';

interface IAbility extends IBaseAddon {
    ability_category? : string
}

// Model abilities, including traits and actions
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

