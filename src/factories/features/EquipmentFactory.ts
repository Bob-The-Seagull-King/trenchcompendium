import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { Equipment, IEquipment } from '../../classes/feature/equipment/Equipment';
import { IModelEquipmentRelationship, ModelEquipmentRelationship } from '../../classes/relationship/model/ModelEquipmentRelationship';
import { IFactionEquipmentRelationship, FactionEquipmentRelationship } from '../../classes/relationship/faction/FactionEquipmentRelationship';
import { byPropertiesOf, isValidList } from '../../utility/functions';


class EquipmentFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateEquipment(_rule: IEquipment, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('equipment', _rule.id))
        if (isValid == false && !skipcheck) {
            return cache.EquipmentCache[_rule.id];
        }
        const rule = new Equipment(_rule, parent)
        cache.AddToCache('equipment', rule);
        await rule.BuildFactionEquipment(_rule.id);
        return rule;
    }
        
    static async GetAllEquipment(showspecial = false) {
        let models : IEquipment[] = []
        if (showspecial) {
            const models = Requester.MakeRequest({searchtype: "file", searchparam: {type: "equipment"}}) as IEquipment[];
        } else {
            models = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "equipment",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "tags",
                                value: "model",
                                equals: false,
                                strict: true,
                                istag : true,
                                tagvalue: true
                            },
                            {
                                item: "tags",
                                value: "dontshow",
                                equals: false,
                                strict: true,
                                istag : true,
                                tagvalue: true
                            }
                        ],
                        subparams: []
                    }
                }
            }) as IEquipment[]
        }
        models.sort(byPropertiesOf<IEquipment>(["name", "id"]))
        const ModelList : Equipment[] = []
        for (let i = 0; i < models.length; i++) {
            const skl = await EquipmentFactory.CreateEquipment(models[i], null);
            if (skl != null) {
                ModelList.push(skl);
            }
        }
        return ModelList;
    }

    static async CreateNewEquipment(_val : string, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('equipment', _val))
        if (isValid == false && !skipcheck) {
            return cache.EquipmentCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "equipment", id: _val}}) as IEquipment
        const rulenew = await EquipmentFactory.CreateEquipment(ruledata, parent, skipcheck)
        return rulenew;
    }

    static async CreateModelEquipment(_rule: IModelEquipmentRelationship, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelequipment', _rule.id))
        if (isValid == false && !skipcheck) {
            return cache.ModelEquipmentCache[_rule.id];
        }
        const rule = new ModelEquipmentRelationship(_rule, parent)
        cache.AddToCache('modelequipment', rule);
        await rule.BuildEquipment(_rule.mandatory_equipment, skipcheck);
        await rule.ReloadOptions();
        await rule.BuildOptionEquipment();
        return rule;
    }

    static async CreateNewModelEquipment(_val : string, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('modelequipment', _val))
        if (isValid == false && !skipcheck) {
            return cache.ModelEquipmentCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "modelequipmentrelationship", id: _val}}) as IModelEquipmentRelationship
        const rulenew = await EquipmentFactory.CreateModelEquipment(ruledata, parent, skipcheck)
        return rulenew;
    }

    static async GetAllFactionEquipment(skipcheck = false, removelist : string[], includelist : string[]) {
        const models = Requester.MakeRequest({searchtype: "file", searchparam: {type: "factionequipmentrelationship"}}) as IFactionEquipmentRelationship[];
        models.sort(byPropertiesOf<IFactionEquipmentRelationship>(["name", "id"]))
        const ModelList : FactionEquipmentRelationship[] = []
        for (let i = 0; i < models.length; i++) {
            if (!isValidList(models[i].faction_id, removelist, includelist)) {
                continue;
            }
            const skl = await EquipmentFactory.CreateFactionEquipment(models[i], null, skipcheck);
            if (skl != null) {
                ModelList.push(skl);
            }
        }
        return ModelList;
    }

    static async CreateFactionEquipment(_rule: IFactionEquipmentRelationship, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factionequipment', _rule.id))
        if (isValid == false && !skipcheck) {
            return cache.FactionEquipmentCache[_rule.id];
        }
        
        const rule = new FactionEquipmentRelationship(_rule, parent)
        cache.AddToCache('factionequipment', rule);
        await rule.MakeItem(_rule.equipment_id, skipcheck);
        await rule.GetFactions(_rule.faction_id)
        await rule.RunEquipmentRestriction();
        return rule;
    }

    static async CreateNewFactionEquipment(_val : string, parent : ContextObject | null, skipcheck = false) {
        const cache = StaticDataCache.getInstance();
        const isValid = (cache.CheckID('factionequipment', _val))
        if (isValid == false && !skipcheck) {
            return cache.FactionEquipmentCache[_val];
        }
        const ruledata = Requester.MakeRequest({searchtype: "id", searchparam: {type: "factionequipmentrelationship", id: _val}}) as IFactionEquipmentRelationship
        if (ruledata.id == undefined) {
            return null;
        }
        const rulenew = await EquipmentFactory.CreateFactionEquipment(ruledata, parent, skipcheck)
        return rulenew;
    }

}

export {EquipmentFactory}