import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { IModel, Model } from '../../classes/feature/model/Model';
import { IVariantModel, ModelCollection } from '../../classes/feature/model/ModelCollection';
import { FactionModelRelationship, IFactionModelRelationship } from '../../classes/relationship/faction/FactionModelRelationship';
import { byPropertiesOf } from '../../utility/functions';

class ModelFactory {

    static async CreateModelCollection(_rule: IModel, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelcollection', _rule.id))
        if (isValid == false) {
            return cache.ModelCollectionCache[_rule.id];
        }
        
        const rule = new ModelCollection(_rule, parent)
        cache.AddToCache('modelcollection', rule);
        await rule.ConstructModels();
        return rule;
    }

    static async CreateNewModelCollection(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelcollection', _val))
        if (isValid == false) {
            return cache.ModelCollectionCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "model", id: _val}}) as IModel
        const rulenew = await ModelFactory.CreateModelCollection(ruledata, parent)
        return rulenew;
    }

    static async CreateModel(_rule: IModel, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('model', _rule.id))
        if (isValid == false) {
            if (cache.ModelCache[_rule.id].MyContext == null) {
                cache.ModelCache[_rule.id].MyContext = parent;
            }
            return cache.ModelCache[_rule.id];
        }
        const rule = new Model(_rule, parent)   
        cache.AddToCache('model', rule);
        await rule.RunEquipmentRestriction();
        await rule.RunEquipmentLimit();
        await rule.RunStatOptions();
        await rule.BuildKeywords(_rule.keywords);
        await rule.BuildAbilities(_rule.abilities);
        await rule.BuildModelUpgrades(_rule.id);
        await rule.BuildModelEquipment(_rule.id);
        await rule.BuildFactionModels(_rule.id);
        return rule;
    }

    
        
    static async GetAllModels(showspecial = false) {
        let models : IModel[] = []
        if (showspecial) {
            models = Requester.MakeRequest({searchtype: "file", searchparam: {type: "model"}}) as IModel[];
        } else {
            models = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "model",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "tags",
                                value: "dontshow",
                                equals: false,
                                strict: true,
                                istag : true,
                                tagvalue: true
                            }
                        ],
                        subparams: []
                    }
                }
            }) as IModel[]
        }
        models.sort(byPropertiesOf<IModel>(["name", "id"]))
        const ModelList : ModelCollection[] = []
        for (let i = 0; i < models.length; i++) {
            const skl = await ModelFactory.CreateModelCollection(models[i], null);
            if (skl != null) {
                ModelList.push(skl);
            }
        }

        const ModelIndividual : Model[] = [];

        for (let i = 0; i < ModelList.length; i++) {
            for (let j = 0; j < ModelList[i].SubModelsList.length; j++) {
                ModelIndividual.push(ModelList[i].SubModelsList[j].model)
            }
        }
        return ModelIndividual;
    }

    static async CreateNewModel(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('model', _val))
        if (isValid == false) {
            if (cache.ModelCache[_val].MyContext == null) {
                cache.ModelCache[_val].MyContext = parent;
            }
            return cache.ModelCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "model", id: _val}}) as IModel
        if (ruledata == null || ruledata == undefined || ruledata.id == undefined) {
            return await ModelFactory.CreateNewVariantModel(_val, parent);
        } else {
            const rulenew = await ModelFactory.CreateModel(ruledata, parent)
            return rulenew;
        }
    }

    static async CreateVariantModel(_base: IModel, varaint: IVariantModel, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('model', varaint.id))
        if (isValid == false) {
            return cache.ModelCache[varaint.id];
        }
        const BasedModelData : IModel = ModelCollection.MergeModels(_base, varaint);
        const rule = new Model(BasedModelData, parent)
        cache.AddToCache('model', rule);
        const Base = await ModelFactory.CreateModel(_base, parent);
        rule.BaseModel = Base;
        await rule.BuildKeywords(BasedModelData.keywords);
        await rule.BuildAbilities(BasedModelData.abilities);
        await rule.BuildModelUpgrades(BasedModelData.id);
        await rule.BuildModelEquipment(BasedModelData.id);
        await rule.BuildFactionModels(BasedModelData.id);
        return rule;
    }

    static async CreateNewVariantModel(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('model', _val))
        if (isValid == false) {
            return cache.ModelCache[_val];
        }
        const vardata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "modelvariant", id: _val}}) as IVariantModel
        const basedata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "model", id: vardata.base_id}}) as IModel
        const rulenew = await ModelFactory.CreateVariantModel(basedata, vardata, parent)
        return rulenew;
    }

    static async CreateFactionModel(_rule: IFactionModelRelationship, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factionmodel', _rule.id))
        if (isValid == false) {
            return cache.FactionModelCache[_rule.id];
        }
        const rule = new FactionModelRelationship(_rule, parent)
        cache.AddToCache('factionmodel', rule);
        await rule.BuildModel(_rule.model_id)
        await rule.BuildOptionModel()
        await rule.GetFactions(_rule.faction_id)
        return rule;
    }

    static async CreateNewFactionModel(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factionmodel', _val))
        if (isValid == false) {
            return cache.FactionModelCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "factionmodelrelationship", id: _val}}) as IFactionModelRelationship
        const rulenew = await ModelFactory.CreateFactionModel(ruledata, parent)
        return rulenew;
    }

}

export {ModelFactory}