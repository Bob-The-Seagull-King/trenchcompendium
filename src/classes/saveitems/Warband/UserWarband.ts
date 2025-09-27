import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { containsTag, DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './High_Level/WarbandContextItem';
import { ExplorationSkillSuite, ExplorationTableSuite, IWarbandExplorationSet, WarbandExplorationSet } from './CoreElements/WarbandExplorationSet';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { IWarbandFaction, WarbandFaction } from './CoreElements/WarbandFaction';
import { IWarbandPurchaseEquipment, IWarbandPurchaseModel, RealWarbandPurchaseEquipment, RealWarbandPurchaseModel, RealWarbandPurchaseUpgrade, WarbandPurchase } from './Purchases/WarbandPurchase';
import { IWarbandMember, SkillSuite, WarbandMember } from './Purchases/WarbandMember';
import { WarbandEquipment } from './Purchases/WarbandEquipment';
import { WarbandFactory } from '../../../factories/warband/WarbandFactory';
import { FactionModelRelationship, IFactionModelRelationship } from '../../relationship/faction/FactionModelRelationship';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { Faction } from '../../feature/faction/Faction';
import { FactionEquipmentRelationship, IFactionEquipmentRelationship } from '../../relationship/faction/FactionEquipmentRelationship';
import { ISelectedOption, IWarbandProperty, WarbandProperty } from './WarbandProperty';
import { ContextPackage } from '../../contextevent/contextpackage';
import { ToolsController } from '../../_high_level_controllers/ToolsController';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { SkillFactory } from '../../../factories/features/SkillFactory';
import { ExplorationLocation } from '../../feature/exploration/ExplorationLocation';
import { Fireteam } from '../../feature/ability/Fireteam';
import { FireteamFactory } from '../../../factories/features/FireteamFactory';
import { StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { IWarbandConsumable, WarbandConsumable } from './WarbandConsumable';
import { Model } from '../../feature/model/Model';
import { Equipment, EquipmentRestriction } from '../../feature/equipment/Equipment';
import { Skill } from '../../feature/ability/Skill';
import { ExplorationFactory } from '../../../factories/features/ExplorationFactory';
import { SumWarband, WarbandManager } from './WarbandManager';
import { ConvertToTTSExport } from './Converter/TTSExporter';

interface WarbandDebt {
    ducats : number,
    glory : number
}

export interface WarbandAlert {
    title: string,
    content: string
}

export interface CachedFacRelData {
    facrel : FactionEquipmentRelationship,
    limit : number,
    restrictions : string[],
    count_cur : number,
    cost: number,
    canadd : boolean
}
export interface CachedModelRelData {
    facrel : FactionModelRelationship,
    limit : number,
    avoid_restriction : boolean,
    count_cur : number,
    cost: number,
    canadd : boolean,
    group_cur : number,
    group_limit: number
}

export interface GeneralEventCache {
    fireteam_list? : Fireteam[],
    faction_equip_rel? : FactionEquipmentRelationship[],
    fac_equip_rest?: EquipmentRestriction[],
    fac_model_rel?: FactionModelRelationship[],
    max_elite? : number,
    base_ducats?: number,
    exportval? : string[],
    exploration_skills?: WarbandProperty[],
    exploration_limit?: number
}

export type CachedFactionEquipment = {[type : string]: CachedFacRelData};
export type CachedFactionModel = {[type : string]: CachedModelRelData};

interface IUserWarband extends IContextObject {
    id : string,
    ducat_bank : number,
    glory_bank : number,
    context : IWarbandContextItem,
    exploration : IWarbandExplorationSet,
    faction : IWarbandFaction,
    models : IWarbandPurchaseModel[],
    equipment : IWarbandPurchaseEquipment[],
    notes : INote[],
    debts : WarbandDebt,
    modifiers: IWarbandProperty[],
    modifiersloc: IWarbandProperty[],
    fireteams: IWarbandProperty[],
    consumables: IWarbandConsumable[],
    restrictions_list : string[]
}

class UserWarband extends DynamicContextObject {
    public ID;
    public Context : WarbandContextItem;
    public Exploration! : WarbandExplorationSet;
    public Faction! : WarbandFaction;
    public Ducats;
    public Glory;
    public Notes : INote[];
    public Models : WarbandPurchase[] = [];
    public Equipment : WarbandPurchase[] = [];
    public Debts : WarbandDebt;
    public Modifiers : WarbandProperty[] = [];
    public ModifiersLoc : WarbandProperty[] = [];
    public Fireteams : WarbandProperty[] = [];
    public Consumables : WarbandConsumable[] = [];
    public Restrictions : string[] = [];
    public IsUnRestricted : boolean;
    public EquipmentRelCache : CachedFactionEquipment = {}
    public ModelRelCache : CachedFactionModel = {}
    public GeneralCache : GeneralEventCache = {}
    public PostID : number;

    public DumpCache() {
        this.EquipmentRelCache = {}
        this.ModelRelCache = {}
        this.GeneralCache = {}
        for (let i = 0; i < this.Models.length; i++) {
            const Mod = this.Models[i].HeldObject as WarbandMember
            Mod.GeneralCache = {}
            for (let j = 0; j < Mod.Equipment.length; j++) {
                (Mod.Equipment[j].HeldObject as WarbandEquipment).EquipmentCache = null
            }
        }
        for (let i = 0; i < this.Equipment.length; i++) {
            (this.Equipment[i].HeldObject as WarbandEquipment).EquipmentCache = null
        }
    }

    public DucatLimit : number[] = [700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800];
    public ModelLimit : number[] = [10,11,12,13,14,15,16,17,18,19,20,22];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IUserWarband, pubID : number)
    {
        super(data, null)
        this.ID = data.id;
        this.PostID = pubID;
        this.Context = new WarbandContextItem(data.context);
        this.Ducats = data.ducat_bank;
        this.Glory = data.glory_bank;
        this.Notes = data.notes;
        if (data.debts != undefined) {
            this.Debts = data.debts;
        } else {
            this.Debts = {
                ducats: 0,
                glory: 0
            }
        }
        if (data.restrictions_list != undefined) {
            this.Restrictions = data.restrictions_list;
        } else {
            this.Restrictions = []
        }
        this.IsUnRestricted = (this.Restrictions.includes("unrestricted"))
    }

    public async NewWarbandItems(data : IUserWarband) {
        if (data == undefined) {return;}
        this.Faction = await WarbandFactory.CreateWarbandFaction(data.faction, this);
        this.Exploration = await WarbandFactory.CreateWarbandExplorationSet(data.exploration, this);
    }

    public async BuildModels(data : IWarbandPurchaseModel[]) {
        if (data == undefined) {return;}
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandMember = await WarbandFactory.CreateWarbandMember(data[i].model, this, this.IsUnRestricted);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Models.push(NewPurchase);
        }
    }

    public async BuildEquipment(data : IWarbandPurchaseEquipment[] = this.SelfData.equipitem) {
        if (data == undefined) {return;}
        this.Equipment = [];
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandEquipment = await WarbandFactory.CreateWarbandEquipment(data[i].equipment, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Equipment.push(NewPurchase);
        }

    }

    public async BuildModifiersSkills(data : IWarbandProperty[]) {
        if (data == undefined) {return;}
        const id_list = this.Modifiers.map(obj => JSON.stringify(obj.ConvertToInterface()))
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            if (id_list.includes(JSON.stringify(data[i]))) {continue;}
            const Value = await SkillFactory.CreateNewSkill(CurVal.object_id, this, true);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this, null, CurVal)
            await NewLocation.BuildConsumables(CurVal.consumables)
            this.Modifiers.push(NewLocation);
        }
    }

    public async BuildModifiersLoc(data : IWarbandProperty[]) {
        
        if (data == undefined) {return;}
        for (let i = 0; i < data.length; i++) {
            try {
                const CurVal = data[i];
                const Value = await ExplorationFactory.CreateNewExplorationLocation(CurVal.object_id, this, true);
                const NewLocation = new WarbandProperty(Value, this, null, CurVal);
                await NewLocation.HandleDynamicProps(Value, this, null, CurVal)
                await NewLocation.BuildConsumables(CurVal.consumables)
                this.Modifiers.push(NewLocation);
            } catch(e) {
                console.log(e)
            }
        }
    }
    
    public async BuildConsumables(data: IWarbandConsumable[]) {
        if (data == undefined) {return;}
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i]
            const NewConsumable = new WarbandConsumable(CurVal, this, null);
            await NewConsumable.GrabItem(CurVal);
            await NewConsumable.GrabOptions();
            this.Consumables.push(NewConsumable);
        }
    }
    
    public IsModelInThisFireteam(fireteam : StaticOptionContextObject, model : WarbandMember) {
        for (let i = 0; i < this.Fireteams.length; i++) {
            if (this.Fireteams[i].ID == fireteam.ID) {
                for (let j = 0; j < this.Fireteams[i].SelfDynamicProperty.Selections.length; j++) {
                    if (this.Fireteams[i].SelfDynamicProperty.Selections[j].SelectedChoice) {
                        if (this.Fireteams[i].SelfDynamicProperty.Selections[j].SelectedChoice?.value == model) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    public GetObjectsWithAttatch() {
        const List : WarbandProperty[] = []
        const newlist = this.Exploration.GetObjectsWithAttatch()
        for (let i = 0; i < newlist.length; i++) {
            List.push(newlist[i])
        }

        return List;
    }

    public GetAttatchementsForModel(model : WarbandMember) {
        const fighters = this.GetUsableFighters();
        const list : WarbandProperty[] = []
        const baselist = this.GetObjectsWithAttatch()
        for (let i = 0; i < baselist.length; i++) {
            let IsFound = false;

                for (let k = 0; k < baselist[i].SelfDynamicProperty.Selections.length; k++) {
                    const selec = baselist[i].SelfDynamicProperty.Selections[k]
                    if (selec.SelectedChoice != null) {
                        if (selec.SelectedChoice.value == model) {
                            IsFound = true;
                            break;
                        }
                    }
                }
                if (IsFound) {
                
                    list.push(baselist[i])
                }
        }

        for (let i = 0; i < fighters.length; i++) {
            const newlist = fighters[i].model.GetObjectsWithAttatch()
            for (let j = 0 ; j < newlist.length; j++) {
                let IsFound = false;

                for (let k = 0; k < newlist[j].SelfDynamicProperty.Selections.length; k++) {
                    const selec = newlist[j].SelfDynamicProperty.Selections[k]
                    if (selec.SelectedChoice != null) {
                        if (selec.SelectedChoice.value == model) {
                            IsFound = true;
                            break;
                        }
                    }
                }
                if (IsFound) {
                    list.push(newlist[j])
                }
            }
        }
        return list;
    }

    public async IsModelInOtherFireteam(model : WarbandMember) : Promise<boolean> {
        
        for (let i = 0; i < this.Fireteams.length; i++) {
            if (this.IsModelInThisFireteam(this.Fireteams[i].SelfDynamicProperty.OptionChoice, model)) {
                return true;
            }
        }
        return false;
    }

    public async IsModelInExclusiveFireteam(model : WarbandMember) : Promise<boolean> {

        for (let i = 0; i < this.Fireteams.length; i++) {
            if (this.Fireteams[i].SelfDynamicProperty.OptionChoice.ContextKeys["added_context"]) {
                    const cntxt = this.Fireteams[i].SelfDynamicProperty.OptionChoice.ContextKeys["added_context"]
                    if (cntxt["exclusive"]) {
                        if (cntxt["exclusive"] == true) {
                            if (this.IsModelInThisFireteam(this.Fireteams[i].SelfDynamicProperty.OptionChoice, model)) {
                                return true;
                            }
                        }
                    }
                }
        }
        return false;
    }

    public async BuildModifiersFireteam(data : IWarbandProperty[]) {
        const eventmon : EventRunner = new EventRunner();
        let all_eq : Fireteam[] = []
        if (this.GeneralCache.fireteam_list != null) {
            all_eq = this.GeneralCache.fireteam_list
        } else {
            all_eq = await eventmon.runEvent(
                "getAllFireteamOptions",
                this,
                [],
                [],
                this
            )
        }
        for (let i = 0; i < this.Models.length; i++) {
            all_eq = await (this.Models[i].HeldObject as WarbandMember).GetFireteams(all_eq)
        }
        this.Fireteams = [];
        for (let i = 0; i < all_eq.length; i++) {
            let IsFound = false
            for (let j = 0; j < data.length; j++) {
                if (data[j].object_id == all_eq[i].ID) {
                    const NewRuleProperty = new WarbandProperty(all_eq[i], this, null, data[j]);
                    await NewRuleProperty.HandleDynamicProps(all_eq[i], this, null, data[j]);
                    await NewRuleProperty.BuildConsumables(data[j].consumables)
                    await NewRuleProperty.RegenerateOptions();
                    this.Fireteams.push(NewRuleProperty);
                    IsFound = true;
                    break;
                }
            }
            if (IsFound == false) {
                const NewRuleProperty = new WarbandProperty(all_eq[i], this, null, null);
                await NewRuleProperty.HandleDynamicProps(all_eq[i], this, null, null);
                await NewRuleProperty.BuildConsumables([])
                this.Fireteams.push(NewRuleProperty);
            }
        }

        for (let i = 0; i < this.Fireteams.length; i++) {
            await this.Fireteams[i].RegenerateOptions();
        }

        return this.Fireteams;
    }

    public ConvertToInterface() {
        const modelslist : IWarbandPurchaseModel[] = []
        for (let i = 0; i < this.Models.length; i++) {
            modelslist.push(this.Models[i].ConvertToInterfaceModel())
        }

        const equipmentlist : IWarbandPurchaseEquipment[] = []
        for (let i = 0; i < this.Equipment.length; i++) {
            equipmentlist.push(this.Equipment[i].ConvertToInterfaceEquipment())
        }

        const propertylist : IWarbandProperty[] = []
        for (let i = 0; i < this.Modifiers.length; i++) {
            const int = this.Modifiers[i].ConvertToInterface()
            if (int != undefined) {
                propertylist.push(this.Modifiers[i].ConvertToInterface())
            }
        }

        const propertyloclist : IWarbandProperty[] = []
        for (let i = 0; i < this.ModifiersLoc.length; i++) {
            const int = this.ModifiersLoc[i].ConvertToInterface()
            if (int != undefined) {
                propertyloclist.push(this.ModifiersLoc[i].ConvertToInterface())
            }
        }

        const fireteamlist : IWarbandProperty[] = []
        for (let i = 0; i < this.Fireteams.length; i++) {
            fireteamlist.push(this.Fireteams[i].ConvertToInterface())
        }
        const consumablelist : IWarbandConsumable[] = []
        for (let i = 0; i < this.Consumables.length; i++) {
            consumablelist.push(this.Consumables[i].ConvertToInterface())
        }

        // Store Warband Ducats/Glory
        this.Context.Ratings.rating_ducat = this.GetDucatRatingCost();
        this.Context.Ratings.rating_glory = this.GetGloryRatingCost();
        this.Context.Ratings.spare_ducat = this.GetSumCurrentDucats();
        this.Context.Ratings.spare_glory = this.GetSumCurrentGlory();
        this.Context.Ratings.stash_rating_ducat = this.GetDucatCostStash();
        this.Context.Ratings.stash_rating_glory = this.GetGloryCostStash();
        //

        const _objint : IUserWarband = {
            id : this.ID,
            context : this.Context.ConvertToInterface(),
            exploration : this.Exploration.ConvertToInterface(),
            faction : this.Faction.ConvertToInterface(),
            contextdata : this.ContextKeys,   
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags,
            ducat_bank: this.Ducats,
            glory_bank: this.Glory,
            models : modelslist,
            equipment : equipmentlist,
            notes: this.Notes,
            debts: this.Debts,
            modifiers: propertylist,
            modifiersloc: propertyloclist,
            fireteams: fireteamlist,
            consumables: consumablelist,
            restrictions_list: this.Restrictions
        }
        this.SelfData = _objint;
        return _objint;
    }

    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = []      

        if (this.ContextData) {            
            for (const key of Object.keys(this.ContextKeys)) {
                const context_entry = this.ContextData[key]
                if (context_entry == undefined) {continue;}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - dynamic lookup
                const func = context_entry[event_id];
                if (func !== undefined) {
                    const curr_package : ContextPackage = {
                        priority    : context_entry.event_priotity,
                        source      : source_obj,
                        self        : this,
                        callback    : func,
                        callbackdict: this.ContextKeys[key],
                        dyncontext  : this.MyContext,
                        callpath    : ["UserWarband","WarbandSource"]
                    }

                    subpackages.push(curr_package);
                }                
             }
        }

        if (this.Faction) {
            const static_packages : ContextPackage[] = await this.Faction.GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("UserWarband")
                subpackages.push(static_packages[j])
            }
        } 

        if (this.Exploration) {
            const static_packages : ContextPackage[] = await this.Exploration.GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("UserWarband")
                subpackages.push(static_packages[j])
            }
        } 

        for (let i = 0; i < this.Models.length; i++) {
            const static_packages : ContextPackage[] = await (this.Models[i].HeldObject as WarbandMember).GrabWarbandubPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("UserWarband")
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.Equipment.length; i++) {
            const static_packages : ContextPackage[] = await (this.Equipment[i].HeldObject as WarbandEquipment).GrabWarbandubPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("UserWarband")
                subpackages.push(static_packages[j])
            }
        }

        return subpackages; 
    }

    public async GetPatronList() {
        return await this.Faction.FindAllPatronOptions();
    }

    public async UpdateSelfPatron(patron_name : string ) {
        await this.Faction.UpdatePatron(patron_name);
    }

    public async GetExplorationSkillsInContext(): Promise<ExplorationSkillSuite[]> {
        return await this.Exploration.GetSkillsInFormat();
    }

    public async GetSelfExplorationSkills()  {
        if (this.GeneralCache.exploration_skills != null) {
            return this.GeneralCache.exploration_skills
        }
        const Events : EventRunner = new EventRunner();
        const SkillList : WarbandProperty[] = await Events.runEvent(
                "getExplorationSkills",
                (this),
                [],
                [],
                null
            )
        this.GeneralCache.exploration_skills = SkillList
        return SkillList;
    }

    public GetLocations() : WarbandProperty[] {
        return this.Exploration.Locations;
    }

    public async GetAvailableLocations() : Promise<ExplorationTableSuite[]> {
        return await this.Exploration.GetValidNewLocations();
    }

    public async GetWarbandAlerts() : Promise<WarbandAlert[]> {
        const AlertList: WarbandAlert[] = []

        AlertList.push({
            title: "Test Alert",
            content: "This alert is just a test, don't worry!"
        })

        return AlertList
    }


    /**
     * GETTERS
     */

    /**
     * Gets the ID of this warband
     * - like prussiantest1754653258679
     */
    public GetId(): any {
        return this.ID;
    }

    /**
     * Gets the ID of this warband
     * - Like 2670
     */
    public GetPostId(): any {
        return this.PostID;
    }

    public GetPatron() {
        return this.Faction.MyPatron;
    }

    public GetPatronName() {
            return this.GetPatron()?.Name || 'None';
    }


    /**
     * Returns the Name of the Warband as string
     */
    public GetWarbandName () {
        if( this.Name == undefined ) {
            return '';
        }
        return this.Name;
    }

    public SetWarbandName (newval : string) {
        if( newval != undefined ) {
            this.Name = newval;
        }
    }

    /**
     * Returns the Name of the Faction as string
     */
    public GetFactionName () {
        return this.Faction.GetSelfName();
    }

    /**
     * Returns the Name of the Faction as string
     */
    public GetFactionSlug () {

        return this.Faction.MyFaction?.ID;

    }

    /**
     * Returns the Base-Faction
     */
    public async GetFactionBase () {
        return await this.Faction.GetFactionBase();
    }

    /**
     * Returns the Faction
     */
    public GetFaction () {
        return this.Faction.GetFaction();
    }

    /** 
     * Returns the Ducats Value of the Warband Cost as int (without stash)
     */
    public GetCostDucats() {
        return this.GetDucatRatingCost()
    }

    /**
     * 
     * Returns the total Ducats Value including stash as int
     * @constructor
     */
    public GetCostDucatsTotal (discount = false) {
        return this.GetDucatCost(discount) + this.GetDucatCostStash(discount)
    }

    /**
     * Number of unspent ducats
     */
    public GetSumCurrentDucats() {
        return this.Ducats - this.GetCostDucatsTotal(true) -  this.Debts.ducats
    }

    /**
     * Number of unspent glory
     */
    public GetSumCurrentGlory() {
        return this.Glory - this.GetCostGloryTotal(true) -  this.Debts.glory
    }

    /**
     * Returns the Glory Value of the Warband Cost as int (without stash)
     */
    public GetCostGlory() {
        return this.GetGloryRatingCost()
    }

    /**
     * Returns the Glory Value of the Warband including stash as int
     */
    public GetCostGloryTotal(discount = false) {
        return this.GetGloryCost(discount) + this.GetGloryCostStash(discount)
    }

    /**
     * 
     * Returns bool - Does the warband have Troops?
     */
    public HasTroops () {
        return this.GetFighters().filter((item) => (!item.model.IsElite() && !item.model.IsMercenary() && item.model.State == "active")).length > 0;
    }

    /**
     *
     * Returns bool - Does the warband have Elites?
     */
    public HasElites () {
        return this.GetFighters().filter((item) => (item.model.IsElite() && item.model.State == "active")).length > 0;
    }

    /**
     *
     * Returns bool - Does the warband have mercenaries?
     */
    public HasMercenaries () {
        return this.GetFighters().filter((item) => (item.model.IsMercenary() && item.model.State == "active")).length > 0;
    }


    /**
     *
     * Returns bool - Does the warband have models in reserve?
     */
    public HasReserves () {
        return this.GetFighters().filter((item) => (item.model.State == "reserved")).length > 0;
    }

    /**
     *
     * Returns bool - Does the warband have models in reserve?
     */
    public HasDead () {
        return this.GetFighters().filter((item) => (item.model.State == "dead")).length > 0;
    }

    /**
     *
     * Returns bool - Does the warband have models in reserve?
     */
    public HasGone () {
        return this.GetFighters().filter((item) => (item.model.State == "lost")).length > 0;
    }

    /**
     * Get the Fighters for this warbands
     */
    public GetFighters() {
        const options : RealWarbandPurchaseModel[] = [ ];

        for (let i = 0; i < this.Models.length; i++) {
            options.push(
                {
                    purchase: this.Models[i],
                    model: this.Models[i].HeldObject as WarbandMember
                }
            )
        }

        return options;
    }
    /**
     * Get the Fighters for this warbands
     */
    public GetUsableFighters() {
        const options : RealWarbandPurchaseModel[] = [ ];

        for (let i = 0; i < this.Models.length; i++) {
            if ((this.Models[i].HeldObject as WarbandMember).State == "active" || (this.Models[i].HeldObject as WarbandMember).State == "reserved") {
                options.push(
                    {
                        purchase: this.Models[i],
                        model: this.Models[i].HeldObject as WarbandMember
                    }
                )
            }
        }

        return options;
    }

    /**
     * WBB Actions
     */

    public async AddCustomFighter (model : Model, cost : number, costtype : number) {

        if (!this.Restrictions.includes("custom_fighter")) {
            this.Restrictions.push("custom_fighter")
        }
        const FactionmodelInterface : IFactionModelRelationship = {
            id: model.GetID() + "_" + Date.now().toString(),
            name: model.GetTrueName(),
            source: "Warband_Custom",
            tags: {},
            contextdata : {},
            options : [],
            faction_id : [],
            model_id : model.GetID(),
            captain : false,
            mercenary : model.Stats.mercenary? model.Stats.mercenary : false,
            cost : cost,
            cost_type : costtype,
            restricted_models : [],
            warband_minimum : 0,
            warband_maximum : 0
        }
        const FacEquip : FactionModelRelationship = await ModelFactory.CreateFactionModel(FactionmodelInterface, this)
        await this.AddFighter([FacEquip])
    }

    /**
     * Adds a fighter to the Roster
     * @param fighter
     */
    public async AddFighter ( fighter: FactionModelRelationship[], free = false ) {
        const Added : WarbandPurchase[] = []
        for (let i = 0; i < fighter.length; i++) { 
            
            const Model : WarbandMember = await WarbandFactory.BuildWarbandMemberFromPurchase(fighter[i], this, this.IsUnRestricted);
            await Model.BuildModelEquipment(true);
            const NewPurchase : WarbandPurchase = new WarbandPurchase({
                cost_value : fighter[i].Cost,
                cost_type : fighter[i].CostType,
                count_limit : true,
                count_cap : true,
                discount: (free)? fighter[i].Cost : 0,
                sell_item : true,
                sell_full : true,
                purchaseid: fighter[i].Model.ID,
                faction_rel_id: fighter[i].ID,
                custom_rel: fighter[i].SelfData,
                modelpurch: false
            }, this, Model);
            this.Models.push(NewPurchase);
            Added.push(NewPurchase)
        }

        await this.RebuildProperties()
        return Added;
    }

    public async RebuildProperties() {
        
        await this.BuildModifiersSkills(this.SelfData.modifiers);
        await this.BuildModifiersLoc(this.SelfData.modifiersloc);
        await this.BuildModifiersFireteam(this.SelfData.fireteams);
        await this.Exploration.RebuildProperties();
        await this.Faction.RebuildProperties();
        const fighter = this.GetFighters();
        for (let i = 0; i < fighter.length; i ++) {
            await fighter[i].model.RebuildProperties();
        }
    }

    public async DuplicateFighter( fighter : RealWarbandPurchaseModel, count_cost = true ) {

        const IsValidToAdd = await this.AtMaxOfModel(fighter.purchase.PurchaseInterface);

        if (IsValidToAdd) {
            return "Warband At Limit For " + fighter.model.CurModel.GetTrueName();
        }

        if (count_cost == true) {
            let canaddupgrade = true;
            const maxccurcostount = fighter.purchase.ItemCost;

            if (fighter.purchase.CostType == 0) {
                canaddupgrade = (this).GetSumCurrentDucats() >= maxccurcostount;
            }
            if (fighter.purchase.CostType == 1) {
                canaddupgrade = (this).GetSumCurrentGlory() >= maxccurcostount;
            }

            if (!canaddupgrade) {
                return "Warband Cannot Afford " + fighter.model.CurModel.GetTrueName();
            }
        }

        const Check = await fighter.model.CanCopySelf();

        if (Check.length > 0) {
            return Check;
        }
        
        const milliseconds = Date.now();
        const NewMember : WarbandMember = await WarbandFactory.CreateWarbandMember((fighter.model.ConvertToInterface()), this, this.IsUnRestricted);
        NewMember.Name = fighter.model.Name
        NewMember.ID =  NewMember.CurModel.ID + "_" + this.Models.length + "_" + milliseconds.toString()
        const NewPurchase : WarbandPurchase = new WarbandPurchase(fighter.purchase.ConvertToInterface(), this, NewMember);
        this.Models.push(NewPurchase);


        await this.RebuildProperties()
        return fighter.model.Name + " Sucessfully Duplicated";

    }

    public async AtMaxOfModel( model : string) {
        const RefModel : FactionModelRelationship = await ModelFactory.CreateNewFactionModel(model, null);
        
        const eventmon : EventRunner = new EventRunner();
        let maxcount = RefModel.Maximum;
        if (this.ModelRelCache[RefModel.ID] != null) {
            maxcount = this.ModelRelCache[RefModel.ID].limit
        } else {
            maxcount = await eventmon.runEvent(
                "getModelLimitTrue",
                RefModel,
                [RefModel],
                maxcount,
                this
            )
            maxcount = await eventmon.runEvent(
                "getModelLimitTrue",
                this,
                [RefModel],
                maxcount,
                this
            )
        }
        if (this.GetCountOfRel(RefModel.ID) < maxcount || ((RefModel.Minimum == 0 && RefModel.Maximum == -1))) {
            return false;
        }
        return true;
    }
    
    public async DeleteFighter( fighter : RealWarbandPurchaseModel ) {
        
        for (let i = 0; i < this.Models.length; i++) {
            if (fighter.model == (this.Models[i].HeldObject as WarbandMember)) {
                const FighterItems : WarbandProperty[] = await fighter.model.GetWarbandSkills();
                for (let j = 0; j < FighterItems.length; j++) {
                    FighterItems[j].MyContext = this;
                    this.Modifiers.push(FighterItems[j])
                }
                const EquipmentItems : WarbandPurchase[] = await fighter.model.GetWarbandEquipment();
                for (let j = 0; j < EquipmentItems.length; j++) {
                    EquipmentItems[j].HeldObject.MyContext = this;
                    this.Equipment.push(EquipmentItems[j])
                }
                this.Models.splice(i, 1);
                break;
            }
        }

        await this.RebuildProperties()
    }

    public HasModifier(mod : WarbandProperty) {
        return (this.Modifiers.includes(mod)) || (this.Exploration.LocationMods.includes(mod));
    }
    
    public async Deletemod( mod : WarbandProperty ) {
        
        for (let i = 0; i < this.Modifiers.length; i++) {
            if (mod == (this.Modifiers[i])) {
                await mod.SendConsumablesUp();
                this.Modifiers.splice(i, 1);
                break;
            }
        }
        for (let i = 0; i < this.Exploration.LocationMods.length; i++) {
            if (mod == (this.Exploration.LocationMods[i])) {
                await mod.SendConsumablesUp();
                this.Exploration.LocationMods.splice(i, 1);
                break;
            }
        }
        await this.RebuildProperties()
    }

    public async DeleteLocation( loc : WarbandProperty ) {
        await this.Exploration.DeleteLocation(loc)
        await this.RebuildProperties()
    }

    public GetConsumablesEquipment() {
        const ConsumableList : WarbandConsumable[] = []

        for (let i = 0; i < this.Consumables.length; i++) {
            if (containsTag(this.Consumables[i].Tags, "consumable_type_equipment")) {
                ConsumableList.push(this.Consumables[i]);
            }
        }
        /*
        for (let j = 0; j < this.Exploration.Locations.length; j++) {
            
            for (let i = 0; i < this.Exploration.Locations[j].Consumables.length; i++) {
                if (containsTag(this.Exploration.Locations[j].Consumables[i].Tags, "consumable_type_equipment")) {
                    ConsumableList.push(this.Exploration.Locations[j].Consumables[i]);
                }
            }

        }*/

        return ConsumableList;
    }

    public async DeleteFighterWithDebt( fighter : RealWarbandPurchaseModel, debt_mod : number) {
        const CostVarDucats = fighter.purchase.GetTotalDucats();
        const CostVarGlory = fighter.purchase.GetTotalGlory();

        try {
            await this.DeleteFighter(fighter);
            if (fighter.purchase.CountCap == true) {
                this.Debts.ducats +=  Math.floor(CostVarDucats * debt_mod);
                this.Debts.glory += Math.floor(CostVarGlory * debt_mod);
            }


        } catch (e) { console.log(e) }
    }

    public async DirectAddStash( item : RealWarbandPurchaseEquipment) {
        this.Equipment.push(item.purchase);
    }

    public AddStashValue(newval : number, type : number) {
        if (type == 1) {
            this.Glory += newval;
        } else {
            this.Ducats += newval;
        }
    }

    public async CustomStash( item : Equipment, cost : number, costtype : number) {
        if (!this.Restrictions.includes("custom_equipment")) {
            this.Restrictions.push("custom_equipment")
        }
        const FactionequipmentInterface : IFactionEquipmentRelationship = {
            id: item.GetID() + "_" + Date.now().toString(),
            name: item.GetTrueName(),
            source: "Warband Custom",
            tags: {"is_custom": true},
            contextdata : {},
            faction_id : [],
            equipment_id : item.GetID(),
            cost : cost,
            costtype : costtype,
            limit : 0
        }
        const FacEquip : FactionEquipmentRelationship = await EquipmentFactory.CreateFactionEquipment(FactionequipmentInterface, this, true)
        await this.AddStash(FacEquip)
    }
    
    public async AddStash ( stash: FactionEquipmentRelationship, free = false, replace : null | FactionEquipmentRelationship = null) {
        let itemcost = stash.Cost;
        if ((this).EquipmentRelCache[stash.ID] != null) {
            itemcost = (this).EquipmentRelCache[stash.ID].cost
        }
        let purchase_fac_id = stash.ID
        let purchase_custom_id = stash.SelfData
        if (replace != null) {
            purchase_fac_id = replace.ID
            purchase_custom_id = replace.SelfData

        }
        const Equipment : WarbandEquipment = await WarbandFactory.BuildWarbandEquipmentFromPurchase(stash, this);
        const NewPurchase : WarbandPurchase = new WarbandPurchase({
            cost_value : itemcost,
            cost_type : stash.CostType,
            count_limit : true,
            count_cap : true,
            sell_item : true,
            sell_full : true,
            discount: (free)? itemcost : 0,
            purchaseid: stash.EquipmentItem.ID,
            faction_rel_id: purchase_fac_id,
            custom_rel: purchase_custom_id,
            modelpurch: false
        }, this, Equipment);
        this.Equipment.push(NewPurchase);
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onGainEquipment",
            Equipment,
            [this, this],
            null,
            NewPurchase
        )
    }
    
    public async DeleteStash( item : RealWarbandPurchaseEquipment, override_safety = false ) {
        
        for (let i = 0; i < this.Equipment.length; i++) {
            if (item.equipment == (this.Equipment[i].HeldObject as WarbandEquipment)) {
                this.Equipment.splice(i, 1);
                break;
            }
        }
        await this.RebuildProperties()
    }
    
    public async CopyStash( item : RealWarbandPurchaseEquipment ) {

        const IsValidToAdd = await this.AtMaxOfItem(item.purchase.PurchaseInterface);

        if (IsValidToAdd) {
            return "Warband At Limit For " + item.equipment.MyEquipment.GetTrueName();
        }

        const Relationship : FactionEquipmentRelationship = await EquipmentFactory.CreateFactionEquipment(item.purchase.CustomInterface as IFactionEquipmentRelationship, this, true)
        const Equipment : WarbandEquipment = await WarbandFactory.BuildWarbandEquipmentFromPurchase(Relationship, this);
        const NewPurchase : WarbandPurchase = new WarbandPurchase({
            cost_value : Relationship.Cost,
            cost_type : Relationship.CostType,
            count_limit : true,
            count_cap : true,
            discount: 0,
            sell_item : true,
            sell_full : true,
            purchaseid: Relationship.EquipmentItem.ID,
            faction_rel_id: Relationship.ID,
            custom_rel: Relationship.SelfData,
            modelpurch: false
        }, this, Equipment);
        this.Equipment.push(NewPurchase);
        
        await this.RebuildProperties()
        return Equipment.MyEquipment.Name + " Sucessfully Duplicated";
    }

    public async AtMaxOfItem( model : string) {
        const RefModel : FactionEquipmentRelationship | null = await EquipmentFactory.CreateNewFactionEquipment(model, null);
        if (RefModel == null) {
            return false;
        }
        const eventmon : EventRunner = new EventRunner();
        let maxcount = RefModel.Limit;
        let curcount = 0;

        if (this.EquipmentRelCache[RefModel.ID] != null) {
            maxcount = this.EquipmentRelCache[RefModel.ID].limit
            curcount = this.EquipmentRelCache[RefModel.ID].count_cur
        } else {
            maxcount = await eventmon.runEvent(
                "getEquipmentLimitTrue",
                RefModel,
                [],
                maxcount,
                this
            )
            curcount = this.GetCountOfEquipmentRel(RefModel.ID)
        }
        if (curcount < maxcount || (maxcount == 0 && RefModel.Limit == 0)) {
            if (!containsTag(RefModel.Tags, "exploration_only")) {
                return false;
            }
        }
        return true;
    }

    public async DeleteStashWithDebt( item : RealWarbandPurchaseEquipment, debt_mod : number) {
        const CostVarDucats = item.purchase.GetTotalDucats();
        const CostVarGlory = item.purchase.GetTotalGlory();

        try {
            await this.DeleteStash(item);
            if (item.purchase.CountCap == true) {
                this.Debts.ducats +=  Math.floor(CostVarDucats * debt_mod);
                this.Debts.glory += Math.floor(CostVarGlory * debt_mod);
            }

        } catch (e) { console.log(e) }
    }

    /**
     * Adds an exploration location to a Roster
     *
     */
    public async AddExplorationLocation ( location: ExplorationLocation, option: ISelectedOption[]) {
        await this.Exploration.AddExplorationLocation(location, option);
    }
    public async AddExplorationMod ( location: ExplorationLocation, option: ISelectedOption[]) {
        await this.Exploration.AddExplorationMod(location, option);
    }


    /**
     * Campaign Data
     * - This Data could be retrieved from a campaign object.
     * - We need to preserve the method to set these values by user input
     */
    /** @TODO Returns the name of the campaign for the warband
     * - can use Campaign Info
     */
    public GetCampaignName() {
        return 'No Campaign connected';
    }

    /**
     * - can use Campaign Info
     * - uses VP for the currently active cylce
     */
    GetVictoryPoints() {
        return this.Context.VictoryPoints;
    }

    SetVP(num : number) {
        this.Context.VictoryPoints = num;
    }

    /**
     * Return the campaign cycle of this warband
     - This is the campaign cycle that is currently selected for the WBB view
     */
    GetCampaignCycleView() {
        if(this.Context.CampaignRound) {
            return this.Context.CampaignRound;
        }

        return 1;
    }

    SetCurrentCycle(num : number) {
        this.Context.CampaignRound = num;
    }

    SetCurrentFailedPromotions(num : number) {
        this.Context.FailedPromotions = num;
    }

    /**
     * This returns the maximum campaign cycle for this warband
     * @constructor
     */
    GetCampaignCycleMax() {
        return 12;
    }

    /**
     * Returns the Threshold value for the currently viewed campaign cycle
     * @constructor
     */
    async GetCampaignTresholdValue () {
        const base = this.DucatLimit[this.GetCampaignCycleView() - 1] ?? this.DucatLimit[this.DucatLimit.length - 1];
        const eventmon : EventRunner = new EventRunner();
        let DucatCount = base
        if (this.GeneralCache.base_ducats != null) {
            DucatCount = this.GeneralCache.base_ducats
        } else {
            DucatCount = await eventmon.runEvent(
                "getStartingDucats",
                this,
                [],
                base,
                null
            )
        }
        if (DucatCount != undefined) {
            return DucatCount
        } else {
            return base
        }
    }

    GetCampaignMaxFieldStrength () {

        return this.ModelLimit[this.GetCampaignCycleView() - 1] ?? this.ModelLimit[this.ModelLimit.length - 1];
    }


    /**
     * @TODO: Get Battle Count for this warband
     * - can use Campaign Info
     * - Battle count != Campaign Cycle
     * - Currently not really used until play mode is implemented
     */
    GetBattleCount() {
        return 3;
    }

    /**
     * Get the stashed currency as object
     *
     */
    GetStash() {
        return {
            ValueDucats: this.GetDucatCostStash(), // stash value in ducats
            ValueGlory: this.GetGloryCostStash(), // stash value in glory
            AmountDucats: this.GetSumCurrentDucats(),  // unspent ducats
            AmountGlory: this.GetSumCurrentGlory(), // unspent glory
            TotalDucats: this.GetDucatTotalStash(), // total stash value in ducats
            TotalGlory: this.GetGloryTotalStash(), // total stash value in glory
            Items: []
        }
    }

    public GetDucatCost(discount = false) {
        
        let TotalDucatCost = 0;
        for (let i = 0; i < this.Models.length; i++) {
            TotalDucatCost += this.Models[i].GetTotalDucats(false, discount);
        }
        return TotalDucatCost
    }

    public GetDucatRatingCost() {
        
        let TotalDucatCost = 0;
        for (let i = 0; i < this.Models.length; i++) {
            if ((this.Models[i].HeldObject as WarbandMember).State == "active") {
                if (this.Models[i].CountCap == false) {
                    continue;
                }
                TotalDucatCost += this.Models[i].GetTotalDucats();
            }
        }
        return TotalDucatCost
    }

    /**
     * Gets the value of stashed items in ducats
     * @param discount
     */
    public GetDucatCostStash(discount = false) {
        
        let TotalDucatCost = 0;
        for (let i = 0; i < this.Equipment.length; i++) {
            if (this.Equipment[i].CountCap == false) {
                continue;
            }
            TotalDucatCost += this.Equipment[i].GetTotalDucats(false, discount);
        }
        return TotalDucatCost
    }

    public GetGloryCost(discount = false) {
        
        let TotalGloryCost = 0;
        for (let i = 0; i < this.Models.length; i++) {
            if (this.Models[i].CountCap == false) {
                continue;
            }
            TotalGloryCost += this.Models[i].GetTotalGlory(false, discount);
        }
        return TotalGloryCost
    }

    public GetGloryRatingCost() {
        
        let TotalGloryCost = 0;
        for (let i = 0; i < this.Models.length; i++) {
            if (this.Models[i].CountCap == false) {continue;}
            if ((this.Models[i].HeldObject as WarbandMember).State == "active") {
                TotalGloryCost += this.Models[i].GetTotalGlory();
            }
        }
        return TotalGloryCost
    }

    /**
     * Gets the value of stashed items in glory
     * @param discount
     */
    public GetGloryCostStash(discount = false) {
        
        let TotalGloryCost = 0;
        for (let i = 0; i < this.Equipment.length; i++) {
            if (this.Equipment[i].CountCap == false) {continue;}
            TotalGloryCost += this.Equipment[i].GetTotalGlory(false, discount);
        }
        return TotalGloryCost
    }

    /**
     * Returns the total value of stashed ducats and items as ducats
     * @constructor
     */
    public GetDucatTotalStash () {
        return this.GetDucatCostStash() + this.GetSumCurrentDucats();
    }

    /**
     * Returns the total value of stashed glory and items as glory
     * @constructor
     */
    public GetGloryTotalStash () {
        return this.GetGloryCostStash() + this.GetSumCurrentGlory();
    }

    /**
     * Returns the number of elite fighters in this warband
     * @constructor
     */
    GetNumElite() {
        return this.GetFighters().filter(f => f.model.IsElite()).length;
    }

    public async CanAddMoreElite() {
        
        const EventProc : EventRunner = new EventRunner();
        let result = 6

        if (this.GeneralCache.max_elite != null) {
            result = this.GeneralCache.max_elite
        } else {
        
            result = await EventProc.runEvent(
                "getNumberOfElite",
                this,
                [],
                6,
                this
            )
        }

        return this.GetNumElite() < result;
    }

    GetNumFielded() {
        return this.GetFighters().filter(f => f.model.State == "active").length;
    }

    /**
     * Returns the number of troop fighters in this warband
     * @constructor
     */
    GetNumTroop() {
        return this.GetFighters().filter(f => !f.model.IsElite() && !f.model.IsMercenary()).length
    }

    /**
     * Returns the number of mercenary fighters in this warband
     * @constructor
     */
    GetNumMercenary() {
        return this.GetFighters().filter(f => f.model.IsMercenary()).length;
    }

    /**
     * Returns an array of validation error strings
     *
     * @return: array
     */
    public async GetValidationErrors () {

        const AlertList : string[] = []

        const EventProc : EventRunner = new EventRunner();
        let CaptainFound = false
        for (let i = 0; i < this.Models.length; i++) {   
            if ((this.Models[i].HeldObject as WarbandMember).IsMercenary()) {
                continue;
            }    
            if ((this.Models[i].HeldObject as WarbandMember).State == "dead" || (this.Models[i].HeldObject as WarbandMember).State == "lost") {
                continue;
            }    
            let finalsource = [] 
            const CheckList = (this.Models[i].HeldObject as WarbandMember).GeneralCache.validation_check
            if (CheckList != null) {
                finalsource = CheckList
            } else {
                const result = await EventProc.runEvent(
                    "validateModelForWarband",
                    this,
                    [this],
                    [],
                    this.Models[i]
                )
                const result_fin = await EventProc.runEvent(
                    "validateModelForWarband",
                    this.Models[i].HeldObject as WarbandMember,
                    [this],
                    result,
                    this.Models[i]
                ) 
                finalsource = result_fin
            }

            for (let j = 0; j < finalsource.length; j++) {
                AlertList.push(finalsource[j])
            }

            if ((this.Models[i].CustomInterface as IFactionModelRelationship).captain) {
                if ((this.Models[i].CustomInterface as IFactionModelRelationship).captain == true) {
                    CaptainFound = true;
                }
            }
        }

        if (CaptainFound == false) {
            AlertList.push("The warband lacks a Leader")
        }
        
        if (this.IsUnRestricted == true) {
            AlertList.push("The warband has been set to Unrestricted mode")
        } 

        if (this.Restrictions.includes("custom_equipment") == true) {
            AlertList.push("The warband has been given a custom piece of equipment")
        } 

        if (this.Restrictions.includes("custom_fighter") == true) {
            AlertList.push("The warband has been given a custom fighter")
        } 

        const ErrorsInModelCount = await this.GetModelCountErrors();

        for (let i = 0; i < ErrorsInModelCount.length; i++) {
            AlertList.push(ErrorsInModelCount[i])
        }

        return AlertList
    }

    public async GetModelCountErrors() {
        const FacCheck = this.Faction.MyFaction;
        const ListOfRels : string[] = []
        let BaseRels : FactionModelRelationship[] = []
        
        if (FacCheck != undefined) {
            BaseRels = ((FacCheck.SelfDynamicProperty).OptionChoice as Faction).Models
        }

        const eventmon : EventRunner = new EventRunner();

        if (this.GeneralCache.fac_model_rel != null) {
            BaseRels = this.GeneralCache.fac_model_rel
        } else {
            BaseRels = await eventmon.runEvent(
                "getAllFactionModelRelationships",
                this,
                [],
                BaseRels,
                null
            )
        }

        for (let i = 0; i < BaseRels.length; i++) {
            
            if (this.GetCountOfRel(BaseRels[i].ID) < BaseRels[i].Minimum && ((BaseRels[i].Maximum != -1))) {
                ListOfRels.push("Your warband has too few " + BaseRels[i].Model.GetTrueName())
            }
        }

        return ListOfRels;
    }

    public IsWarbandCustom() {
        
        if (this.IsUnRestricted == true) {
            return true
        } 

        if (this.Restrictions.includes("custom_equipment") == true) {
            return true
        } 

        if (this.Restrictions.includes("custom_fighter") == true) {
            return true
        } 

        return false;
    }

    public IsWarbandExplorationOnly() {
        
        if (this.Restrictions.includes("open_exploration") == true) {
            return true
        } 

        return false;
    }

    /** 
     * Returns the notes for this warband as string
     * @constructor
     */
    GetWarbandNotes () {
        for (let i = 0; i < this.Notes.length; i++) {
            if (this.Notes[i].title == 'notes') {
                return this.Notes[i].text
            }
        }
        return ''
    }

    /**
     * Returns the lore for this warband as string
     * @constructor
     */
    GetLore () {
        for (let i = 0; i < this.Notes.length; i++) {
            if (this.Notes[i].title == 'lore') {
                return this.Notes[i].text
            }
        }
        return ''
    }

    public async SaveNote(text_new : string, title : string) {
        let note : INote | null = null;
        for (let i = 0; i < this.Notes.length; i++) {
            if (this.Notes[i].title == title) {
                
                this.Notes.splice(i, 1);
            }
        }
        note = {
            text: text_new,
            title: title
        }
        this.Notes.push(note);
        

    }

    /**
     * Returns the campaign notes for this warband as string
     *
     * @constructor
     */
    GetCampaignNotes () {
        for (let i = 0; i < this.Notes.length; i++) {
            if (this.Notes[i].title == 'campaign') {
                return this.Notes[i].text
            }
        }
        return ''
    }

    public async RunEventThroughAllMembers(baseresult : any, event_id : string, arrs: any[], trackVal : any) {
        
        const Events : EventRunner = new EventRunner();

        for (let i = 0; i < this.Models.length; i++) {
            const Model : WarbandMember = this.Models[i].HeldObject as WarbandMember;

            baseresult = await Events.runEvent(
                event_id,
                Model,
                arrs,
                baseresult,
                trackVal
            )
        }

        return baseresult;
    }

    public GetCountOfModel(id : string) {
        let count = 0;
        for (let i = 0; i < this.GetUsableFighters().length; i++) {
            if ((this.GetUsableFighters()[i].model).CurModel.ID == id) {
                count ++;
            }
        }
        return count;
    }
    

    public GetCountOfRel(id : string) {
        let count = 0;
        for (let i = 0; i < this.GetUsableFighters().length; i++) {
            if ((this.GetUsableFighters()[i].model).State == 'dead') { continue; }
            const inter = this.GetUsableFighters()[i].purchase.CustomInterface
            if (inter) {
                if (inter.id == id) {
                    count ++;
                }
            }
        }
        return count;
    }

    public GetCountOfUpgradeRel(id : string) {
        let count = 0;
        for (let i = 0; i < this.GetUsableFighters().length; i++) {
            count += ((this.GetUsableFighters()[i].model).GetUpgradeCount(id))
        }
        return count;
    }

    public GetCountOfEquipmentRel(id : string) {
        let count = 0;
        for (let i = 0; i < this.Equipment.length; i++) {
            if (this.Equipment[i].CountLimit == false) {
                continue;
            }
            const inter = this.Equipment[i].CustomInterface
            if (inter) {
                if (inter.id == id) {
                    count ++;
                }
            }
        }
        for (let i = 0; i < this.GetUsableFighters().length; i++) {
            count += ((this.GetUsableFighters()[i].model).GetEquipmentCount(id))
        }
        return count;
    }

    public async GetCountOfKeyword(id : string) {
        let count = 0;
        for (let i = 0; i < this.GetUsableFighters().length; i++) {
            const istruth = await (this.GetUsableFighters()[i].model).IsKeywordPresent(id)
            if (istruth) {
                count ++;
            }
        }
        return count;
    }

    public async GetCountOfTag(id : string, truthval : boolean) {
        let count = 0;
        for (let i = 0; i < this.GetUsableFighters().length; i++) {
            const istruth = await (this.GetUsableFighters()[i].model).IsTagPresent(id)
            if (istruth == truthval) {
                count ++;
            }
        }
        return count;
    }

    public async GetEliteFighterOptions() : Promise<FactionModelRelationship[]> {
        const ListOfRels : FactionModelRelationship[] = await this.GetFighterOptions();

        return ListOfRels.filter(item => item.Model.getKeywordIDs().includes("kw_elite"))
    }

    public async GetMercenaryFighterOptions() : Promise<FactionModelRelationship[]> {
        const ListOfRels : FactionModelRelationship[] = await this.GetFighterOptions();

        return ListOfRels.filter(item => (item.Mercenary == true))
    }

    public async GetTroopFighterOptions() : Promise<FactionModelRelationship[]> {
        const ListOfRels : FactionModelRelationship[] = await this.GetFighterOptions();

        return ListOfRels.filter(item => (((item.Mercenary == false)) && !(item.Model.getKeywordIDs().includes("kw_elite"))))
    }

    public async GetFighterOptions(count_cost = true) : Promise<FactionModelRelationship[]> {
        const FacCheck = this.Faction.MyFaction;
        const ListOfRels : FactionModelRelationship[] = []
        let BaseRels : FactionModelRelationship[] = []
        
        if (FacCheck != undefined) {
            BaseRels = ((FacCheck.SelfDynamicProperty).OptionChoice as Faction).Models
        }

        const eventmon : EventRunner = new EventRunner();

        if (this.GeneralCache.fac_model_rel != null) {
            BaseRels = this.GeneralCache.fac_model_rel
        } else {
            BaseRels = await eventmon.runEvent(
                "getAllFactionModelRelationships",
                this,
                [],
                BaseRels,
                null
            )
        }       

        for (let i = 0; i < BaseRels.length; i++) {
            const IsRestricted : boolean = await this.IsModelRestricted(BaseRels[i]);
            let maxcount = BaseRels[i].Maximum;
            let canaddupgrade = true;
            let maxccurcostount = BaseRels[i].Cost;
            let countofmodel = 0
            let maxofgroup = -1;
            let countofgroup = 0;
            
            if (this.ModelRelCache[BaseRels[i].ID]) {
                maxcount = this.ModelRelCache[BaseRels[i].ID].limit
                canaddupgrade = this.ModelRelCache[BaseRels[i].ID].canadd
                maxccurcostount = this.ModelRelCache[BaseRels[i].ID].cost
                countofmodel = this.ModelRelCache[BaseRels[i].ID].count_cur
                countofgroup = this.ModelRelCache[BaseRels[i].ID].group_cur
                maxofgroup = this.ModelRelCache[BaseRels[i].ID].group_limit
            } else {
                maxcount = await eventmon.runEvent(
                    "getModelLimitTrue",
                    BaseRels[i],
                    [BaseRels[i]],
                    maxcount,
                    this
                )
                maxcount = await eventmon.runEvent(
                    "getModelLimitTrue",
                    this,
                    [BaseRels[i]],
                    maxcount,
                    this
                )
                maxofgroup = await eventmon.runEvent(
                    "getGroupLimitTrue",
                    BaseRels[i],
                    [],
                    maxofgroup,
                    this
                )
                maxccurcostount = await eventmon.runEvent(
                    "getCostOfModel",
                    BaseRels[i],
                    [],
                    maxccurcostount,
                    this
                )
                countofmodel = this.GetCountOfRel(BaseRels[i].ID)
                countofgroup = await eventmon.runEvent(
                    "getCountOfGroup",
                    BaseRels[i],
                    [],
                    countofmodel,
                    this
                )
                if (! (countofmodel < maxcount || ((BaseRels[i].Minimum == 0 && BaseRels[i].Maximum == -1)))) {
                    canaddupgrade = false;
                }
                if (!(countofgroup < maxofgroup || maxofgroup < 0)) {
                    canaddupgrade = false;
                }
                if (count_cost == true && canaddupgrade == true) {
                    if (BaseRels[i].CostType == 0) {
                        canaddupgrade = (this).GetSumCurrentDucats() >= maxccurcostount;
                    }
                    if (BaseRels[i].CostType == 1) {
                        canaddupgrade = (this).GetSumCurrentGlory() >= maxccurcostount;
                    }
                }
                this.ModelRelCache[BaseRels[i].ID] = {
                    avoid_restriction: IsRestricted,
                    canadd: canaddupgrade,
                    cost: maxccurcostount,
                    count_cur: countofmodel,
                    facrel: BaseRels[i],
                    limit: maxcount,
                    group_cur: countofgroup,
                    group_limit: maxofgroup
                }
            }

            if (IsRestricted) { continue; }
            if (this.IsUnRestricted || canaddupgrade) {
                ListOfRels.push(BaseRels[i]);
            }

        }

        return ListOfRels
    }

    public async IsModelRestricted(model : FactionModelRelationship) : Promise<boolean> {
        const eventmon : EventRunner = new EventRunner();
        let AvoidRestriction = false;
        let relcount = 0

        if (this.ModelRelCache[model.ID] != null) {
            AvoidRestriction = this.ModelRelCache[model.ID].avoid_restriction
            relcount = this.ModelRelCache[model.ID].count_cur
        } else {
            AvoidRestriction = await eventmon.runEvent(
                "avoidModelRestriction",
                this,
                [],
                false,
                model
            )
        }
        if (!AvoidRestriction) {
            for (let i = 0; i < model.Restricted_Models.length; i++) {
                for (let j = 0; j < model.Restricted_Models[i].upgrade_ids.length; j++) {
                    if (this.GetCountOfRel(model.Restricted_Models[i].upgrade_ids[j]) > model.Restricted_Models[i].max_count) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public GetEntireWarbandEquipment() {
        let options : RealWarbandPurchaseEquipment[] = [ ];

        options = [...options, ...this.GetAllEquipment()]

        for (let i = 0; i < this.Models.length; i++) {
            const Mod = this.Models[i].HeldObject as WarbandMember;
            options = [...options, ...Mod.GetEquipment()]
        }

        return options;
    }

    public GetEntireWarbandUpgrade() {
        let options : RealWarbandPurchaseUpgrade[] = [ ];


        for (let i = 0; i < this.Models.length; i++) {
            const Mod = this.Models[i].HeldObject as WarbandMember;
            options = [...options, ...Mod.GetUpgrades()]
        }

        return options;
    }

    public GetAllEquipment() {
        
        const options : RealWarbandPurchaseEquipment[] = [ ];

        for (let i = 0; i < this.Equipment.length; i++) {
            options.push(
                {
                    purchase: this.Equipment[i],
                    equipment: this.Equipment[i].HeldObject as WarbandEquipment
                }
            )
        }

        for (let i = 0; i < this.Models.length; i++) {
            const ModelEquip = (this.Models[i].GetOwnItem() as WarbandMember).GetEquipment()
            for (let j = 0; j < ModelEquip.length; j++) {
                options.push(
                    ModelEquip[j]
                )
            }
        }

        return options;
    }

    public async GetFactionEquipmentOptions(use_explor = false, count_cost = true, get_base = false, exploration_cap = true) : Promise<FactionEquipmentRelationship[]> {
        const FacCheck = this.Faction.MyFaction;
        const ListOfRels : FactionEquipmentRelationship[] = []
        const AddedIDs : string[] = [];
        let BaseRels : FactionEquipmentRelationship[] = []
        let RefRels : FactionEquipmentRelationship[] = []

        if (FacCheck != undefined) {
            RefRels = ((FacCheck.SelfDynamicProperty).OptionChoice as Faction).EquipmentItems
        }

        let use_exploration = use_explor
        if (use_exploration == false) {
            use_exploration = this.IsWarbandExplorationOnly()
        }
        if (exploration_cap == true) {
            exploration_cap = !this.IsWarbandExplorationOnly()
        }

        for (let i = 0; i < RefRels.length; i++) {
            if (!containsTag(RefRels[i].Tags, "exploration_only") || use_exploration || this.IsUnRestricted) {
                BaseRels.push(RefRels[i]);
            }
        }
        const eventmon : EventRunner = new EventRunner();
        if (this.GeneralCache.faction_equip_rel != null) {
            BaseRels = this.GeneralCache.faction_equip_rel
        } else {
            
            BaseRels = await eventmon.runEvent(
                "getAllFactionEquipmentRelationships",
                this,
                [],
                BaseRels,
                null
            )
        }

        

        let FactionEquipRestrictionList : EquipmentRestriction[] = []
        if (this.GeneralCache.fac_equip_rest != null) {
            FactionEquipRestrictionList = this.GeneralCache.fac_equip_rest
        } else {
            
            FactionEquipRestrictionList  = await eventmon.runEvent(
                "getEquipmentRestriction", this, [], [], null )
        }

        for (let i = 0; i < BaseRels.length; i++) {
            
            const NewRefList : EquipmentRestriction[] = [];
            let maxcount = BaseRels[i].Limit;
            let maxccurcostount = BaseRels[i].Cost;
            let canadd = true;

            if (this.EquipmentRelCache[BaseRels[i].ID] == null ) {

                const EquipRestrictionList : EquipmentRestriction[] = await eventmon.runEvent(
                    "getEquipmentRestriction",BaseRels[i],[], [], null )
                const BaseEquipRestrictionList : EquipmentRestriction[] = await eventmon.runEvent(
                    "getEquipmentRestriction", BaseRels[i].EquipmentItem, [], [], null )
                for (let j = 0; j < EquipRestrictionList.length; j++) { NewRefList.push(EquipRestrictionList[j]); }
                for (let j = 0; j < BaseEquipRestrictionList.length; j++) { NewRefList.push(BaseEquipRestrictionList[j]); }
                for (let j = 0; j < FactionEquipRestrictionList.length; j++) { NewRefList.push(FactionEquipRestrictionList[j]); }

                const StringOfRestrictions = await eventmon.runEvent(
                    "getEquipmentRestrictionPresentable",
                    BaseRels[i],
                    [],
                    [],
                    NewRefList
                )
                
                maxcount = await eventmon.runEvent(
                    "getEquipmentLimitTrue",
                    BaseRels[i],
                    [BaseRels[i]],
                    maxcount,
                    this
                )
                maxcount = await eventmon.runEvent(
                    "getEquipmentLimitTrue",
                    this,
                    [BaseRels[i]],
                    maxcount,
                    this
                )

                maxccurcostount = await eventmon.runEvent(
                    "getCostOfEquipment",
                    BaseRels[i],
                    [BaseRels[i]],
                    maxccurcostount,
                    this
                )

                maxccurcostount = await eventmon.runEvent(
                    "getCostOfEquipment",
                    this,
                    [BaseRels[i]],
                    maxccurcostount,
                    this
                )
                canadd = await eventmon.runEvent(
                    "canWarbandAddItem",
                    this,
                    [NewRefList, BaseRels[i]],
                    true,
                    this
                )

                this.EquipmentRelCache[BaseRels[i].ID] = {
                    limit: maxcount,
                    cost : maxccurcostount,
                    facrel: BaseRels[i],
                    restrictions: StringOfRestrictions,
                    count_cur: this.GetCountOfEquipmentRel(BaseRels[i].ID),
                    canadd : canadd
                }
            } else {
                maxcount = this.EquipmentRelCache[BaseRels[i].ID].limit,
                maxccurcostount = this.EquipmentRelCache[BaseRels[i].ID].cost
                canadd = this.EquipmentRelCache[BaseRels[i].ID].canadd
            }

            if (get_base == true || this.IsUnRestricted == true) {
                AddedIDs.push(BaseRels[i].ID)
                ListOfRels.push(BaseRels[i]);
                continue;
            }

            if (!canadd) {
                continue;
            }
            
            if (this.EquipmentRelCache[BaseRels[i].ID].count_cur < maxcount || (maxcount == 0 && BaseRels[i].Limit == 0)) {
                if (!containsTag(BaseRels[i].Tags, "exploration_only") || use_exploration) {

                    if (count_cost == true) {
                        let canaddupgrade = true;

                        if (BaseRels[i].CostType == 0) {
                            canaddupgrade = (this).GetSumCurrentDucats() >= maxccurcostount;
                        }
                        if (BaseRels[i].CostType == 1) {
                            canaddupgrade = (this).GetSumCurrentGlory() >= maxccurcostount;
                            if (containsTag(BaseRels[i].Tags, "exploration_only") && exploration_cap && canaddupgrade == true) {
                                const explore_limit = await this.GetExplorationLimit()
                                canaddupgrade = maxccurcostount <= explore_limit;
                            }
                        }

                        if (canaddupgrade) {
                            AddedIDs.push(BaseRels[i].ID)
                            ListOfRels.push(BaseRels[i]);
                        }

                    } else {
                        AddedIDs.push(BaseRels[i].ID)
                        ListOfRels.push(BaseRels[i]);
                    }
                }
            }
        }

        return ListOfRels
    }

    public async GetExplorationLimit() {
        
        if (this.GeneralCache.exploration_limit != null) {
            return this.GeneralCache.exploration_limit
        }
        const Events : EventRunner = new EventRunner();
        const ExploreLimit : number = await Events.runEvent(
                "getExplorationLimit",
                this,
                [],
                0,
                this
            )
        this.GeneralCache.exploration_limit = ExploreLimit
        return ExploreLimit;
    }

    public async GetModifiersList() {
        const PropertyList : WarbandProperty[] = [];

        for (let i = 0; i < this.Models.length; i++) {
            const Mods = await (this.Models[i].HeldObject as WarbandMember).GetWarbandSkills();
            for (let j = 0; j < Mods.length; j++) {
                PropertyList.push(Mods[j])
            }
        }
        
        const Mods = await (this.Exploration).GetWarbandModifiers();
        for (let j = 0; j < Mods.length; j++) {
            PropertyList.push(Mods[j])
        }

        for (let i = 0; i < this.Modifiers.length; i++) {
            PropertyList.push(this.Modifiers[i])    
        }

        return PropertyList;
    }

    public async GetFireteams() {
        const PropertyList : WarbandProperty[] = [];
        if (this.GeneralCache.fireteam_list == null) {
            await this.BuildModifiersFireteam(this.ConvertToInterface().fireteams);
        }
        for (let i = 0; i < this.Fireteams.length; i++) {
            PropertyList.push(this.Fireteams[i])    
        }

        return PropertyList;
    }

    public GetWarbandFactionModifiersList() {
        
        let PropertyList : WarbandProperty[] = [];

        PropertyList = [...PropertyList, ...this.Faction.GetModifierProperties().filter((item) => item.SelfDynamicProperty.Selections.length == 0)]

        return PropertyList;
    }

    public GetWarbandFactionOptionsModifiersList() {
        
        let PropertyList : WarbandProperty[] = [];

        PropertyList = [...PropertyList, ...this.Faction.GetModifierProperties().filter((item) => item.SelfDynamicProperty.Selections.length > 0)]

        return PropertyList;

    }

    public ReorganiseFighters(set : any, over: any) {
        let NewSet = null;
        let NewOver = null;
        
        for (let i = 0; i < this.Models.length; i++) {
            if (this.Models[i].HeldObject.ID == set.id) {
                NewSet = this.Models[i];
            }
            if (this.Models[i].HeldObject.ID == over.id) {
                NewOver = this.Models[i];
            }
        }

        if (NewSet == null || NewOver == null) {
            return;
        }

        const fromIndex = this.Models.indexOf(NewSet);
        const toIndex = this.Models.indexOf(NewOver);

        // Validate both members exist
        if (fromIndex === -1 || toIndex === -1) {
            return;
        }

        // Remove the member from its original position
        this.Models.splice(fromIndex, 1);

        // Recalculate toIndex if needed (shifted due to removal)
        const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;

        // Insert the member at the new position
        this.Models.splice(adjustedIndex, 0, NewSet);
    }

    /**
     * Builds the export text for copy-paste warband summary
     * - uses the "full" parameter to toggle between a full and compact list
     *
     * @param full
     * @constructor
     */
    public BuildExport(full = true) {

        let full_mode = null // cache busting

        if (this.GeneralCache.exportval != null
            && full_mode != null
            && (full_mode == full))
        {
            return this.GeneralCache.exportval
        }

        full_mode = full;  // cache the mode


        const LineList : string[] = [];
        const elite = this.GetFighters().filter((item) => (item.model.IsElite() && item.model.State == "active"))
        const troops = this.GetFighters().filter((item) => (item.model.IsTroop() && item.model.State == "active"))
        const mercenaries = this.GetFighters().filter((item) => (item.model.IsMercenary() && item.model.State == "active"))
        const reserves = this.GetFighters().filter((item) => (item.model.State == "reserved"))
        const lost = this.GetFighters().filter((item) => (item.model.State == "lost"))
        const dead = this.GetFighters().filter((item) => (item.model.State == "dead"))
        LineList.push("## " + this.GetTrueName() + " ##")
        LineList.push(" ")

        LineList.push("Faction: " + this.GetFactionName() )
        LineList.push("Rating: " + this.GetDucatRatingCost().toString() + " Ducats | "+ this.GetGloryRatingCost().toString() + " Glory" )
        LineList.push("Patron: " + this.GetPatronName())

        if (elite.length > 0) {
            LineList.push(" ")
            LineList.push(" ")
            LineList.push("## Elites ##")
            for (let i = 0; i < elite.length; i++) {
                LineList.push("  ")
                LineList.push(elite[i].model.GetTrueName() + " - " + elite[i].model.GetModelName())

                LineList.push("• Cost: "+elite[i].purchase.GetTotalDucats().toString() + " Ducats | " + elite[i].purchase.GetTotalGlory().toString() + " Glory")
                if (elite[i].model.Upgrades.length > 0) {
                    LineList.push("  " + "Upgrades & Choices: ")
                    const UpgradesList : string[] = []
                    for (let j = 0; j < elite[i].model.Upgrades.length; j++) {
                        UpgradesList.push(elite[i].model.Upgrades[j].GetItemName())
                    }
                    LineList.push("    " + UpgradesList.join(', '))
                }
                if (elite[i].model.Equipment.length > 0) {
                    LineList.push("• Equipment: "+ elite[i].model.GetEquipmentAsString())
                }
                if (elite[i].model.Skills.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < elite[i].model.Skills.length; j++) {
                        UpgradesList.push(elite[i].model.Skills[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Skills: " + UpgradesList.join(', '))
                }
                if (elite[i].model.Injuries.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < elite[i].model.Injuries.length; j++) {
                        UpgradesList.push(elite[i].model.Injuries[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Injuries: " + UpgradesList.join(', '))
                }
            }
        }

        if (troops.length > 0) {
            LineList.push("  ")
            LineList.push("  ")
            LineList.push("## Troops ##")
            for (let i = 0; i < troops.length; i++) {
                LineList.push("  ")
                LineList.push(troops[i].model.GetTrueName() + " - " + troops[i].model.GetModelName())
                LineList.push("• Cost: " + troops[i].purchase.GetTotalDucats().toString() + " Ducats | " + troops[i].purchase.GetTotalGlory().toString() + " Glory")
                if (troops[i].model.Upgrades.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < troops[i].model.Upgrades.length; j++) {
                        UpgradesList.push(troops[i].model.Upgrades[j].GetItemName())
                    }
                    LineList.push("• Upgrades & Choices: " + UpgradesList.join(', '))
                }
                if (troops[i].model.Equipment.length > 0) {
                    LineList.push("• Equipment: " + troops[i].model.GetEquipmentAsString())
                }
                if (troops[i].model.Skills.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < troops[i].model.Skills.length; j++) {
                        UpgradesList.push(troops[i].model.Skills[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Skills: " + UpgradesList.join(', '))
                }
                if (troops[i].model.Injuries.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < troops[i].model.Injuries.length; j++) {
                        UpgradesList.push(troops[i].model.Injuries[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Injuries: " + UpgradesList.join(', '))
                }
            }
        }
        if (mercenaries.length > 0) {
            LineList.push("  ")
            LineList.push("  ")
            LineList.push("## Mercenaries ##")
            for (let i = 0; i < mercenaries.length; i++) {
                LineList.push("  ")
                LineList.push(mercenaries[i].model.GetTrueName() + " - " + mercenaries[i].model.GetModelName())
                LineList.push("• Cost: " + mercenaries[i].purchase.GetTotalDucats().toString() + " Ducats | " + mercenaries[i].purchase.GetTotalGlory().toString() + " Glory")
                if (mercenaries[i].model.Upgrades.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < mercenaries[i].model.Upgrades.length; j++) {
                        UpgradesList.push(mercenaries[i].model.Upgrades[j].GetItemName())
                    }
                    LineList.push("• Upgrades & Choices: " + UpgradesList.join(', '))
                }
                if (mercenaries[i].model.Equipment.length > 0) {
                    LineList.push("• Equipment: " + mercenaries[i].model.GetEquipmentAsString())
                }
                if (mercenaries[i].model.Skills.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < mercenaries[i].model.Skills.length; j++) {
                        UpgradesList.push(mercenaries[i].model.Skills[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Skills: " + UpgradesList.join(', '))
                }
                if (mercenaries[i].model.Injuries.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < mercenaries[i].model.Injuries.length; j++) {
                        UpgradesList.push(mercenaries[i].model.Injuries[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Injuries: " + UpgradesList.join(', '))
                }
            }
        }

        if (reserves.length > 0 && full) {
            LineList.push("  ")
            LineList.push("  ")
            LineList.push("## Reserves ##")
            for (let i = 0; i < reserves.length; i++) {
                LineList.push("  ")
                LineList.push(reserves[i].model.GetTrueName() + " - " + reserves[i].model.GetModelName())
                LineList.push("• Cost: " + reserves[i].purchase.GetTotalDucats().toString() + " Ducats | " + reserves[i].purchase.GetTotalGlory().toString() + " Glory")
                if (reserves[i].model.Upgrades.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < reserves[i].model.Upgrades.length; j++) {
                        UpgradesList.push(reserves[i].model.Upgrades[j].GetItemName())
                    }
                    LineList.push("• Upgrades & Choices: " + UpgradesList.join(', '))
                }
                if (reserves[i].model.Equipment.length > 0) {
                    LineList.push("• Equipment: " + reserves[i].model.GetEquipmentAsString())
                }
                if (reserves[i].model.Skills.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < reserves[i].model.Skills.length; j++) {
                        UpgradesList.push(reserves[i].model.Skills[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Skills: " + UpgradesList.join(', '))
                }
                if (reserves[i].model.Injuries.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < reserves[i].model.Injuries.length; j++) {
                        UpgradesList.push(reserves[i].model.Injuries[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Injuries: " + UpgradesList.join(', '))
                }
            }
        }

        if (lost.length > 0 && full) {
            LineList.push("  ")
            LineList.push("  ")
            LineList.push("## Lost & Captured ##")
            for (let i = 0; i < lost.length; i++) {
                LineList.push("  ")
                LineList.push(lost[i].model.GetTrueName() + " - " + lost[i].model.GetModelName())
                LineList.push("• Cost: " + lost[i].purchase.GetTotalDucats().toString() + " Ducats | " + lost[i].purchase.GetTotalGlory().toString() + " Glory")
                if (lost[i].model.Upgrades.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < lost[i].model.Upgrades.length; j++) {
                        UpgradesList.push(lost[i].model.Upgrades[j].GetItemName())
                    }
                    LineList.push("• Upgrades & Choices: " + UpgradesList.join(', '))
                }
                if (lost[i].model.Equipment.length > 0) {
                    LineList.push("• Equipment: " + lost[i].model.GetEquipmentAsString())
                }
                if (lost[i].model.Skills.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < lost[i].model.Skills.length; j++) {
                        UpgradesList.push(lost[i].model.Skills[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Skills: " + UpgradesList.join(', '))
                }
                if (lost[i].model.Injuries.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < lost[i].model.Injuries.length; j++) {
                        UpgradesList.push(lost[i].model.Injuries[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Injuries: " + UpgradesList.join(', '))
                }
            }
        }
        if (dead.length > 0 && full) {
            LineList.push("  " )
            LineList.push("  " )
            LineList.push("## Dead ##")
            for (let i = 0; i < dead.length; i++) {
                LineList.push("• Cost: ")
                LineList.push(dead[i].model.GetTrueName() + " - " + dead[i].model.GetModelName())
                LineList.push("  " + dead[i].purchase.GetTotalDucats().toString() + " Ducats | " + dead[i].purchase.GetTotalGlory().toString() + " Glory")
                if (dead[i].model.Upgrades.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < dead[i].model.Upgrades.length; j++) {
                        UpgradesList.push(dead[i].model.Upgrades[j].GetItemName())
                    }
                    LineList.push("• Upgrades & Choices: " + UpgradesList.join(', '))
                }
                if (dead[i].model.Equipment.length > 0) {
                    LineList.push("• Equipment: " + dead[i].model.GetEquipmentAsString())
                }
                if (dead[i].model.Skills.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < dead[i].model.Skills.length; j++) {
                        UpgradesList.push(dead[i].model.Skills[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Skills: " + UpgradesList.join(', '))
                }
                if (dead[i].model.Injuries.length > 0) {
                    const UpgradesList : string[] = []
                    for (let j = 0; j < dead[i].model.Injuries.length; j++) {
                        UpgradesList.push(dead[i].model.Injuries[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                    }
                    LineList.push("• Injuries: " + UpgradesList.join(', '))
                }
            }
        }
        if (full) {

            LineList.push("  " )
            LineList.push("  " )
            LineList.push("## Stash ##")
            LineList.push("  " )

            // add stashed ducats and glory
            const stash = this.GetStash();

            LineList.push("Stashed Ducats: " + (stash.AmountDucats > 10e10? "Unlimited" : stash.AmountDucats))
            LineList.push("Unspent Glory: " + (stash.AmountGlory  > 10e10? "Unlimited" : stash.AmountGlory))

            // Add stashed Equipment
            if( this.Equipment.length > 0) {
                LineList.push("  " )

                const UpgradesList : string[] = []
                for (let j = 0; j < this.Equipment.length; j++) {
                    const rel_equip = this.Equipment[j].HeldObject as WarbandEquipment
                    UpgradesList.push(rel_equip.GetTrueName())
                }
                LineList.push(UpgradesList.join(', '))
            }




        }

        if (this.Modifiers.length > 0) {

            LineList.push("  ")
            LineList.push("  ")
            LineList.push("## Modifiers ##")
            LineList.push("  ")

            for (let j = 0; j < this.Modifiers.length; j++) {
                LineList.push(this.Modifiers[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                for (let k = 0; k < this.Modifiers[j].SelfDynamicProperty.Selections.length; k++) {
                    const mod = this.Modifiers[j].SelfDynamicProperty.Selections[k].SelectedChoice
                    if (mod != null) {
                        LineList.push("• " + mod.display_str)
                    }
                }
            }
        }

        if (this.Fireteams.length > 0 && full) {

            LineList.push("  ")
            LineList.push("  ")
            LineList.push("## Fireteams ##")
            LineList.push("  ")

            for (let j = 0; j < this.Fireteams.length; j++) {
                LineList.push(this.Fireteams[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                for (let k = 0; k < this.Fireteams[j].SelfDynamicProperty.Selections.length; k++) {
                    const mod = this.Fireteams[j].SelfDynamicProperty.Selections[k].SelectedChoice
                    if (mod != null) {
                        LineList.push("• " + mod.display_str)
                    }
                }
            }
        }
        const Locations = this.GetLocations();
        if (Locations.length > 0) {

            LineList.push("  ")
            LineList.push("  ")
            LineList.push("## Locations ##")
            LineList.push("  ")

            for (let j = 0; j < Locations.length; j++) {
                LineList.push(Locations[j].SelfDynamicProperty.OptionChoice.GetTrueName())
                for (let k = 0; k < Locations[j].SelfDynamicProperty.Selections.length; k++) {
                    const mod = Locations[j].SelfDynamicProperty.Selections[k].SelectedChoice
                    if (mod != null) {
                        LineList.push("• " + mod.display_str)
                    }
                }
            }
        }

        /**
         * Add link to the list
         * - Check if is integer first
         */
        if (Number.isInteger(Number(this.GetPostId()))) {
            LineList.push("  ")
            LineList.push("---")
            LineList.push(" ")
            LineList.push("View online:")
            LineList.push("https://trench-companion.com/warband/detail/" + this.GetPostId())
        }


        this.GeneralCache.exportval = LineList
        return LineList
    }


    /**
     * Returns a JSON export to use with TTS
     *
     * @constructor
     */
    public async BuildExportJSON () {

        this.ConvertToInterface();
        const WbManager : WarbandManager = ToolsController.getInstance().UserWarbandManager;
        const WBUser : SumWarband | null = WbManager.GetItemByBaseID(this.ID);

        if (WBUser == null) {
            const WBPublic : SumWarband | null = await WarbandFactory.GetWarbandPublicByID(this.PostID)
            if (WBPublic == null) {
                return ["Something Went Wrong"]
            }
            const EXPORT = await ConvertToTTSExport(WBPublic);
            return [JSON.stringify(EXPORT, null, 2)];
        }

        const EXPORT = await ConvertToTTSExport(WBUser);
        return [JSON.stringify(EXPORT, null, 2)];

    }
}


export {IUserWarband, UserWarband}

