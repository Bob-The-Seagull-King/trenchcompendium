/**
 * explorationtable
 */
import { byPropertiesOf, DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { ExplorationLocation, IExplorationLocation } from './ExplorationLocation';
import { Requester } from '../../../factories/Requester';
import { ExplorationFactory } from '../../../factories/features/ExplorationFactory';


class ExplorationTable extends StaticContextObject {
    public ExplorationLocations : ExplorationLocation[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IContextObject, parent : ContextObject | null)
    {
        super(data, parent)
    }

    
    public async BuildFactionEquipment(id : string) {
        const LocationList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "explorationlocation",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "tags",
                                value: "exploration_table",
                                equals: true,
                                strict: true,
                                istag : true,
                                tagvalue: id
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IExplorationLocation[]

        
        LocationList.sort(byPropertiesOf<IExplorationLocation>(["location_value"]))

        for (let i = 0; i < LocationList.length; i++) {
            this.ExplorationLocations.push(await ExplorationFactory.CreateExplorationLocation(LocationList[i], this))
        }
    }

}

export {ExplorationTable}

