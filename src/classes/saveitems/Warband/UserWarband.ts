import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { containsTag, DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './High_Level/WarbandContextItem';
import { IWarbandExplorationSet, WarbandExplorationSet } from './CoreElements/WarbandExplorationSet';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { IWarbandFaction, WarbandFaction } from './CoreElements/WarbandFaction';
import { IWarbandPurchaseEquipment, IWarbandPurchaseModel, RealWarbandPurchaseEquipment, RealWarbandPurchaseModel, WarbandPurchase } from './Purchases/WarbandPurchase';
import { IWarbandMember, WarbandMember } from './Purchases/WarbandMember';
import { WarbandEquipment } from './Purchases/WarbandEquipment';
import { WarbandFactory } from '../../../factories/warband/WarbandFactory';
import { FactionModelRelationship } from '../../relationship/faction/FactionModelRelationship';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { Faction } from '../../feature/faction/Faction';
import { FactionEquipmentRelationship } from '../../relationship/faction/FactionEquipmentRelationship';
import { WarbandProperty } from './WarbandProperty';
import { ContextPackage } from '../../contextevent/contextpackage';
import { ToolsController } from '../../_high_level_controllers/ToolsController';
import { ModelFactory } from '../../../factories/features/ModelFactory';

interface WarbandDebt {
    ducats : number,
    glory : number
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
    debts : WarbandDebt
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
        this.Exploration = await WarbandFactory.CreateWarbandExplorationSet(data.exploration, this);
        this.Faction = await WarbandFactory.CreateWarbandFaction(data.faction, this);
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

    public ConvertToInterface() {
        const modelslist : IWarbandPurchaseModel[] = []
        for (let i = 0; i < this.Models.length; i++) {
            modelslist.push(this.Models[i].ConvertToInterfaceModel())
        }

        const equipmentlist : IWarbandPurchaseEquipment[] = []
        for (let i = 0; i < this.Equipment.length; i++) {
            equipmentlist.push(this.Equipment[i].ConvertToInterfaceEquipment())
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
            debts: this.Debts
        }
        
        return _objint;
    }

    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = []        

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
     * Returns the Name of the Base-Faction as string
     *
     * @TODO:
     */
    public GetFactionBaseName () {
        return 'The Iron Sultanate';
    }

    /**
     * Returns the Name of the Faction Variant as string
     *
     * @TODO:
     */
    public GetFactionVariantName () {
        return 'The Iron Sultanate';
    }

    /** 
     * Returns the Ducats Value of the Warband Cost as int (without stash)
     */
    public GetCostDucats() {
        return this.GetDucatCost()
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
        return this.GetGloryCost()
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
        return this.GetFighters().filter((item) => (!item.model.IsElite() && !item.model.IsMercenary())).length > 0;
    }

    /**
     *
     * Returns bool - Does the warband have Elites?
     */
    public HasElites () {
        return this.GetFighters().filter((item) => (item.model.IsElite())).length > 0;
    }

    /**
     *
     * Returns bool - Does the warband have mercenaries?
     */
    public HasMercenaries () {
        return this.GetFighters().filter((item) => (item.model.IsMercenary())).length > 0;
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


    /** @TODO
     * Gets the ranged weapon options for a fighter by its ID
     *
     * @param fighter_id
     */
    public GetRangedWeaponOptions ( fighter_id: string ) {

        // @TODO: get real options
        const options : any[] = [ ];


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
            const NewPurchase : WarbandPurchase = new WarbandPurchase({
                cost_value : fighter[i].Cost,
                cost_type : fighter[i].CostType,
                count_limit : true,
                count_cap : true,
                sell_item : true,
                sell_full : true,
                purchaseid: fighter[i].Model.ID,
                faction_rel_id: fighter[i].ID,
                custom_rel: fighter[i].SelfData
            }, this, Model);
            this.Models.push(NewPurchase);
        }
    }

    public async DuplicateFighter( fighter : RealWarbandPurchaseModel ) {

        const IsValidToAdd = await this.AtMaxOfModel(fighter.purchase.PurchaseInterface);

        if (IsValidToAdd) {
            return "Warband At Limit For " + fighter.model.CurModel.GetTrueName();
        }
        
        const milliseconds = Date.now();
        const NewMember : WarbandMember = await WarbandFactory.CreateWarbandMember((fighter.model.ConvertToInterface()), this);
        NewMember.Name = fighter.model.Name
        NewMember.ID =  NewMember.CurModel.ID + "_" + this.Models.length + "_" + milliseconds.toString()
        const NewPurchase : WarbandPurchase = new WarbandPurchase(fighter.purchase.ConvertToInterface(), this, NewMember);
        this.Models.push(NewPurchase);

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
                this.Models.splice(i, 1);
                break;
            }
        }
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
            custom_rel: stash.SelfData
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

    /** @TODO
     * Adds an exploration location to a Roster
     *
     * @param location
     * @param option
     * @constructor
     */
    public  AddExplorationLocation ( location: object, option: object) {

        return false;

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
        return 12;
    }

    /**
     * @TODO: Return the Campaign Cycle of the connected campaign
     - can use Campaign Info
     - This is the campaign cycle that is currently selected for the WBB view
     */
    GetCampaignCycleView() {
        return 2;
    }

    /**
     * @TODO: return the maximum campaign cycle, that is possible for this Warband
     * - This returns the maximum campaign cycle this warband has advanced to
     * - simultaneously this is the only cycle, which can be edited
     * @constructor
     */
    GetCampaignCycleMax() {
        return 3;
    }

    /**
     * Returns the Threshold value for the currently viewed campaign cycle
     * @constructor
     */
    GetCampaignTresholdValue () {
        const thresholds = [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800]; // thresholds per cycle

        return thresholds[this.GetCampaignCycleView() - 1] ?? thresholds[thresholds.length - 1];
    }

    GetCampaignMaxFieldStrength () {
        const maxFieldStrengths = [10,11,12,13,14,15,16,17,18,19,20,21,22]; // Max field strength per cycle

        return maxFieldStrengths[this.GetCampaignCycleView() - 1] ?? maxFieldStrengths[maxFieldStrengths.length - 1];
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
     * Does this warband have validation errors
     *
     * @return: boolean
     */
    HasValidationErrors () {
        if( this.GetValidationErrors.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns an array of validation error strings
     *
     * @return: array
     */
    GetValidationErrors () {

        return [
            'You need 1 fighter to be the leader of this warband',
            'You exceeded the limit of the equipment "Wind Amulet"'
        ]
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

    public async GetFighterOptions() : Promise<FactionModelRelationship[]> {
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
            let maxcount = BaseRels[i].Maximum;
            maxcount = await eventmon.runEvent(
                "getModelLimitTrue",
                BaseRels[i],
                [],
                maxcount,
                this
            )
            if (this.GetCountOfRel(BaseRels[i].ID) < maxcount || ((BaseRels[i].Minimum == 0 && BaseRels[i].Maximum == 0))) {
                ListOfRels.push(BaseRels[i]);
            }
        }

        return ListOfRels
    }

    public async GetFactionEquipmentOptions() : Promise<FactionEquipmentRelationship[]> {
        const FacCheck = this.Faction.MyFaction;
        const ListOfRels : FactionEquipmentRelationship[] = []
        const AddedIDs : string[] = [];
        let BaseRels : FactionEquipmentRelationship[] = []
        let RefRels : FactionEquipmentRelationship[] = []
        
        if (FacCheck != undefined) {
            RefRels = ((FacCheck.SelfDynamicProperty).OptionChoice as Faction).EquipmentItems
        }

        for (let i = 0; i < RefRels.length; i++) {
            if (!containsTag(RefRels[i].Tags, "exploration_only")) {
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
                if (!containsTag(BaseRels[i].Tags, "exploration_only")) {
                    AddedIDs.push(BaseRels[i].ID)
                    ListOfRels.push(BaseRels[i]);
                }
            }
        }

        return ListOfRels
    }

    public GetModifiersList() {
        const PropertyList : WarbandProperty[] = [];
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

