import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject } from '../../contextevent/contextobject';

interface IBaseAddon extends IStaticOptionContextObject {
    description: []
}

// The base form of addons, general term for static options with a description
class BaseAddon extends StaticOptionContextObject {
    public Description;
    
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IBaseAddon format
     */
    public constructor(data: IBaseAddon, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
    }

}

export {IBaseAddon, BaseAddon}

