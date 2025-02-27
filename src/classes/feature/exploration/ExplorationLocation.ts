/**
 * explorationlocation
 */
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';

interface IExplorationLocation extends IStaticOptionContextObject {
    description: [],
    location_value : number
}

class ExplorationLocation extends StaticOptionContextObject {
    public Description;
    public TableValue : number;
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IExplorationLocation, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
        this.TableValue = data.location_value;
    }

}

export {IExplorationLocation, ExplorationLocation}

