import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { Equipment, IEquipment } from '../../classes/feature/equipment/Equipment';

class EquipmentFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static CreateEquipment(_rule: IEquipment, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('equipment', _rule.id))
        if (isValid == false) {
            return cache.EquipmentCache[_rule.id];
        }
        const rule = new Equipment(_rule, parent)
        cache.AddToCache('equipment', rule);
        return rule;
    }

    static CreateNewEquipment(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('equipment', _val))
        if (isValid == false) {
            return cache.EquipmentCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "equipment", id: _val}}) as IEquipment
        const rulenew = EquipmentFactory.CreateEquipment(ruledata, parent)
        return rulenew;
    }

}

export {EquipmentFactory}