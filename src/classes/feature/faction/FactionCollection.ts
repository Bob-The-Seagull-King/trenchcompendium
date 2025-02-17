/**
 * 
 * For any given MODEL, its ModelCollection contains the base
 * as well as building any relevant variant models
 * 
 */
import { Requester } from '../../../factories/Requester';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { DescriptionFactory, MergeLists } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { IFaction, Faction } from './Faction';

interface IVariantModel extends IContextObject {
}

interface FactionVar {
    var_name: string,
    faction: Faction
}

class ModelCollection extends StaticContextObject {
    
    public ModelDataList: IFaction[] = [];
    public SubModelsList: FactionVar[] = []
    public Team : string;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IModelCollection format
     */
    public constructor(data: IFaction, parent : ContextObject | null)
    {
        super(data, parent)

        this.Team = data.team;
    }


}

export {IVariantModel, ModelCollection}

