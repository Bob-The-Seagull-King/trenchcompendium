import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { ContextObject, IContextObject } from '../../classes/contextevent/contextobject';
import { ISkill, Skill} from '../../classes/feature/ability/Skill';

class SkillFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateSkill(_rule: ISkill, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('skill', _rule.id))
        if (isValid == false) {
            return cache.SkillCache[_rule.id];
        }
        const rule = new Skill(_rule, parent)
        cache.AddToCache('skill', rule);
        return rule;
    }

    static CreateNewSkill(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('skill', _val))
        if (isValid == false) {
            return cache.SkillCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "skill", id: _val}}) as ISkill
        const rulenew = SkillFactory.CreateSkill(ruledata, parent)
        return rulenew;
    }

}

export {SkillFactory}