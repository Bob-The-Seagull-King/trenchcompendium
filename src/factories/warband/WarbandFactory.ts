import { Requester } from '../Requester';
import { StaticDataCache } from '../../classes/_high_level_controllers/StaticDataCache';
import { IKeyword, Keyword } from '../../classes/feature/glossary/Keyword';
import { ContextObject } from '../../classes/contextevent/contextobject';
import { Ability, IAbility } from '../../classes/feature/ability/Ability';
import { WarbandEquipment } from '../../classes/saveitems/Warband/Purchases/WarbandEquipment';
import { DynamicContextObject } from '../../classes/contextevent/dynamiccontextobject';
import { IWarbandEquipment } from '../../classes/saveitems/Warband/Purchases/WarbandEquipment';
import { IWarbandMember, WarbandMember } from '../../classes/saveitems/Warband/Purchases/WarbandMember';
import { IWarbandExplorationSet, WarbandExplorationSet } from '../../classes/saveitems/Warband/CoreElements/WarbandExplorationSet';
import { IWarbandFaction, WarbandFaction } from '../../classes/saveitems/Warband/CoreElements/WarbandFaction';
import { IUserWarband, UserWarband } from '../../classes/saveitems/Warband/UserWarband';
import { FactionModelRelationship } from '../../classes/relationship/faction/FactionModelRelationship';

class WarbandFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateWarbandEquipment(data: IWarbandEquipment, parent : DynamicContextObject | null) {
        const rule = new WarbandEquipment(data, parent)
        await rule.BuildEquipment(data.equipment_id)
        await rule.BuildNewProperties();
        return rule;
    }

    static async CreateWarbandExplorationSet(data: IWarbandExplorationSet, parent : DynamicContextObject | null) {
        const rule = new WarbandExplorationSet(data, parent)
        await rule.BuildSkills(data.explorationskills);
        await rule.BuildLocations(data.locations);
        return rule;
    }

    static async CreateWarbandFaction(data: IWarbandFaction, parent : DynamicContextObject | null) {
        const rule = new WarbandFaction(data, parent)
        await rule.BuildFaction(data.faction_property)
        await rule.BuildPatron(data.patron_id)
        await rule.BuildFactionRules(data);
        return rule;
    }
    
    static async CreateWarbandMember(data: IWarbandMember, parent : DynamicContextObject | null) {
        const rule = new WarbandMember(data, parent)        
        await rule.BuildModel(data.model)
        await rule.BuildEquipment(data.equipment);
        await rule.BuildUpgrade(data.list_upgrades);
        await rule.BuildSkills(data.list_skills);
        await rule.BuildInjuries(data.list_injury);
        await rule.BuildNewProperties();
        return rule;
    }

    static async BuildWarbandMemberFromPurchase(rel: FactionModelRelationship, parent : DynamicContextObject | null) {
        const data : IWarbandMember = {
                id: rel.Model.ID, // The id of the item
                name: rel.Model.GetTrueName(), // The name of the item
                source: rel.Model.Source? rel.Model.Source : "unknown", // The source of the item (core book, homebrew, etc)
                tags: rel.Model.Tags,
                contextdata: rel.Model.ContextData,
                model: rel.Model.ID,
                subproperties : [],
                notes : [],
                active : true,
                equipment : [],
                list_upgrades : [],
                list_injury : [],
                list_skills : [],
                experience : 0,
                elite : rel.Model.getKeywordIDs().includes("kw_elite"),
                recruited: false
            }
        
        const Model : WarbandMember = await WarbandFactory.CreateWarbandMember(data, parent);
        return Model;
    }
    
    static async CreateUserWarband(data: IUserWarband) {
        const rule = new UserWarband(data);
        await rule.NewWarbandItems(data)
        await rule.BuildModels(data.models);
        await rule.BuildEquipment(data.equipment);
        return rule;
    }

}

export {WarbandFactory}