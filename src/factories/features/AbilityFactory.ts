import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';

class AbilityFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateAbility(_rule: IAbility, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('ability', _rule.id))
        if (isValid == false) {
            return cache.AbilityCache[_rule.id];
        }
        const rule = new Ability(_rule, parent)
        cache.AddToCache('ability', rule);
        return rule;
    }

    static CreateNewAbility(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('ability', _val))
        if (isValid == false) {
            return cache.AbilityCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "ability", id: _val}}) as IAbility
        const rulenew = AbilityFactory.CreateAbility(ruledata, parent)
        return rulenew;
    }

}

export {AbilityFactory}