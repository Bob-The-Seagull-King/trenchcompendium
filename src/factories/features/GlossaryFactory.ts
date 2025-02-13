import { Requester } from '../Requester';
import { IGlossaryRule, GlossaryRule } from '../../classes/feature/glossary/Glossary';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';

class GlossaryRuleFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateGlossaryRule(_rule: IGlossaryRule) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('glossary', _rule.id))
        if (isValid == false) {
            return cache.GlossaryCache[_rule.id];
        }
        const rule = new GlossaryRule(_rule)
        cache.AddToCache('glossary', rule);
        return rule;
    }

    static CreateNewGlossaryRule(_val : string) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('glossary', _val))
        if (isValid == false) {
            return cache.GlossaryCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "glossary", id: _val}}) as IGlossaryRule
        const rulenew = GlossaryRuleFactory.CreateGlossaryRule(ruledata)
        return rulenew;
    }

}

export {GlossaryRuleFactory}