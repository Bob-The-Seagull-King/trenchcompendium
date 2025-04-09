import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { IRule, Rule } from '../../classes/feature/faction/Rule';
import { IScenario, Scenario } from '../../classes/feature/scenario/Scenario';

class ScenarioFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateScenario(_scenario: IScenario, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('scenario', _scenario.id))
        if (isValid == false) {
            return cache.ScenarioCache[_scenario.id];
        }
        const rule = new Scenario(_scenario, parent)
        cache.AddToCache('scenario', rule);
        await rule.BuildRules(_scenario.special_rules)
        return rule;
    }

    static async CreateNewScenario(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('scenario', _val))
        if (isValid == false) {
            return cache.ScenarioCache[_val];
        }
        const scenariodata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "scenario", id: _val}}) as IScenario
        const scenarionew = await ScenarioFactory.CreateScenario(scenariodata, parent)
        return scenarionew;
    }

}

export {ScenarioFactory}