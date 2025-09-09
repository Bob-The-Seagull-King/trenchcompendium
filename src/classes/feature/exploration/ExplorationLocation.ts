/**
 * explorationlocation
 */
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { EventRunner } from '../../contextevent/contexteventhandler';

interface IExplorationLocation extends IStaticOptionContextObject {
    description: [],
    location_value : number
}

// Determines what warbands can actually select this location
interface LocationRestriction {
    allowed?: RestrictionSingle[],
    removed?: RestrictionSingle[],
    restricted?: RestrictionSingle[],
    permitted?: RestrictionSingle[],
    banned?: RestrictionSingle[]
}

interface RestrictionSingle {
    tag? : string,
    base_only?: boolean,
    type : string,
    value : string[]
}

class ExplorationLocation extends StaticOptionContextObject {
    public Description;
    public TableValue : number;

    public RestrictedSelection : LocationRestriction[] | null = null;

    /**
     * Assigns parameters and creates a series of objects
     * @param data Object data in IExplorationLocation format
     */
    public constructor(data: IExplorationLocation, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
        this.TableValue = data.location_value;
    }
    
    // Runs the restriction check on this instance of a location
    // Only works when created with the context of a warband.
    public async RunRestrictions() {
        const EventProc : EventRunner = new EventRunner();

        this.RestrictedSelection  = await EventProc.runEvent(
            "getLocationRestrictions",
            this,
            [],
            [],
            null
        )
    }

    // Converts the options a location might have
    // from raw JSON data into the proper class
    public async RunOptionsParse() {
        
        const EventProc : EventRunner = new EventRunner();
        for (let i = 0; i < this.MyOptions.length; i++) {
            const result = await EventProc.runEvent(
                "parseOptionsIntoRelevantType",
                this,
                [],
                this.MyOptions[i].Selections,
                i
            )
            this.MyOptions[i].Selections = result;
        }
    }

}

export {IExplorationLocation, ExplorationLocation, LocationRestriction}

