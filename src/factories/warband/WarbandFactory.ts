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
import { FactionEquipmentRelationship } from '../../classes/relationship/faction/FactionEquipmentRelationship';
import { ModelEquipmentRelationship } from '../../classes/relationship/model/ModelEquipmentRelationship';
import { Equipment } from '../../classes/feature/equipment/Equipment';
import { SumWarband } from '../../classes/saveitems/Warband/WarbandManager';
import { SynodDataCache } from '../../classes/_high_level_controllers/SynodDataCache';
import { SYNOD } from '../../resources/api-constants';
import { containsTag } from '../../utility/functions';
import { WarbandUpdater } from '../../classes/saveitems/Warband/Converter/WarbandUpdater';

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

class WarbandFactory {

    /**
     * Creates an ability based on provided data
     * @param _ability The data in IPlayerAbility format describing the ability
     * @returns A newly created ability
     */
    static async CreateWarbandEquipment(data: IWarbandEquipment, parent : DynamicContextObject | null) {
        const rule = new WarbandEquipment(data, parent)
        await rule.BuildEquipment(data.equipment_id)
        return rule;
    }

    static async BuildWarbandEquipmentFromPurchase(rel: FactionEquipmentRelationship, parent : DynamicContextObject | null) {
        
        const newtags = rel.EquipmentItem.Tags
        if (containsTag((rel).Tags, 'exploration_only')) {
            newtags["exploration_only"] = true
        }
        const data : IWarbandEquipment = {    
                id: rel.EquipmentItem.ID, // The id of the item
                name: rel.EquipmentItem.GetTrueName(), // The name of the item
                source: rel.EquipmentItem.Source? rel.EquipmentItem.Source : "unknown", // The source of the item (core book, homebrew, etc)
                tags: newtags,
                contextdata : rel.EquipmentItem.ContextData,            
                equipment_id: {      
                    consumables: [],              
                    object_id: rel.EquipmentItem.ID,
                    selections: []
                },
                subproperties : []
            }
        
        const Equipment : WarbandEquipment = await WarbandFactory.CreateWarbandEquipment(data, parent);
        return Equipment;
    }

    static async BuildModelEquipmentFromPurchase(rel: ModelEquipmentRelationship, equipment : Equipment, key : number, parent : DynamicContextObject | null) {
        const data : IWarbandEquipment = {    
                id: rel.ID + "_" + equipment.ID + "_" + key, // The id of the item
                name: equipment.GetTrueName(), // The name of the item
                source: equipment.Source? equipment.Source : "unknown", // The source of the item (core book, homebrew, etc)
                tags: equipment.Tags,
                contextdata : equipment.ContextData,            
                equipment_id: {                    
                    object_id: equipment.ID,
                    consumables: [],
                    selections: []
                },
                subproperties : []
            }
        
        const Equipment : WarbandEquipment = await WarbandFactory.CreateWarbandEquipment(data, parent);
        return Equipment;
    }

    static async CreateWarbandExplorationSet(data: IWarbandExplorationSet, parent : DynamicContextObject | null) {
        const rule = new WarbandExplorationSet(data, parent)
        await rule.BuildSkills(data.explorationskills);
        await rule.BuildLocations(data.locations);
        if (data.location_mods) {
            await rule.BuildLocationMods(data.location_mods);
        }
        return rule;
    }

    static async CreateWarbandFaction(data: IWarbandFaction, parent : DynamicContextObject | null) {
        const rule = new WarbandFaction(data, parent)
        await rule.BuildFaction(data.faction_property)
        await rule.BuildPatron(data.patron_id)
        await rule.BuildFactionRules(data);
        return rule;
    }
    
    static async CreateWarbandMember(data: IWarbandMember, parent : DynamicContextObject | null, restricted : boolean, regen = false) {
        const rule = new WarbandMember(data, parent, restricted)        
        await rule.BuildModel(data.model)
        await rule.BuildEquipment(data.equipment);
        await rule.BuildSkills(data.list_skills);
        await rule.BuildInjuries(data.list_injury);
        await rule.BuildNewProperties(data);
        await rule.BuildUpgrades(data);
        await rule.BuildModelEquipProperties(data);
        await rule.BuildModelEquipment(regen);
        return rule;
    }

