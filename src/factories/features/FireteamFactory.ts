import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { ContextObject, IContextObject } from '../../classes/contextevent/contextobject';
import { ISkill, Skill} from '../../classes/feature/ability/Skill';
import { SkillGroup } from '../../classes/feature/skillgroup/SkillGroup';
import { IPatron, Patron } from '../../classes/feature/skillgroup/Patron';
import { IBaseAddon } from '../../classes/feature/ability/BaseAddon';
import { Fireteam } from '../../classes/feature/ability/Fireteam';
import { ContextEventVals } from '../../resources/staticcontext/contexteventtypes';

class FireteamFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateFireteam(_rule: IBaseAddon, parent : ContextObject | null, special_id : string) {
        _rule.id = special_id;
        const rule = new Fireteam(_rule, parent)
        await rule.ReloadOptions();
        await rule.RunOptionsParse();
        return rule;
    }

    static async CreateNewFireteam(_val : string, parent : ContextObject | null, special_id : string, bonus_context : ContextEventVals) {
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "fireteam", id: _val}}) as IBaseAddon
        ruledata.contextdata = Object.assign({}, ruledata.contextdata, bonus_context);
        const rulenew = await FireteamFactory.CreateFireteam(ruledata, parent, special_id)
        return rulenew;
    }
}

export {FireteamFactory}