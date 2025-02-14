import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { IModel, Model } from '../../classes/feature/model/Model';
import { ModelCollection } from '../../classes/feature/model/ModelCollection';

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
            return cache.ModelCache[_rule.id];
        }
        const rule = new Model(_rule, parent)
        cache.AddToCache('model', rule);
        return rule;
    }

    static CreateNewModel(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('model', _val))
        if (isValid == false) {
            return cache.ModelCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "model", id: _val}}) as IModel
        const rulenew = ModelFactory.CreateModel(ruledata, parent)
        return rulenew;
    }

}

export {ModelFactory}