    static async BuildWarbandMemberFromPurchase(rel: FactionModelRelationship, parent : UserWarband, restricted : boolean) {
        const milliseconds = Date.now();
        const data : IWarbandMember = {
                id: rel.Model.ID + "_" + parent.Models.length + "_" + milliseconds.toString(), // The id of the item
                name: rel.Model.GetTrueName(), // The name of the item
                source: rel.Model.Source? rel.Model.Source : "unknown", // The source of the item (core book, homebrew, etc)
                tags: rel.Model.Tags,
                contextdata: rel.Model.ContextData,
                model: rel.Model.ID,
                subproperties : [],
                notes : [],
                active : 'active',
                equipment : [],
                list_upgrades : [],
                list_injury : [],
                list_skills : [],
                list_modelequipment: [],
                experience : 0,
                elite : rel.Model.getKeywordIDs().includes("kw_elite"),
                recruited: false,
                scar_reserves: 0,
                stat_selections: []
            }

        if (rel.Mercenary == true) {
            data.tags["mercenary"] = true;
        }
        
        const Model : WarbandMember = await WarbandFactory.CreateWarbandMember(data, parent, restricted, true);
        return Model;
    }
    
    static async CreateUserWarband(data: IUserWarband, postID : number) {
        const WbUpdate = WarbandUpdater.getInstance();
        let DataCheck = data;
        if ((WbUpdate.CheckUpdate(data)) == false) {
            DataCheck = await WbUpdate.RunUpdate(data);
        }
        const rule = new UserWarband(DataCheck, postID);
        await rule.NewWarbandItems(DataCheck)
        await rule.BuildModels(DataCheck.models);
        await rule.BuildEquipment(DataCheck.equipment);
        await rule.BuildModifiersSkills(DataCheck.modifiers);
        await rule.BuildModifiersLoc(DataCheck.modifiersloc);
        await rule.BuildModifiersFireteam(DataCheck.fireteams);
        await rule.BuildConsumables(DataCheck.consumables);
        await rule.RebuildProperties();
        if (DataCheck.exploration.templocations) {
            await rule.BuildTempLocations(DataCheck.exploration.templocations);
        }
        return rule;
    }

    static async GetWarbandPublicByID( _val : number) : Promise<SumWarband | null> {
        const synodcache : SynodDataCache = SynodDataCache.getInstance();
        let userdata : any = undefined;

        if (synodcache.CheckWarbandCache(_val)) {
            userdata = (synodcache.warbandDataCache[_val]);
        }

        if (synodcache.CheckWarbandCallCache(_val)) {
            const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one user, just give up
            let count_check = 0;
            while ((!synodcache.CheckWarbandCache(_val)) && (count_check < EMERGENCY_OUT)) {
                await delay(100);
                count_check += 1;
            }                   
            userdata = (synodcache.warbandDataCache[_val]);
        }

        if (!synodcache.CheckWarbandCache(_val)) {
            synodcache.AddWarbandCallCache(_val);

            const response : Response = await fetch(`${SYNOD.URL}/wp-json/synod/v1/warband/${_val}`)

            // warband does not exist -> same as default return
            if( response.status === 400 ) {
                return null;
            }

            if (response) {
                const json : any = await response.json();          
                userdata = json.warband_data
                userdata["warband_invites"] = json.warband_campaign_invites
                userdata["warband_campaigns"] = json.warband_campaigns
                userdata["warband_user"] = json.warband_user_id
                synodcache.AddWarbandCache(_val, userdata)
            }
        }

        if (userdata != undefined) {
            try {
                const user = await WarbandFactory.CreateUserWarband(JSON.parse(userdata) as IUserWarband, _val)
                return {
                    id: _val,
                    warband_data: user
                };
            } catch (e) {console.log(e)}
        }

        return null;
    }

}

export {WarbandFactory}