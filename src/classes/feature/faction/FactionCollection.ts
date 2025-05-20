/**
 * 
 * For any given MODEL, its ModelCollection contains the base
 * as well as building any relevant variant models
 * 
 */
import { IStaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { Requester } from '../../../factories/Requester';
import { DescriptionFactory, MergeLists } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { IFaction, Faction } from './Faction';
import { FactionFactory } from '../../../factories/features/FactionFactory';

interface IVariantFaction extends IStaticOptionContextObject {
    team: string,
    description: [],
    rules: string[],
    cut_rules: string[],
    base_id: string
}

interface FactionVar {
    var_name: string,
    faction: Faction
}

class FactionCollection extends StaticContextObject {
    
    public FactionDataList: IFaction[] = [];
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
        this.GatherLists(data);
    }

    public GatherLists(data : IFaction) {
        this.FactionDataList.push(data) // Base Model
        const FactionVariantList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "factionvariant",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "base_id",
                                value: data.id,
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IVariantFaction[]

        for (let i = 0; i < FactionVariantList.length; i++) {
            const BasedModelData : IFaction = FactionCollection.MergeFactions(data, FactionVariantList[i]);
            this.FactionDataList.push(BasedModelData);
        }
    }

    public static MergeFactions(base: IFaction, variant : IVariantFaction) {
        const rules_final : string[] = MergeLists([base.rules, variant.rules], [variant.cut_rules])
        
        const NewFaction : IFaction = {
            id: variant.id, 
            name: variant.name, 
            source: variant.source,
            tags: { ...base.tags, ...variant.tags },
            contextdata : { ...base.contextdata, ...variant.contextdata },
            description: (variant.description? variant.description : base.description),
            team: variant.team,
            rules : rules_final,
            variant_name: variant.name,
            options: variant.options
        }

        return NewFaction;
    }

    public async ConstructFactions() {
        for (let i = 0; i < this.FactionDataList.length; i++) {
            const FactionObject : Faction = await FactionFactory.CreateFaction(this.FactionDataList[i], this.MyContext)
            this.SubModelsList.push( { var_name: FactionObject.Variant, faction: FactionObject });
        }
    }

    public GetBaseFac() {
        for (let i = 0; i < this.SubModelsList.length; i++) {
            if (this.SubModelsList[i].var_name == 'base') {
                return this.SubModelsList[i].faction;
            }
        }
        return this.SubModelsList[0].faction;
    }


    /**
     * Returns the base name for this faction collection
     */
    public GetBaseName () {
        for (let i = 0; i < this.SubModelsList.length; i++) {
            if (this.SubModelsList[i].var_name == 'base') {
                return this.SubModelsList[i].faction.Name;
            }
        }
        return ""
    }


    /**
     * Returns the Display name for this faction collection
     * @TODO: return display name like "Cult of the black grail" or "Dirge of the great hegemon"
     */
    public GetDisplayName() {
        return '';
    }

    /**
     * Return a string for the description of this faction.
     * @TODO: This should be like the first paragraph of the lore
     */
    public GetDescription () {
        return '';
    }

}

export {IVariantFaction, FactionCollection}

