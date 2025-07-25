import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { IUpgrade, Upgrade } from '../../classes/feature/ability/Upgrade';
import { ModelUpgradeRelationship, IModelUpgradeRelationship } from '../../classes/relationship/model/ModelUpgradeRelationship';

class UpgradeFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateUpgrade(_rule: IUpgrade, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('upgrade', _rule.id))
        if (isValid == false) {
            return cache.UpgradeCache[_rule.id];
        }
        const rule = new Upgrade(_rule, parent)
        cache.AddToCache('upgrade', rule);
        await rule.ReloadOptions();
        return rule;
    }

    static async CreateNewUpgrade(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('upgrade', _val))
        if (isValid == false) {
            return cache.UpgradeCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "upgrade", id: _val}}) as IUpgrade
        const rulenew = await UpgradeFactory.CreateUpgrade(ruledata, parent);
        return rulenew;
    }

    static async CreateModelUpgrade(_rule: IModelUpgradeRelationship, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelupgrade', _rule.id))
        if (isValid == false) {
            return cache.ModelUpgradeCache[_rule.id];
        }
        const rule = await new ModelUpgradeRelationship(_rule, parent)
        cache.AddToCache('modelupgrade', rule);
        await rule.BuildUpgrade(_rule.upgrade_id);
        return rule;
    }

}

export {UpgradeFactory}