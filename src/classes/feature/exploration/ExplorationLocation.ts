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
        this.RunOptionsParse();
    }
    
    public RunOptionsParse() {
        
        const EventProc : EventRunner = new EventRunner();
        for (let i = 0; i < this.MyOptions.length; i++) {
            EventProc.runEvent(
                "parseOptionsIntoRelevantType",
                this,
                [],
                this.MyOptions[i].Selections,
                i
            ).then(result => {
                this.MyOptions[i].Selections = result;
                console.log(this);
            });
        }
    }

}

export {IExplorationLocation, ExplorationLocation}

