import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { BaseAddon, IBaseAddon } from './BaseAddon';

// A fireteam, which comes in several different types
class Fireteam extends BaseAddon {

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IBaseAddon, parent : ContextObject | null)
    {
        super(data, parent)
    }

}

export {Fireteam}

