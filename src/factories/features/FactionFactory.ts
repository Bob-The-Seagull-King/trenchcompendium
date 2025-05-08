import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { IFaction, Faction } from '../../classes/feature/faction/Faction';
import { IVariantFaction, FactionCollection } from '../../classes/feature/faction/FactionCollection';

class FactionFactory {

    static async CreateFactionCollection(_rule: IFaction, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factioncollection', _rule.id))
        if (isValid == false) {
            return cache.FactionCollectionCache[_rule.id];
        }
        
        const rule = new FactionCollection(_rule, parent)
        cache.AddToCache('factioncollection', rule);
        await rule.ConstructFactions();
        return rule;
    }

    static async CreateNewFactionCollection(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factioncollection', _val))
        if (isValid == false) {
            return cache.FactionCollectionCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "faction", id: _val}}) as IFaction
        const rulenew = await FactionFactory.CreateFactionCollection(ruledata, parent)
        return rulenew;
    }

    static async CreateFaction(_rule: IFaction, parent : ContextObject | null) {
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
        await rule.BuildFactionModels(_rule.id);
        await rule.BuildFactionEquipment(_rule.id)
        await rule.BuildRules(_rule.rules)
        return rule;
    }

    static async CreateNewFaction(_val : string, parent : ContextObject | null) {
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
            return await FactionFactory.CreateNewVariantFaction(_val, parent);
        }
        const rulenew = await FactionFactory.CreateFaction(ruledata, parent)
        return rulenew;
    }

    static async CreateVariantFaction(_base: IFaction, varaint: IVariantFaction, parent : ContextObject | null) {
        console.log(_base)
        console.log(varaint)
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('faction', varaint.id))
        if (isValid == false) {
            return cache.FactionCache[varaint.id];
        }
        const BasedFactionData : IFaction = FactionCollection.MergeFactions(_base, varaint);
        const rule = new Faction(BasedFactionData, parent)
        cache.AddToCache('faction', rule);
        rule.ContextKeys['VariantFactionBase'] = {'faction_base_id':_base.id}
        await rule.BuildFactionModels(BasedFactionData.id);
        await rule.BuildFactionEquipment(BasedFactionData.id)
        await rule.BuildRules(BasedFactionData.rules)
        return rule;
    }

    static async CreateNewVariantFaction(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('faction', _val))
        if (isValid == false) {
            return cache.FactionCache[_val];
        }
        console.log("start")
        console.log(_val)
        const vardata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "factionvariant", id: _val}}) as IVariantFaction
        const basedata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "faction", id: vardata.base_id}}) as IFaction
        const rulenew = await FactionFactory.CreateVariantFaction(basedata, vardata, parent)
        return rulenew;
    }

}

export {FactionFactory}