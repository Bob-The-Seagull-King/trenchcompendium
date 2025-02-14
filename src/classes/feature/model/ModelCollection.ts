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
import { IModel, Model } from './Model';
import { MergeTwoStats, ModelStatistics } from './ModelStats';

interface IVariantModel extends IContextObject {
    base_id: string;
    description?: [];
    team: string;
    lore?: [];
    variant_name: string;
    stats : ModelStatistics;
    cut_keywords : string[];
    keywords : string[];
    cut_abilities : string[]
    new_abilities : string[]
}

interface ModelVar {
    var_name: string,
    model: Model
}

class ModelCollection extends StaticContextObject {
    
    public ModelDataList: IModel[] = [];
    public SubModelsList: ModelVar[] = []

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IModelCollection format
     */
    public constructor(data: IModel, parent : ContextObject | null)
    {
        super(data, parent)

        this.GatherLists(data);
        this.ConstructModels();
    }

    public GatherLists(data : IModel) {
        this.ModelDataList.push(data) // Base Model
        const ModelVariantList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "modelvariant",
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
        ) as IVariantModel[]

        for (let i = 0; i < ModelVariantList.length; i++) {
            const BasedModelData : IModel = ModelCollection.MergeModels(data, ModelVariantList[i]);
            this.ModelDataList.push(BasedModelData);
        }
    }

    public static MergeModels(base: IModel, variant : IVariantModel) {

        const keywords_final : string[] = MergeLists([base.keywords, variant.keywords], [variant.cut_keywords])
        const abilities_final : string[] = MergeLists([base.abilities, variant.new_abilities], [variant.cut_abilities])

        const NewModel : IModel = {
            id: variant.id, 
            name: variant.name, 
            source: variant.source,
            tags: { ...base.tags, ...variant.tags },
            contextdata : { ...base.contextdata, ...variant.contextdata },
            description: (variant.description? variant.description : base.description),
            lore: (variant.lore? variant.lore : base.lore),
            team: variant.team,
            stats : MergeTwoStats(base.stats, variant.stats),
            keywords : keywords_final,
            abilities : abilities_final,
            variant_name: variant.variant_name,
        }

        return NewModel;
    }

    public ConstructModels() {
        for (let i = 0; i < this.ModelDataList.length; i++) {
            const ModelObject : Model = ModelFactory.CreateModel(this.ModelDataList[i], this.MyContext)
            this.SubModelsList.push( { var_name: ModelObject.Variant, model: ModelObject });
        }
    }

}

export {IVariantModel, ModelCollection}

