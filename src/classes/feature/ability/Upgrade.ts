import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { BaseAddon, IBaseAddon } from './BaseAddon';

interface IUpgrade extends IBaseAddon {
    upgrade_category? : string
}

class Upgrade extends BaseAddon {
    
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IUpgrade format
     */
    public constructor(data: IUpgrade, parent : ContextObject | null)
    {
        super(data, parent)        
    }

    /**
     * Gets the category of an upgrade, returning the default 
     * 'upgrades' if none provided.
     * @returns the special category, if any, of an upgrade
     */
    public GetSpecialCategory() {
        if (this.Tags['special_category']) {
            return this.Tags['special_category'].toString();
        } else {
            return 'upgrades';
        }
    }

}

export {IUpgrade, Upgrade}

