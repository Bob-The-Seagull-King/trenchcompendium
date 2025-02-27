import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject, IContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { ExplorationTable } from '../../classes/feature/exploration/ExplorationTable';
import { IExplorationSkill, ExplorationSkill } from '../../classes/feature/exploration/ExplorationSkill';
import { ExplorationLocation, IExplorationLocation } from '../../classes/feature/exploration/ExplorationLocation';

class ExplorationFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateExplorationTable(_rule: IContextObject, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationtable', _rule.id))
        if (isValid == false) {
            return cache.ExplorationTableCache[_rule.id];
        }
        const rule = new ExplorationTable(_rule, parent)
        cache.AddToCache('explorationtable', rule);
        return rule;
    }

    static CreateNewExplorationTable(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationtable', _val))
        if (isValid == false) {
            return cache.ExplorationTableCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "explorationtable", id: _val}}) as IContextObject
        const rulenew = ExplorationFactory.CreateExplorationTable(ruledata, parent)
        return rulenew;
    }
    
    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateExplorationLocation(_rule: IExplorationLocation, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationlocation', _rule.id))
        if (isValid == false) {
            return cache.ExplorationLocationCache[_rule.id];
        }
        const rule = new ExplorationLocation(_rule, parent)
        cache.AddToCache('explorationlocation', rule);
        return rule;
    }

    static CreateNewExplorationLocation(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationlocation', _val))
        if (isValid == false) {
            return cache.ExplorationLocationCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "explorationlocation", id: _val}}) as IExplorationLocation
        const rulenew = ExplorationFactory.CreateExplorationLocation(ruledata, parent)
        return rulenew;
    }
    
    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateExplorationSkill(_rule: IExplorationSkill, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationskill', _rule.id))
        if (isValid == false) {
            return cache.ExplorationSkillCache[_rule.id];
        }
        const rule = new ExplorationSkill(_rule, parent)
        cache.AddToCache('explorationskill', rule);
        return rule;
    }

    static CreateNewExplorationSkill(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationskill', _val))
        if (isValid == false) {
            return cache.ExplorationSkillCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "explorationskill", id: _val}}) as IExplorationSkill
        const rulenew = ExplorationFactory.CreateExplorationSkill(ruledata, parent)
        return rulenew;
    }

}

export {ExplorationFactory}