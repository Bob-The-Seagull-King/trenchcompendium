import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { IInjury, Injury } from '../../classes/feature/ability/Injury';

class InjuryFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateInjury(_rule: IInjury, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('injury', _rule.id))
        if (isValid == false) {
            return cache.InjuryCache[_rule.id];
        }
        const rule = new Injury(_rule, parent)
        cache.AddToCache('injury', rule);
        return rule;
    }

    static CreateNewInjury(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('injury', _val))
        if (isValid == false) {
            return cache.InjuryCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "injury", id: _val}}) as IInjury
        const rulenew = InjuryFactory.CreateInjury(ruledata, parent)
        return rulenew;
    }

}

export {InjuryFactory}