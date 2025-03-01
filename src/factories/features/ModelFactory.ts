import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { IModel, Model } from '../../classes/feature/model/Model';
import { IVariantModel, ModelCollection } from '../../classes/feature/model/ModelCollection';
import { FactionModelRelationship, IFactionModelRelationship } from '../../classes/relationship/faction/FactionModelRelationship';

class ModelFactory {

    static CreateModelCollection(_rule: IModel, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelcollection', _rule.id))
        if (isValid == false) {
            return cache.ModelCollectionCache[_rule.id];
        }
        
        const rule = new ModelCollection(_rule, parent)
        cache.AddToCache('modelcollection', rule);
        return rule;
    }

    static CreateNewModelCollection(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelcollection', _val))
        if (isValid == false) {
            return cache.ModelCollectionCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "model", id: _val}}) as IModel
        const rulenew = ModelFactory.CreateModelCollection(ruledata, parent)
        return rulenew;
    }

    static CreateModel(_rule: IModel, parent : ContextObject | null) {
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
        rule.BuildFactionModels(_rule.id);
        return rule;
    }

    static CreateNewModel(_val : string, parent : ContextObject | null) {
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
            return ModelFactory.CreateNewVariantModel(_val, parent);
        } else {
            const rulenew = ModelFactory.CreateModel(ruledata, parent)
            return rulenew;
        }
    }

    static CreateVariantModel(_base: IModel, varaint: IVariantModel, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('model', varaint.id))
        if (isValid == false) {
            return cache.ModelCache[varaint.id];
        }
        const BasedModelData : IModel = ModelCollection.MergeModels(_base, varaint);
        const rule = new Model(BasedModelData, parent)
        cache.AddToCache('model', rule);
        rule.BuildFactionModels(BasedModelData.id);
        return rule;
    }

    static CreateNewVariantModel(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('model', _val))
        if (isValid == false) {
            return cache.ModelCache[_val];
        }
        const vardata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "modelvariant", id: _val}}) as IVariantModel
        const basedata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "model", id: vardata.base_id}}) as IModel
        const rulenew = ModelFactory.CreateVariantModel(basedata, vardata, parent)
        return rulenew;
    }

    static CreateFactionModel(_rule: IFactionModelRelationship, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factionmodel', _rule.id))
        if (isValid == false) {
            return cache.FactionModelCache[_rule.id];
        }
        const rule = new FactionModelRelationship(_rule, parent)
        cache.AddToCache('factionmodel', rule);
        rule.GetFactions(_rule.faction_id)
        return rule;
    }

    static CreateNewFactionModel(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factionmodel', _val))
        if (isValid == false) {
            return cache.FactionModelCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "factionmodelrelationship", id: _val}}) as IFactionModelRelationship
        const rulenew = ModelFactory.CreateFactionModel(ruledata, parent)
        return rulenew;
    }

}

export {ModelFactory}