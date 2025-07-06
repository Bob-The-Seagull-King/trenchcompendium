import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { ContextObject, IContextObject } from '../../classes/contextevent/contextobject';
import { ISkill, Skill} from '../../classes/feature/ability/Skill';
import { SkillGroup } from '../../classes/feature/skillgroup/SkillGroup';
import { IPatron, Patron } from '../../classes/feature/skillgroup/Patron';

class SkillFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateSkill(_rule: ISkill, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('skill', _rule.id))
        if (isValid == false) {
            return cache.SkillCache[_rule.id];
        }
        const rule = new Skill(_rule, parent)
        cache.AddToCache('skill', rule);
        await rule.ReloadOptions();
        await rule.RunOptionsParse();
        return rule;
    }

    static async CreateNewSkill(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('skill', _val))
        if (isValid == false) {
            return cache.SkillCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "skill", id: _val}}) as ISkill
        const rulenew = await SkillFactory.CreateSkill(ruledata, parent)
        return rulenew;
    }

    static async GetBaseSkills() {
        const Skills = Requester.MakeRequest({searchtype: "file", searchparam: {type: "skillgroup"}}) as IContextObject[];
        const SkillList : SkillGroup[] = []
        console.log(Skills)
        for (let i = 0; i < Skills.length; i++) {
            const skl = await SkillFactory.CreateSkillGroup(Skills[i], null);
            if (skl != null) {
                SkillList.push(skl);
            }
        }

        return SkillList;
    }
    
    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateSkillGroup(_rule: IContextObject, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('skillgroup', _rule.id))
        if (isValid == false) {
            return cache.SkillGroupCache[_rule.id];
        }
        const rule = new SkillGroup(_rule, parent)
        cache.AddToCache('skillgroup', rule);
        await rule.BuildFactionEquipment(_rule.id);
        return rule;
    }

    static async CreateNewSkillGroup(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('skillgroup', _val))
        if (isValid == false) {
            return cache.SkillGroupCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "skillgroup", id: _val}}) as IContextObject
        const rulenew = await SkillFactory.CreateSkillGroup(ruledata, parent)
        return rulenew;
    }
    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreatePatron(_rule: IPatron, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('patron', _rule.id))
        if (isValid == false) {
            return cache.PatronCache[_rule.id];
        }
        const rule = new Patron(_rule, parent)
        cache.AddToCache('patron', rule);
        await rule.BuildFactionEquipment(_rule.id);
        await rule.BuildFactionList(_rule.id)
        return rule;
    }

    static async CreateNewPatron(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('patron', _val))
        if (isValid == false) {
            return cache.PatronCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "patron", id: _val}}) as IPatron
        const rulenew = await SkillFactory.CreatePatron(ruledata, parent)
        return rulenew;
    }

}

export {SkillFactory}