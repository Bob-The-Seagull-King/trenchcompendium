import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { Equipment, IEquipment } from '../../classes/feature/equipment/Equipment';
import { IModelEquipmentRelationship, ModelEquipmentRelationship } from '../../classes/relationship/model/ModelEquipmentRelationship';
import { IFactionEquipmentRelationship, FactionEquipmentRelationship } from '../../classes/relationship/faction/FactionEquipmentRelationship';


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
        rule.BuildFactionEquipment(_rule.id);
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

    static CreateModelEquipment(_rule: IModelEquipmentRelationship, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelequipment', _rule.id))
        if (isValid == false) {
            return cache.ModelEquipmentCache[_rule.id];
        }
        const rule = new ModelEquipmentRelationship(_rule, parent)
        cache.AddToCache('modelequipment', rule);
        return rule;
    }

    static CreateNewModelEquipment(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelequipment', _val))
        if (isValid == false) {
            return cache.ModelEquipmentCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "modelequipmentrelationship", id: _val}}) as IModelEquipmentRelationship
        const rulenew = EquipmentFactory.CreateModelEquipment(ruledata, parent)
        return rulenew;
    }

    static CreateFactionEquipment(_rule: IFactionEquipmentRelationship, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factionequipment', _rule.id))
        if (isValid == false) {
            return cache.FactionEquipmentCache[_rule.id];
        }
        const rule = new FactionEquipmentRelationship(_rule, parent)
        cache.AddToCache('factionequipment', rule);
        return rule;
    }

    static CreateNewFactionEquipment(_val : string, parent : ContextObject | null) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factionequipment', _val))
        if (isValid == false) {
            return cache.FactionEquipmentCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "factionequipmentrelationship", id: _val}}) as IFactionEquipmentRelationship
        const rulenew = EquipmentFactory.CreateFactionEquipment(ruledata, parent)
        return rulenew;
    }

}

export {EquipmentFactory}