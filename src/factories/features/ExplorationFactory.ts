import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject, IContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { ExplorationTable, IExplorationTable } from '../../classes/feature/exploration/ExplorationTable';
import { ExplorationLocation, IExplorationLocation } from '../../classes/feature/exploration/ExplorationLocation';

class ExplorationFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateExplorationTable(_rule: IExplorationTable, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationtable', _rule.id))
        if (isValid == false && !skipcheck) {
            return cache.ExplorationTableCache[_rule.id];
        }
        const rule = new ExplorationTable(_rule, parent)
        cache.AddToCache('explorationtable', rule);        
        await rule.BuildFactionEquipment(_rule.id, skipcheck);
        return rule;
    }

    static async CreateNewExplorationTable(_val : string, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationtable', _val))
        if (isValid == false && !skipcheck) {
            return cache.ExplorationTableCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "explorationtable", id: _val}}) as IExplorationTable
        const rulenew = await ExplorationFactory.CreateExplorationTable(ruledata, parent, skipcheck)
        return rulenew;
    }
    
    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateExplorationLocation(_rule: IExplorationLocation, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationlocation', _rule.id))
        if (isValid == false && !skipcheck) {
            return cache.ExplorationLocationCache[_rule.id];
        }
        const rule = new ExplorationLocation(_rule, parent)
        cache.AddToCache('explorationlocation', rule);
        await rule.ReloadOptions();
        await rule.RunOptionsParse();
        await rule.RunRestrictions();
        return rule;
    }

    static async GetAllTables(parent : ContextObject | null, skipcheck = false) {
        const Locations = Requester.MakeRequest({searchtype: "file", searchparam: {type: "explorationtable"}}) as IExplorationTable[];
        const LocationsList : ExplorationTable[] = []
        for (let i = 0; i < Locations.length; i++) {
            const skl = await ExplorationFactory.CreateExplorationTable(Locations[i], parent, skipcheck);
            if (skl != null) {
                LocationsList.push(skl);
            }
        }

        return LocationsList;
    }

    static async CreateNewExplorationLocation(_val : string, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('explorationlocation', _val))
        if (isValid == false && !skipcheck) {
            return cache.ExplorationLocationCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "explorationlocation", id: _val}}) as IExplorationLocation
        const rulenew = await ExplorationFactory.CreateExplorationLocation(ruledata, parent, skipcheck)
        return rulenew;
    }

}

export {ExplorationFactory}