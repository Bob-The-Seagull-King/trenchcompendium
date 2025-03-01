import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { IFaction, Faction } from '../../classes/feature/faction/Faction';
import { IVariantFaction, FactionCollection } from '../../classes/feature/faction/FactionCollection';

class FactionFactory {

    static CreateFactionCollection(_rule: IFaction, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factioncollection', _rule.id))
        if (isValid == false) {
            return cache.FactionCollectionCache[_rule.id];
        }
        
        const rule = new FactionCollection(_rule, parent)
        cache.AddToCache('factioncollection', rule);
        return rule;
    }

    static CreateNewFactionCollection(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factioncollection', _val))
        if (isValid == false) {
            return cache.FactionCollectionCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "faction", id: _val}}) as IFaction
        const rulenew = FactionFactory.CreateFactionCollection(ruledata, parent)
        return rulenew;
    }

    static CreateFaction(_rule: IFaction, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('faction', _rule.id))
        
        if (isValid == false) {
            if (cache.FactionCache[_rule.id].MyContext == null) {
                cache.FactionCache[_rule.id].MyContext = parent;
            }
            return cache.FactionCache[_rule.id];
        }
        const rule = new Faction(_rule, parent)
        cache.AddToCache('faction', rule);
        rule.BuildFactionModels(_rule.id);
        rule.BuildFactionEquipment(_rule.id)
        return rule;
    }

    static CreateNewFaction(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('faction', _val))
        if (isValid == false) {
            if (cache.FactionCache[_val].MyContext == null) {
                cache.FactionCache[_val].MyContext = parent;
            }
            return cache.FactionCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "faction", id: _val}}) as IFaction
        if (ruledata.id == undefined) {
            return FactionFactory.CreateNewVariantFaction(_val, parent);
        }
        const rulenew = FactionFactory.CreateFaction(ruledata, parent)
        return rulenew;
    }

    static CreateVariantFaction(_base: IFaction, varaint: IVariantFaction, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('faction', varaint.id))
        if (isValid == false) {
            return cache.FactionCache[varaint.id];
        }
        const BasedFactionData : IFaction = FactionCollection.MergeFactions(_base, varaint);
        const rule = new Faction(BasedFactionData, parent)
        cache.AddToCache('faction', rule);
        rule.BuildFactionModels(BasedFactionData.id);
        rule.BuildFactionEquipment(BasedFactionData.id)
        return rule;
    }

    static CreateNewVariantFaction(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('faction', _val))
        if (isValid == false) {
            return cache.FactionCache[_val];
        }
        const vardata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "factionvariant", id: _val}}) as IVariantFaction
        const basedata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "faction", id: vardata.base_id}}) as IFaction
        const rulenew = FactionFactory.CreateVariantFaction(basedata, vardata, parent)
        return rulenew;
    }

}

export {FactionFactory}