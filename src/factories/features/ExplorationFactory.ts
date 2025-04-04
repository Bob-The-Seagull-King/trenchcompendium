import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject, IContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { ExplorationTable } from '../../classes/feature/exploration/ExplorationTable';
import { ExplorationLocation, IExplorationLocation } from '../../classes/feature/exploration/ExplorationLocation';

class ExplorationFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateExplorationTable(_rule: IContextObject, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationtable', _rule.id))
        if (isValid == false) {
            return cache.ExplorationTableCache[_rule.id];
        }
        const rule = new ExplorationTable(_rule, parent)
        cache.AddToCache('explorationtable', rule);        
        await rule.BuildFactionEquipment(_rule.id);
        return rule;
    }

    static async CreateNewExplorationTable(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationtable', _val))
        if (isValid == false) {
            return cache.ExplorationTableCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "explorationtable", id: _val}}) as IContextObject
        const rulenew = await ExplorationFactory.CreateExplorationTable(ruledata, parent)
        return rulenew;
    }
    
    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateExplorationLocation(_rule: IExplorationLocation, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationlocation', _rule.id))
        if (isValid == false) {
            return cache.ExplorationLocationCache[_rule.id];
        }
        const rule = new ExplorationLocation(_rule, parent)
        cache.AddToCache('explorationlocation', rule);
        await rule.ReloadOptions();
        return rule;
    }

    static async CreateNewExplorationLocation(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationlocation', _val))
        if (isValid == false) {
            return cache.ExplorationLocationCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "explorationlocation", id: _val}}) as IExplorationLocation
        const rulenew = await ExplorationFactory.CreateExplorationLocation(ruledata, parent)
        return rulenew;
    }

}

export {ExplorationFactory}