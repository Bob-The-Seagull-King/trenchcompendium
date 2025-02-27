import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { IRule, Rule } from '../../classes/feature/faction/Rule';
import { BookRule, IBookRule } from '../../classes/feature/bookrules/BookRule';

class BookRuleFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateBookRule(_rule: IBookRule, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('gamerule', _rule.id))
        if (isValid == false) {
            return cache.GameRulesCache[_rule.id];
        }
        const rule = new BookRule(_rule, parent)
        cache.AddToCache('gamerule', rule);
        return rule;
    }

    static CreateNewBookRule(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('gamerule', _val))
        if (isValid == false) {
            return cache.GameRulesCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "gamerule", id: _val}}) as IBookRule
        const rulenew = BookRuleFactory.CreateBookRule(ruledata, parent)
        return rulenew;
    }

}

export {BookRuleFactory}