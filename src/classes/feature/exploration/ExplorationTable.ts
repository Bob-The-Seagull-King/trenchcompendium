/**
 * explorationtable
 */
import { byPropertiesOf, DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { ExplorationLocation, IExplorationLocation } from './ExplorationLocation';
import { Requester } from '../../../factories/Requester';
import { ExplorationFactory } from '../../../factories/features/ExplorationFactory';

interface IExplorationTable extends IContextObject {
    rarity : number
}


class ExplorationTable extends StaticContextObject {
    public ExplorationLocations : ExplorationLocation[] = [];
    public Rarity : number;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IExplorationTable, parent : ContextObject | null)
    {
        super(data, parent)
        this.Rarity = data.rarity
    }

    
    public async BuildFactionEquipment(id : string, skipcheck = false) {
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
            try {
                const Location = await ExplorationFactory.CreateExplorationLocation(LocationList[i], this, skipcheck)
                this.ExplorationLocations.push(Location)
            } catch(e) {
                console.log(LocationList[i])
                console.log(LocationList[i].options)
                console.log(LocationList[i].options.length)
                console.log(e)
            }
        }
    }

}

export {ExplorationTable, IExplorationTable}

