import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { containsTag, DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './High_Level/WarbandContextItem';
import { ExplorationSkillSuite, ExplorationTableSuite, IWarbandExplorationSet, WarbandExplorationSet } from './CoreElements/WarbandExplorationSet';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { IWarbandFaction, WarbandFaction } from './CoreElements/WarbandFaction';
import { IWarbandPurchaseEquipment, IWarbandPurchaseModel, RealWarbandPurchaseEquipment, RealWarbandPurchaseModel, WarbandPurchase } from './Purchases/WarbandPurchase';
import { IWarbandMember, WarbandMember } from './Purchases/WarbandMember';
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

interface WarbandDebt {
    ducats : number,
    glory : number
}

export interface WarbandAlert {
    title: string,
    content: string
}

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
    fireteams: IWarbandProperty[],
    consumables: IWarbandConsumable[]
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
    public Fireteams : WarbandProperty[] = [];
    public Consumables : WarbandConsumable[] = [];

    public DucatLimit : number[] = [700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800];
    public ModelLimit : number[] = [10,11,12,13,14,15,16,17,18,19,20,22];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IUserWarband)
    {
        super(data, null)
        this.ID = data.id;
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
    }

    public async NewWarbandItems(data : IUserWarband) {
        this.Faction = await WarbandFactory.CreateWarbandFaction(data.faction, this);
        this.Exploration = await WarbandFactory.CreateWarbandExplorationSet(data.exploration, this);
    }

    public async BuildModels(data : IWarbandPurchaseModel[]) {
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandMember = await WarbandFactory.CreateWarbandMember(data[i].model, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Models.push(NewPurchase);
        }
    }

    public async BuildEquipment(data : IWarbandPurchaseEquipment[]) {
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandEquipment = await WarbandFactory.CreateWarbandEquipment(data[i].equipment, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Equipment.push(NewPurchase);
        }

    }

    public async BuildModifiersSkills(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = await SkillFactory.CreateNewSkill(CurVal.object_id, this, true);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this, null, CurVal)
            await NewLocation.BuildConsumables(CurVal.consumables)
            this.Modifiers.push(NewLocation);
        }
    }
    
    public async BuildConsumables(data: IWarbandConsumable[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i]
            const NewConsumable = new WarbandConsumable(CurVal, this);
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
        let all_eq : Fireteam[] = await eventmon.runEvent(
            "getAllFireteamOptions",
            this,
            [],
            [],
            this
        )
        for (let i = 0; i < this.Models.length; i++) {
            all_eq = await eventmon.runEvent(
                "getAllFireteamOptions",
                this.Models[i].HeldObject as WarbandMember,
                [],
                all_eq,
                this
            )
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

        const fireteamlist : IWarbandProperty[] = []
        for (let i = 0; i < this.Fireteams.length; i++) {
            fireteamlist.push(this.Fireteams[i].ConvertToInterface())
        }
        const consumablelist : IWarbandConsumable[] = []
        for (let i = 0; i < this.Consumables.length; i++) {
            consumablelist.push(this.Consumables[i].ConvertToInterface())
        }
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
            fireteams: fireteamlist,
            consumables: consumablelist
        }
        
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
     * @constructor
     */
    public GetId(): any {
        return this.ID;
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
    public GetCostDucatsTotal () {
        return this.GetDucatCost() + this.GetDucatCostStash()
    }

    public GetSumCurrentDucats() {
        return this.Ducats - this.GetCostDucatsTotal() -  this.Debts.ducats
    }

    public GetSumCurrentGlory() {
        return this.Glory - this.GetCostGloryTotal() -  this.Debts.glory
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
    public GetCostGloryTotal() {
        return this.GetGloryCost() + this.GetGloryCostStash()
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
     * WBB Actions
     */

    /**
     * Adds a fighter to the Roster
     * @param fighter
     */
    public async AddFighter ( fighter: FactionModelRelationship[] ) {
        for (let i = 0; i < fighter.length; i++) { 
            
            const Model : WarbandMember = await WarbandFactory.BuildWarbandMemberFromPurchase(fighter[i], this);
            await Model.BuildModelEquipment(true);
            const NewPurchase : WarbandPurchase = new WarbandPurchase({
                cost_value : fighter[i].Cost,
                cost_type : fighter[i].CostType,
                count_limit : true,
                count_cap : true,
                sell_item : true,
                sell_full : true,
                purchaseid: fighter[i].Model.ID,
                faction_rel_id: fighter[i].ID,
                custom_rel: fighter[i].SelfData,
                modelpurch: false
            }, this, Model);
            this.Models.push(NewPurchase);
        }

        await this.RebuildProperties()
        await this.BuildModifiersFireteam(this.SelfData.fireteams);
    }

    public async RebuildProperties() {
        
        await this.BuildModifiersSkills(this.SelfData.modifiers);
        await this.BuildModifiersFireteam(this.SelfData.fireteams);
        await this.Exploration.RebuildProperties();
        await this.Faction.RebuildProperties();
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
        
        const milliseconds = Date.now();
        const NewMember : WarbandMember = await WarbandFactory.CreateWarbandMember((fighter.model.ConvertToInterface()), this);
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
        maxcount = await eventmon.runEvent(
            "getModelLimitTrue",
            RefModel,
            [],
            maxcount,
            this
        )
        if (this.GetCountOfRel(RefModel.ID) < maxcount || ((RefModel.Minimum == 0 && RefModel.Maximum == 0))) {
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
                this.Models.splice(i, 1);
                break;
            }
        }

        await this.RebuildProperties()
    }

    public HasModifier(mod : WarbandProperty) {
        return (this.Modifiers.includes(mod));
    }
    
    public async Deletemod( mod : WarbandProperty ) {
        
        for (let i = 0; i < this.Modifiers.length; i++) {
            if (mod == (this.Modifiers[i])) {
                await mod.SendConsumablesUp();
                this.Modifiers.splice(i, 1);
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

        for (let j = 0; j < this.Exploration.Locations.length; j++) {
            
            for (let i = 0; i < this.Exploration.Locations[j].Consumables.length; i++) {
                if (containsTag(this.Exploration.Locations[j].Consumables[i].Tags, "consumable_type_equipment")) {
                    ConsumableList.push(this.Exploration.Locations[j].Consumables[i]);
                }
            }

        }

        return ConsumableList;
    }

    public async DeleteFighterWithDebt( fighter : RealWarbandPurchaseModel, debt_mod : number) {
        const CostVarDucats = fighter.purchase.GetTotalDucats();
        const CostVarGlory = fighter.purchase.GetTotalGlory();

        try {
            await this.DeleteFighter(fighter);
            this.Debts.ducats +=  Math.ceil(CostVarDucats * debt_mod);
            this.Debts.glory += Math.ceil(CostVarGlory * debt_mod);

        } catch (e) { console.log(e) }
    }

    public async DirectAddStash( item : RealWarbandPurchaseEquipment) {
        this.Equipment.push(item.purchase);
    }
    
    public async AddStash ( stash: FactionEquipmentRelationship ) {
        const Equipment : WarbandEquipment = await WarbandFactory.BuildWarbandEquipmentFromPurchase(stash, this);
        const NewPurchase : WarbandPurchase = new WarbandPurchase({
            cost_value : stash.Cost,
            cost_type : stash.CostType,
            count_limit : true,
            count_cap : true,
            sell_item : true,
            sell_full : true,
            purchaseid: stash.EquipmentItem.ID,
            faction_rel_id: stash.ID,
            custom_rel: stash.SelfData,
            modelpurch: false
        }, this, Equipment);
        this.Equipment.push(NewPurchase);
    }
    
    public async DeleteStash( item : RealWarbandPurchaseEquipment ) {
        
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

        const Relationship : FactionEquipmentRelationship = await EquipmentFactory.CreateFactionEquipment(item.purchase.CustomInterface as IFactionEquipmentRelationship, this)
        const Equipment : WarbandEquipment = await WarbandFactory.BuildWarbandEquipmentFromPurchase(Relationship, this);
        const NewPurchase : WarbandPurchase = new WarbandPurchase({
            cost_value : Relationship.Cost,
            cost_type : Relationship.CostType,
            count_limit : true,
            count_cap : true,
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
        const RefModel : FactionEquipmentRelationship = await EquipmentFactory.CreateNewFactionEquipment(model, null);
        
        const eventmon : EventRunner = new EventRunner();
        let maxcount = RefModel.Limit;
        maxcount = await eventmon.runEvent(
            "getEquipmentLimitTrue",
            RefModel,
            [],
            maxcount,
            this
        )
        if (this.GetCountOfEquipmentRel(RefModel.ID) < maxcount || (maxcount == 0 && RefModel.Limit == 0)) {
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
            this.Debts.ducats +=  Math.ceil(CostVarDucats * debt_mod);
            this.Debts.glory += Math.ceil(CostVarGlory * debt_mod);

        } catch (e) { console.log(e) }
    }

    /**
     * Adds an exploration location to a Roster
     *
     */
    public async AddExplorationLocation ( location: ExplorationLocation, option: ISelectedOption[]) {
        await this.Exploration.AddExplorationLocation(location, option);
    }


    /** @TODO
     * Adds a modifier item to a warband
     *
     * @param modifier
     * @param option
     */
    public AddModifier ( modifier: object, option: object) {

        return false;

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
     * @TODO: Return the Vistory Points for this Warband
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
     * @TODO: Return the Campaign Cycle of the connected campaign
     - can use Campaign Info
     - This is the campaign cycle that is currently selected for the WBB view
     */
    GetCampaignCycleView() {
        return this.Context.CampaignRound;
    }

    SetCurrentCycle(num : number) {
        this.Context.CampaignRound = num;
    }

    /**
     * @TODO: return the maximum campaign cycle, that is possible for this Warband
     * - This returns the maximum campaign cycle this warband has advanced to
     * - simultaneously this is the only cycle, which can be edited
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
        const DucatCount = await eventmon.runEvent(
            "getStartingDucats",
            this,
            [],
            base,
            null
        )
        return DucatCount
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
     * @TODO get stash Data
     */
    GetStash() {

        return {
            ValueDucats: this.GetDucatCostStash(),
            ValueGlory: this.GetGloryCostStash(),
            AmountDucats: this.Ducats - this.GetCostDucatsTotal() -  this.Debts.ducats,
            AmountGlory: this.Glory - this.GetCostGloryTotal() -  this.Debts.glory,
            Items: []
        }
    }

    public GetDucatCost() {
        
        let TotalDucatCost = 0;
        for (let i = 0; i < this.Models.length; i++) {
            TotalDucatCost += this.Models[i].GetTotalDucats();
        }
        return TotalDucatCost
    }

    public GetDucatRatingCost() {
        
        let TotalDucatCost = 0;
        for (let i = 0; i < this.Models.length; i++) {
            if ((this.Models[i].HeldObject as WarbandMember).State == "active") {
                TotalDucatCost += this.Models[i].GetTotalDucats();
            }
        }
        return TotalDucatCost
    }

    public GetDucatCostStash() {
        
        let TotalDucatCost = 0;
        for (let i = 0; i < this.Equipment.length; i++) {
            TotalDucatCost += this.Equipment[i].GetTotalDucats();
        }
        return TotalDucatCost
    }

    public GetGloryCost() {
        
        let TotalGloryCost = 0;
        for (let i = 0; i < this.Models.length; i++) {
            TotalGloryCost += this.Models[i].GetTotalGlory();
        }
        return TotalGloryCost
    }

    public GetGloryRatingCost() {
        
        let TotalGloryCost = 0;
        for (let i = 0; i < this.Models.length; i++) {
            if ((this.Models[i].HeldObject as WarbandMember).State == "active") {
                TotalGloryCost += this.Models[i].GetTotalGlory();
            }
        }
        return TotalGloryCost
    }

    public GetGloryCostStash() {
        
        let TotalGloryCost = 0;
        for (let i = 0; i < this.Equipment.length; i++) {
            TotalGloryCost += this.Equipment[i].GetTotalGlory();
        }
        return TotalGloryCost
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
        const result = await EventProc.runEvent(
            "getNumberOfElite",
            this,
            [],
            6,
            null
        )

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
        /**
         * @TODO LANE Get Errors Alerts Working
         */

        let CaptainFound = false
        for (let i = 0; i < this.Models.length; i++) {
            if ((this.Models[i].CustomInterface as IFactionModelRelationship).captain) {
                if ((this.Models[i].CustomInterface as IFactionModelRelationship).captain == true) {
                    CaptainFound = true;
                }
            }
        }

        if (CaptainFound == false) {
            AlertList.push("Your warband lacks a Leader")
        }

        return AlertList
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

                this.Notes[i].text == text_new;
                break;
            }
        }
        if (note == null) {
            note = {
                text: text_new,
                title: title
            }
            this.Notes.push(note);
        }

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
        for (let i = 0; i < this.Models.length; i++) {
            if ((this.Models[i].HeldObject as WarbandMember).CurModel.ID == id) {
                count ++;
            }
        }
        return count;
    }

    public GetCountOfRel(id : string) {
        let count = 0;
        for (let i = 0; i < this.Models.length; i++) {
            const inter = this.Models[i].CustomInterface
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
        for (let i = 0; i < this.Models.length; i++) {
            count += ((this.Models[i].HeldObject as WarbandMember).GetUpgradeCount(id))
        }
        return count;
    }

    public GetCountOfEquipmentRel(id : string) {
        let count = 0;
        for (let i = 0; i < this.Equipment.length; i++) {
            if (this.Equipment[i].CountCap == false || this.Equipment[i].CountLimit == false) {
                continue;
            }
            const inter = this.Equipment[i].CustomInterface
            if (inter) {
                if (inter.id == id) {
                    count ++;
                }
            }
        }
        for (let i = 0; i < this.Models.length; i++) {
            count += ((this.Models[i].HeldObject as WarbandMember).GetEquipmentCount(id))
        }
        return count;
    }

    public async GetCountOfKeyword(id : string) {
        let count = 0;
        for (let i = 0; i < this.Models.length; i++) {
            const istruth = await (this.Models[i].HeldObject as WarbandMember).IsKeywordPresent(id)
            if (istruth) {
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
        BaseRels = await eventmon.runEvent(
            "getAllFactionModelRelationships",
            this,
            [],
            BaseRels,
            null
        )

        for (let i = 0; i < BaseRels.length; i++) {
            const IsRestricted : boolean = await this.IsModelRestricted(BaseRels[i]);
            if (IsRestricted) { continue; }
            let maxcount = BaseRels[i].Maximum;
            maxcount = await eventmon.runEvent(
                "getModelLimitTrue",
                BaseRels[i],
                [],
                maxcount,
                this
            )
            if (this.GetCountOfRel(BaseRels[i].ID) < maxcount || ((BaseRels[i].Minimum == 0 && BaseRels[i].Maximum == 0))) {
                if (count_cost == true) {
                    let canaddupgrade = true;
                    let maxccurcostount = BaseRels[i].Cost;
                    maxccurcostount = await eventmon.runEvent(
                        "getCostOfModel",
                        BaseRels[i],
                        [],
                        maxccurcostount,
                        this
                    )

                    if (BaseRels[i].CostType == 0) {
                        canaddupgrade = (this).GetSumCurrentDucats() >= maxccurcostount;
                    }
                    if (BaseRels[i].CostType == 1) {
                        canaddupgrade = (this).GetSumCurrentGlory() >= maxccurcostount;
                    }

                    if (canaddupgrade) {
                        ListOfRels.push(BaseRels[i]);
                    }
                } else {
                    ListOfRels.push(BaseRels[i]);
                }
            }
        }

        return ListOfRels
    }

    public async IsModelRestricted(model : FactionModelRelationship) : Promise<boolean> {
        const eventmon : EventRunner = new EventRunner();
        const AvoidRestriction = await eventmon.runEvent(
            "avoidModelRestriction",
            this,
            [],
            false,
            model
        )

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

    public async GetFactionEquipmentOptions(use_exploration = false, count_cost = true) : Promise<FactionEquipmentRelationship[]> {
        const FacCheck = this.Faction.MyFaction;
        const ListOfRels : FactionEquipmentRelationship[] = []
        const AddedIDs : string[] = [];
        let BaseRels : FactionEquipmentRelationship[] = []
        let RefRels : FactionEquipmentRelationship[] = []
        
        if (FacCheck != undefined) {
            RefRels = ((FacCheck.SelfDynamicProperty).OptionChoice as Faction).EquipmentItems
        }

        for (let i = 0; i < RefRels.length; i++) {
            if (!containsTag(RefRels[i].Tags, "exploration_only") || use_exploration) {
                BaseRels.push(RefRels[i]);
            }
        }

        const eventmon : EventRunner = new EventRunner();
        BaseRels = await eventmon.runEvent(
            "getAllFactionEquipmentRelationships",
            this,
            [],
            BaseRels,
            null
        )

        for (let i = 0; i < BaseRels.length; i++) {
            let maxcount = BaseRels[i].Limit;
            maxcount = await eventmon.runEvent(
                "getEquipmentLimitTrue",
                BaseRels[i],
                [],
                maxcount,
                this
            )
            if (this.GetCountOfEquipmentRel(BaseRels[i].ID) < maxcount || (maxcount == 0 && BaseRels[i].Limit == 0)) {
                if (!containsTag(BaseRels[i].Tags, "exploration_only") || use_exploration) {

                    if (count_cost == true) {
                        let canaddupgrade = true;
                        let maxccurcostount = BaseRels[i].Cost;
                        maxccurcostount = await eventmon.runEvent(
                            "getCostOfEquipment",
                            BaseRels[i],
                            [],
                            maxccurcostount,
                            this
                        )

                        if (BaseRels[i].CostType == 0) {
                            canaddupgrade = (this).GetSumCurrentDucats() >= maxccurcostount;
                        }
                        if (BaseRels[i].CostType == 1) {
                            canaddupgrade = (this).GetSumCurrentGlory() >= maxccurcostount;
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

    public async GetModifiersList() {
        const PropertyList : WarbandProperty[] = [];

        for (let i = 0; i < this.Models.length; i++) {
            const Mods = await (this.Models[i].HeldObject as WarbandMember).GetWarbandSkills();
            for (let j = 0; j < Mods.length; j++) {
                PropertyList.push(Mods[i])
            }
        }

        for (let i = 0; i < this.Modifiers.length; i++) {
            PropertyList.push(this.Modifiers[i])    
        }

        return PropertyList;
    }

    public async GetFireteams() {
        const PropertyList : WarbandProperty[] = [];

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
}

export {IUserWarband, UserWarband}

