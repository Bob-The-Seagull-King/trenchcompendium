import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { IRule, Rule } from '../../classes/feature/faction/Rule';

class RuleFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateRule(_rule: IRule, parent : ContextObject | null) {
        console.log(_rule)
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('rule', _rule.id))
        if (isValid == false) {
            return cache.RuleCache[_rule.id];
        }
        const rule = new Rule(_rule, parent)
        cache.AddToCache('rule', rule);
        await rule.ReloadOptions();
        return rule;
    }

    static async CreateNewRule(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('rule', _val))
        if (isValid == false) {
            return cache.RuleCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "factionrule", id: _val}}) as IRule
        const rulenew = await RuleFactory.CreateRule(ruledata, parent)
        return rulenew;
    }

    static async CreateNewScenarioRule(_val : string, parent : ContextObject | null) {
        console.log(_val)
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('rule', _val))
        if (isValid == false) {
            return cache.RuleCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "scenariorule", id: _val}}) as IRule
        const rulenew = await RuleFactory.CreateRule(ruledata, parent)
        return rulenew;
    }

}

export {RuleFactory}