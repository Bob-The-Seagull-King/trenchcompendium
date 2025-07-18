import { Skill } from "../../../feature/ability/Skill";
import { ContextObject, IContextObject } from "../../../contextevent/contextobject";
import { DynamicOptionContextObject } from "../../../options/DynamicOptionContextObject";
import { IWarbandProperty, WarbandProperty } from "../WarbandProperty";
import { DynamicContextObject} from "../../../contextevent/dynamiccontextobject";
import { SkillFactory } from "../../../../factories/features/SkillFactory";
import { ExplorationFactory } from "../../../../factories/features/ExplorationFactory";
import { ContextPackage } from "../../../contextevent/contextpackage";
import { FactionFactory } from "../../../../factories/features/FactionFactory";
import { Patron } from "../../../feature/skillgroup/Patron";
import { Faction } from "../../../feature/faction/Faction";
import { IWarbandPurchaseEquipment, IWarbandPurchaseUpgrade, RealWarbandPurchaseEquipment, RealWarbandPurchaseUpgrade, WarbandPurchase } from "./WarbandPurchase";
import { INote } from "../../../Note";
import { Model } from "../../../feature/model/Model";
import { ModelFactory } from "../../../../factories/features/ModelFactory";
import { WarbandEquipment } from "./WarbandEquipment";
import { UpgradeFactory } from "../../../../factories/features/UpgradeFactory";
import { InjuryFactory } from "../../../../factories/features/InjuryFactory";
import { Upgrade } from "../../../feature/ability/Upgrade";
import { Equipment, EquipmentRestriction, RestrictionSingle } from "../../../feature/equipment/Equipment";
import { Keyword } from "../../../feature/glossary/Keyword";
import { Ability } from "../../../feature/ability/Ability";
import { EventRunner } from "../../../contextevent/contexteventhandler";
import { ModelUpgradeRelationship } from "../../../relationship/model/ModelUpgradeRelationship";
import { UpgradesGrouped } from "../../../relationship/model/ModelUpgradeRelationship";
import { UserWarband } from "../UserWarband";
import { WarbandFactory } from "../../../../factories/warband/WarbandFactory";
import { FactionEquipmentRelationship, IFactionEquipmentRelationship } from "../../../relationship/faction/FactionEquipmentRelationship";
import { EquipmentFactory } from "../../../../factories/features/EquipmentFactory";
import { ModelEquipmentRelationship } from "../../../relationship/model/ModelEquipmentRelationship";
import { containsTag } from "../../../../utility/functions";
import { Injury } from "../../../feature/ability/Injury";
import { SkillGroup } from "../../../feature/skillgroup/SkillGroup";
import { StaticContextObject } from "../../../contextevent/staticcontextobject";
import { GetStatAsFullString, MergeTwoStats, ModelStatistics } from "../../../feature/model/ModelStats";
import { KeywordFactory } from "../../../../factories/features/KeywordFactory";

export interface SkillSuite {
    skillgroup : StaticContextObject,
    list : Skill[]
}

export interface MemberAndWarband {
    warband: UserWarband,
    model: WarbandMember
}

export interface MemberAndItem {
    item: FactionEquipmentRelationship,
    model: WarbandMember
}

export interface ModelHands {
    ranged: number,
    melee : number,
    special : number
}

export interface MemberUpgradePresentation {
    upgrade : ModelUpgradeRelationship,
    purchase : WarbandPurchase | null,
    allowed : boolean,
    cur_count : number,
    max_count : number
}
export type MemberUpgradesGrouped = {[type : string]: 
    {
        upgrades: MemberUpgradePresentation[]
        limit : number
    }
};

interface IWarbandMember extends IContextObject {
    model: string,
    subproperties : IWarbandProperty[],
    notes : INote[]
    active : 'active' | 'reserved' | 'lost' | 'dead',
    equipment : IWarbandPurchaseEquipment[],
    list_upgrades : IWarbandPurchaseUpgrade[],
    list_injury : IWarbandProperty[],
    list_skills : IWarbandProperty[],
    list_modelequipment : IWarbandProperty[],
    experience : number,
    elite : boolean,
    recruited: boolean,
    scar_reserves: number,
    stat_selections : ModelStatistics[]
}

class WarbandMember extends DynamicContextObject {

    public readonly boldXpIndices = [2, 4, 7, 10, 14, 18];

    Notes : INote[];
    State :  'active' | 'reserved' | 'lost' | 'dead';
    CurModel! : Model;
    SubProperties : WarbandProperty[] = [];
    Equipment : WarbandPurchase[] = [];
    Upgrades : WarbandPurchase[] = [];
    Skills : WarbandProperty[] = [];
    Injuries : WarbandProperty[] = [];
    Experience : number;
    Elite : boolean;
    Recruited : boolean;
    ModelEquipments : WarbandProperty[] = [];
    ScarReserve : number;
    Stat_Selections : ModelStatistics[] = [];
    IsUnRestricted : boolean;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandMember, parent : DynamicContextObject | null, restricted : boolean)
    {
        super(data, parent)
        this.Notes = data.notes;
        if (data.active) {
            this.State = data.active;
        } else {
            this.State = 'active'
        }
        if (data.scar_reserves) {
            this.ScarReserve = data.scar_reserves;
        } else {
            this.ScarReserve = 0;
        }
        if (data.stat_selections) {
            for (let i = 0; i < data.stat_selections.length; i++) {
                this.Stat_Selections.push(data.stat_selections[i]);
            }
        }
        this.Experience = data.experience;
        this.Elite = data.elite;
        this.Recruited = data.recruited;
        this.IsUnRestricted = restricted;
    }
    

    public async BuildModelEquipProperties(data : IWarbandMember = this.SelfData) {
        const all_eq : ModelEquipmentRelationship[] = this.CurModel.EquipmentList;
        this.ModelEquipments = [];
        for (let i = 0; i < all_eq.length; i++) {
            let IsFound = false
            for (let j = 0; j < data.subproperties.length; j++) {
                if (data.subproperties[j].object_id == all_eq[i].ID) {
                    const NewEquip = await EquipmentFactory.CreateNewModelEquipment(data.subproperties[j].object_id, this)
                    const NewRuleProperty = new WarbandProperty(NewEquip, this, null, data.subproperties[j]);
                    await NewRuleProperty.HandleDynamicProps(NewEquip, this, null, data.subproperties[j]);
                    await NewRuleProperty.BuildConsumables(data.subproperties[j].consumables);
                    this.ModelEquipments.push(NewRuleProperty);
                    IsFound = true;
                    break;
                }
            }
            if (IsFound == false) {
                const NewRuleProperty = new WarbandProperty(all_eq[i], this, null, null);
                await NewRuleProperty.HandleDynamicProps(all_eq[i], this, null, null);
                await NewRuleProperty.BuildConsumables([]);
                this.ModelEquipments.push(NewRuleProperty);
            }
        }

        return this.ModelEquipments;
    }

    public async BuildNewProperties(data : IWarbandMember = this.SelfData) {
        const all_abils : Ability[] = await this.getContextuallyAvailableAbilities();
        this.SubProperties = [];
        for (let i = 0; i < all_abils.length; i++) {
            let IsFound = false
            for (let j = 0; j < data.subproperties.length; j++) {
                if (data.subproperties[j].object_id == all_abils[i].ID) {
                    const NewRuleProperty = new WarbandProperty(all_abils[i], this, null, data.subproperties[j]);
                    await NewRuleProperty.HandleDynamicProps(all_abils[i], this, null, data.subproperties[j]);
                    await NewRuleProperty.BuildConsumables(data.subproperties[j].consumables);
                    this.SubProperties.push(NewRuleProperty);
                    IsFound = true;
                    break;
                }
            }
            if (IsFound == false) {
                const NewRuleProperty = new WarbandProperty(all_abils[i], this, null, null);
                await NewRuleProperty.HandleDynamicProps(all_abils[i], this, null, null);
                await NewRuleProperty.BuildConsumables([]);
                this.SubProperties.push(NewRuleProperty);
            }
        }

        return this.SubProperties;
    }
    

    public async BuildUpgrades(data : IWarbandMember = this.SelfData) {
        this.Upgrades = [];
        for (let i = 0; i < data.list_upgrades.length; i++) {
            const curUpgrade = data.list_upgrades[i]
            const upgradeobj = await UpgradeFactory.CreateNewUpgrade(curUpgrade.upgrade.object_id, this)
            const NewRuleProperty = new WarbandProperty(upgradeobj, this, null, curUpgrade.upgrade);
            await NewRuleProperty.HandleDynamicProps(upgradeobj, this, null, curUpgrade.upgrade);
            await NewRuleProperty.BuildConsumables(curUpgrade.upgrade.consumables);
            
            const NewPurchase : WarbandPurchase = new WarbandPurchase(curUpgrade.purchase, this, NewRuleProperty);
            this.Upgrades.push(NewPurchase);
        }

        return this.Upgrades;
    }

    
    public async getContextuallyAvailableAbilities() : Promise<Ability[]> {
        const AbilitiesAvailable : Ability[] = []
        const BaseList : Ability[] = []
        const IDList : string[] = [];
        
        for (let i = 0; i < this.CurModel.Abilities.length; i++) {
            BaseList.push(this.CurModel.Abilities[i]);
        }

        if (this.IsMercenary() != true && this.MyContext != null) {
            const Events : EventRunner = new EventRunner();
            const result = await Events.runEvent(
                "getWarbandMemberAbilities",
                this.MyContext,
                [],
                BaseList,
                this
            )
            const result_fin = await Events.runEvent(
                "getWarbandMemberAbilities",
                this,
                [],
                result,
                this
            )
            for (let i = 0; i < result_fin.length; i++) {
                if (!IDList.includes(result_fin[i].ID)) {
                    IDList.push(result_fin[i].ID)
                    AbilitiesAvailable.push(result_fin[i]);
                }
            }
        } else {
            for (let i = 0; i < BaseList.length; i++) {
                if (!IDList.includes(BaseList[i].ID)) {
                    IDList.push(BaseList[i].ID)
                    AbilitiesAvailable.push(BaseList[i]);
                }
            }
        }

        return AbilitiesAvailable;
    }

    public async BuildEquipment(data : IWarbandPurchaseEquipment[]) {
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandEquipment = await WarbandFactory.CreateWarbandEquipment(data[i].equipment, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Equipment.push(NewPurchase);
        }

    }

    public async BuildModelEquipment(regenerate : boolean) {
        for (let i = 0; i < this.ModelEquipments.length; i++) {
            
            if ((regenerate == true) || ((this.ModelEquipments[i].SelfDynamicProperty.OptionChoice as ModelEquipmentRelationship).Removable == false)) {
                const MERelationship = (this.ModelEquipments[i].SelfDynamicProperty.OptionChoice as ModelEquipmentRelationship)

                const ListOfIDs : string[] = []
                for (let j = 0; j < this.Equipment.length; j++) {
                    ListOfIDs.push(this.Equipment[j].HeldObject.ID)
                }
                for (let j = 0; j < MERelationship.EquipmentItems.length; j++) {
                    let IsFound = false
                    for (let k = 0; k < ListOfIDs.length; k++) {
                        if (ListOfIDs[k] == MERelationship.ID + "_" + MERelationship.EquipmentItems[j].ID + "_" + j) {
                            IsFound = true;
                            break;
                        }
                    }
                    
                    if (IsFound == false) {
                        const Model : WarbandEquipment = await WarbandFactory.BuildModelEquipmentFromPurchase(MERelationship, MERelationship.EquipmentItems[j], j, this);
                        const NewPurchase : WarbandPurchase = new WarbandPurchase({
                            cost_value : MERelationship.SaleValue,
                            cost_type : MERelationship.SaleType,
                            count_limit : false,
                            count_cap : false,
                            sell_item : MERelationship.Removable,
                            sell_full : true,
                            purchaseid: MERelationship.ID,
                            faction_rel_id: MERelationship.ID,
                            custom_rel: MERelationship.SelfData,
                            modelpurch: true
                        }, this, Model);
                        this.Equipment.push(NewPurchase);
                    }
                }
                    
            }
        }
        return this.Equipment;
    }

    public async BuildSkills(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = await SkillFactory.CreateNewSkill(CurVal.object_id, this, true);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this, null, CurVal)
            await NewLocation.BuildConsumables(CurVal.consumables)
            this.Skills.push(NewLocation);
        }
    }

    public async BuildInjuries(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = await InjuryFactory.CreateNewInjury(CurVal.object_id, this);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this, null, CurVal);
            await NewLocation.BuildConsumables(CurVal.consumables)
            this.Injuries.push(NewLocation);
        }
    }

    public async BuildModel(data : string) {
        const Value = await ModelFactory.CreateNewModel(data, this);
        this.CurModel = (Value);
    }

    public ConvertToInterface() {
        const injuryset : IWarbandProperty[] = [];
        for (let i = 0; i < this.Injuries.length; i++) {
            injuryset.push(this.Injuries[i].ConvertToInterface())
        }
        const skillset : IWarbandProperty[] = [];
        for (let i = 0; i < this.Skills.length; i++) {
            skillset.push(this.Skills[i].ConvertToInterface())
        }
        
        const subpropset : IWarbandProperty[] = [];
        for (let i = 0; i < this.SubProperties.length; i++) {
            subpropset.push(this.SubProperties[i].ConvertToInterface())
        }

        const modelpropset : IWarbandProperty[] = [];
        for (let i = 0; i < this.ModelEquipments.length; i++) {
            subpropset.push(this.ModelEquipments[i].ConvertToInterface())
        }
        
        const equipmentlist : IWarbandPurchaseEquipment[] = []
        for (let i = 0; i < this.Equipment.length; i++) {
            equipmentlist.push(this.Equipment[i].ConvertToInterfaceEquipment())
        }

        const upgradelist : IWarbandPurchaseUpgrade[] = []
        for (let i = 0; i < this.Upgrades.length; i++) {
            upgradelist.push(this.Upgrades[i].ConvertToInterfaceUpgrade())
        }

        let modelstring = ""
        if (this.CurModel != null) {
            modelstring = this.CurModel.ID;
        }

        const _objint : IWarbandMember = {
            contextdata : this.ContextKeys,            
            id: this.ID,
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags,
            model: modelstring,
            subproperties : subpropset,
            notes : this.Notes,
            active : this.State,
            equipment : equipmentlist,
            list_upgrades : upgradelist,
            list_injury : injuryset,
            list_skills : skillset,
            experience : this.Experience,
            list_modelequipment: modelpropset,
            elite : this.Elite,
            recruited : this.Recruited,
            scar_reserves : this.ScarReserve,
            stat_selections : this.Stat_Selections
        }

        this.SelfData = _objint;
        
        return _objint;
    }

    public async HasEquipmentFollowingRestriction(rest : RestrictionSingle) : Promise<boolean> {
        for (let i = 0; i < this.Equipment.length; i++) {
            const equip = this.Equipment[i].HeldObject as WarbandEquipment;
            const equipitem = equip.GetEquipmentItem()

            if (rest.category) {
                if (equipitem.Category != rest.category) {
                    continue;
                }
            }

            if (rest.tag) {
                if (!containsTag(equipitem.Tags, rest.tag) && !containsTag(equip.Tags, rest.tag)) {
                    continue;
                }
            }

            if (rest.res_type == "keyword") {
                let Found = false;
                const keywordlist = await equip.GetKeywords()
                for (let k = 0; k < keywordlist.length; k++) {
                    if (keywordlist[k].ID == rest.value) {
                        Found = true;
                    }
                }
                if (Found == true) {
                    return true;
                }
            }                        

            if (rest.res_type == "ducat") {
                if (this.Equipment[i].CostType == 0) {
                    if (rest.param == "maximum" ) {
                        if (this.Equipment[i].ItemCost > Number(rest.value)) {
                            return true;
                        }
                    } else {
                        if (this.Equipment[i].ItemCost < Number(rest.value)) {
                            return true;
                        }
                    }
                }
            }  

            if (rest.res_type == "all") {
                return true;
            }

            if (rest.res_type == "id") {
                if (equipitem.ID == rest.value) {
                    return true;
                }
            }   
        }
        return false;
    }
    
    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = []   
        
        if (this.CurModel) {
            const static_packages : ContextPackage[] = await this.CurModel.GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandMember")
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.Skills.length; i++) {
            const static_packages : ContextPackage[] = await this.Skills[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandMember")
                subpackages.push(static_packages[j])
            }
        }  

        for (let i = 0; i < this.Upgrades.length; i++) {
            const static_packages : ContextPackage[] = await (this.Upgrades[i].HeldObject as Upgrade).GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandMember")
                subpackages.push(static_packages[j])
            }
        } 

        for (let i = 0; i < this.Injuries.length; i++) {
            const static_packages : ContextPackage[] = await this.Injuries[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandMember")
                subpackages.push(static_packages[j])
            }
        }  

        for (let i = 0; i < this.Equipment.length; i++) {
            const static_packages : ContextPackage[] = await (this.Equipment[i].HeldObject as Equipment).GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandMember")
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.SubProperties.length; i++) {
            const static_packages : ContextPackage[] = await this.SubProperties[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandMember")
                subpackages.push(static_packages[j])
            }
        }

        return subpackages; 
    }
    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabWarbandubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = []   
        
        const newSkills = await this.GetWarbandSkills()
        for (let i = 0; i < newSkills.length; i++) {
            const static_packages : ContextPackage[] = await newSkills[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandMember")
                subpackages.push(static_packages[j])
            }
        } 

        const newEquipment = await this.GetWarbandEquipment()
        for (let i = 0; i < newEquipment.length; i++) {
            const static_packages : ContextPackage[] = await (newEquipment[i].HeldObject as Equipment).GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandMember")
                subpackages.push(static_packages[j])
            }
        }

        return subpackages; 
    }

    public IsMercenary(): boolean {
        if (this.CurModel.Stats.mercenary) {
            return this.CurModel.Stats.mercenary
        }
        if (containsTag(this.Tags, "mercenary")) {
            return true;
        }
        return false;
    }

    /**
     * Is this fighter Elite?
     *
     * @constructor
     * @return: boolean
     */
    public IsElite(): boolean {
        return this.Elite;
    }

    /**
     * Does this fighter have limited potential?
     * @TODO: Hook up data
     * @return: boolean
     */
    public HasLimitedPotential () {
        return true;
    }

    public GetEquipment() {
        
        const options : RealWarbandPurchaseEquipment[] = [ ];

        for (let i = 0; i < this.Equipment.length; i++) {
            options.push(
                {
                    purchase: this.Equipment[i],
                    equipment: this.Equipment[i].HeldObject as WarbandEquipment
                }
            )
        }

        return options;
    }

    public GetEquipmentAsString() {
        const CurEquip : RealWarbandPurchaseEquipment[] = this.GetEquipment();
        const returnVal : string[] = [];

        for (let i = 0; i < CurEquip.length; i++) {
            returnVal.push(CurEquip[i].equipment.MyEquipment.SelfDynamicProperty.GetTrueName())
        }

        return returnVal.join(', ');
    }

    public async GetKeywordsFull() {
        return await this.getContextuallyAvailableKeywords();
    }

    public async IsKeywordPresent(id : string) {
        const keys = await this.GetKeywordsFull();
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].ID == id) {
                return true;
            }
        }
        return false;
    }

    public GetSubCosts(type : number, overridecap = false) {
        let countvar = 0;
        for (let i = 0; i < this.Upgrades.length; i++) {
            if (this.Upgrades[i].CountCap == false && (overridecap == false)) {continue;}
            if (this.Upgrades[i].CostType == type) {
                if (type == 0 ) {
                    countvar += this.Upgrades[i].GetTotalDucats();
                }
                if (type == 1 ) {
                    countvar += this.Upgrades[i].GetTotalGlory();
                }
            }
        }
        for (let i = 0; i < this.Equipment.length; i++) {
            if (this.Equipment[i].CountCap == false) {continue;}
            if (this.Equipment[i].CostType == type) {
                if (type == 0 ) {
                    countvar += this.Equipment[i].GetTotalDucats();
                }
                if (type == 1 ) {
                    countvar += this.Equipment[i].GetTotalGlory();
                }
            }
        }
        return countvar;
    }

    public GetEquipmentCount(id : string) {
        let count = 0;
        for (let i = 0; i < this.Equipment.length; i++) {
            const inter = this.Equipment[i].CustomInterface
            if (inter) {
                if (inter.id == id) {
                    count ++;
                }
            }
        }
        return count;
    }

    public GetUpgradeCount(id : string) {
        let count = 0;
        for (let i = 0; i < this.Upgrades.length; i++) {
            const inter = this.Upgrades[i].CustomInterface
            if (inter) {
                if (inter.id == id) {
                    count ++;
                }
            }
        }
        return count;
    }

    public async GetWarbandSkills() {
        const SkillList : WarbandProperty[] = [];
        const Events : EventRunner = new EventRunner();

        for (let i = 0; i < this.Skills.length; i++) {
            const ShowWarband = await Events.runEvent(
                "showSkillOnWarband",
                this.Skills[i],
                [],
                false,
                this
            )

            if (ShowWarband) {
                SkillList.push(this.Skills[i])
            }
        }
        return SkillList;
    }

    public async GetWarbandEquipment() {
        const SkillList : WarbandPurchase[] = [];
        const Events : EventRunner = new EventRunner();

        for (let i = 0; i < this.Equipment.length; i++) {
            const ShowWarband = await Events.runEvent(
                "showEquipmentOnWarband",
                this.Equipment[i].HeldObject as WarbandEquipment,
                [],
                false,
                this
            )

            if (ShowWarband) {
                SkillList.push(this.Equipment[i])
            }
        }
        return SkillList;
    }

    /**
     * Get the name of the Fighter
     * - i.e. "Steve the fearless"
     * @return: string
     */
    GetFighterName () {
        return this.Name;
    }

    /**
     * Get the name of the Model
     * - i.e. "Desecrated Saint"
     *
     * @return: string
     */
    GetModelName () {
        return this.CurModel.Name;
    }

    /**
     * The base ducats cost of the fighter on recruitment
     *
     * @return: int
     */
    GetBaseCostDucats () {
        return 50;
    }

    /**
     * The base glory cost of the fighter on recruitment
     *
     * @return: int
     */
    GetBaseCostGlory () {
        return 0;
    }

    /**
     * Return the model slug / id
     * - is used to grab images for model
     *
     * @return: string
     */
    GetModelSlug () {

        if (this.CurModel != null) {
            return this.CurModel.ID;
        }

        return '';

    }

    /**
     * The Experience points of the fighter
     *
     * @return: int
     */
    GetExperiencePoints () {
        return this.Experience;
    }

    public GetInjuriesList() {
        return this.Injuries;
    }

    public GetSkillsList() {
        return this.Skills;
    }

    /**
     * The Number of battle scars of this fighter
     *
     * @return: int
     */
    GetBattleScars () {
        return this.Injuries.length + this.ScarReserve;
    }

    public async SetScars(scar_num : number) {
        const baseNum = this.Injuries.length;
        this.ScarReserve = scar_num - baseNum;

        await this.CheckIfDead();
    }

    public RenameSelf(name : string) {
        if (this.ApproveNewName(name)) {
            this.Name = name;
        }
    }

    /**
     * @TODO this is for stuff like making sure a name isn't a slur
     * if we decide to filter that stuff.
     */
    private ApproveNewName(name : string) {
        return true;
    }

    

    private SplitUpgrades(UpgradeListFull : ModelUpgradeRelationship[]) : UpgradesGrouped {

        const groups : UpgradesGrouped = {}

        for (let i = 0; i < UpgradeListFull.length; i++) {
            const special_cat = UpgradeListFull[i].GetSpecialCategory()
            if (groups[special_cat]) {
                groups[special_cat].push(UpgradeListFull[i])
            } else {
                groups[special_cat] = [UpgradeListFull[i]]
            }
        }
        return groups;
    }

    public async getContextuallyAvailableUpgrades() : Promise<UpgradesGrouped> {
        const UpgradesAvailable : ModelUpgradeRelationship[] = []
        let BaseList : ModelUpgradeRelationship[] = []
        const IDList : string[] = [];

        for (let i = 0; i < this.CurModel.UpgradeList.length; i++) {
            BaseList.push(this.CurModel.UpgradeList[i]);
        }

        const Events : EventRunner = new EventRunner();
        if (this.IsMercenary() != true && this.MyContext != null) {
            BaseList = await Events.runEvent(
                "getWarbandMemberUpgrades",
                this.MyContext,
                [],
                BaseList,
                this
            )
            BaseList = await Events.runEvent(
                "getWarbandMemberUpgrades",
                this,
                [],
                BaseList,
                this
            )
        }

        for (let i = 0; i < BaseList.length; i++) {
            if (!IDList.includes(BaseList[i].GetID())) {
                IDList.push(BaseList[i].GetID())
                UpgradesAvailable.push(BaseList[i]);
            }
        }

        return this.SplitUpgrades(UpgradesAvailable);
    }

    public async GetWarbandUpgradeCollections() : Promise<MemberUpgradesGrouped> {
        const Groups : UpgradesGrouped = await this.getContextuallyAvailableUpgrades();
        const completegroups : MemberUpgradesGrouped = {}
        const Events : EventRunner = new EventRunner();

        for (let i = 0; i < Object.keys(Groups).length; i++) {
            const special_cat = Object.keys(Groups)[i]
            let limit_of_category = 0;

            if (this.MyContext) {
                limit_of_category = await Events.runEvent(
                        "getUpgradeCategoryLimit",
                        (this.MyContext),
                        [],
                        limit_of_category,
                        special_cat
                    )
            }
            limit_of_category = await Events.runEvent(
                    "getUpgradeCategoryLimit",
                    (this),
                    [],
                    limit_of_category,
                    special_cat
                )

            for (let j = 0; j < Groups[special_cat].length; j++) {

                const Presentation : MemberUpgradePresentation = await this.CalcGivenPurchase(Groups[special_cat][j], special_cat, limit_of_category);
                if (completegroups[special_cat]) {
                    completegroups[special_cat].upgrades.push(Presentation)
                } else {
                    completegroups[special_cat] = 
                        {
                            limit: limit_of_category,
                            upgrades: [Presentation]
                    }
                }
            }
        }
        return completegroups;

    }

    public async GetExplorationSkills() {
        const Events : EventRunner = new EventRunner();
        const SkillList : WarbandProperty[] = await Events.runEvent(
                        "getExplorationSkills",
                        (this),
                        [],
                        [],
                        null
                    )
        for (let i = 0; i < this.Skills.length; i++) {
            if ((this.Skills[i].SelfDynamicProperty.OptionChoice as Skill).SkillGroups.includes("sg_exploration")) {
                SkillList.push(this.Skills[i])
            }
        }
        return SkillList;
    }

    public async CalcGivenPurchase(upg : ModelUpgradeRelationship, category : string, limit : number | null = null): Promise<MemberUpgradePresentation> {

        const Events : EventRunner = new EventRunner();

        let limit_of_category = 0;
        if (limit == null) {
            if (this.MyContext) {
                limit_of_category = await Events.runEvent(
                        "getUpgradeCategoryLimit",
                        (this.MyContext),
                        [],
                        limit_of_category,
                        category
                    )
            }
            limit_of_category = await Events.runEvent(
                    "getUpgradeCategoryLimit",
                    (this),
                    [],
                    limit_of_category,
                    category
                )
        } else {
            limit_of_category = limit;
        }

        

        let foundpurchase : WarbandPurchase | null = null;
        for (let k = 0; k < this.Upgrades.length; k++) {
            if ((this.Upgrades[k].HeldObject as Upgrade).ID == upg.UpgradeObject.ID) {
                foundpurchase = this.Upgrades[k];
            }
        }

        let maxcount = upg.WarbandLimit;
        maxcount = await Events.runEvent(
            "getUpgradeLimitTrue",
            upg,
            [],
            maxcount,
            {
                warband: this.MyContext,
                model: this
            }
        )
        if (this.IsUnRestricted == true) {
            return {
            upgrade : upg,
            purchase : foundpurchase,
            allowed : true,
            cur_count: (this.MyContext as UserWarband).GetCountOfUpgradeRel(upg.ID),
            max_count: maxcount
        }
        }
        let canaddupgrade = (await this.GetCountOfUpgradeCategory(category) < limit_of_category || category == "upgrades")

        if (canaddupgrade) {
            let maxccurcostount = upg.Cost;
            maxccurcostount = await Events.runEvent(
                "getCostOfUpgrade",
                upg,
                [],
                maxccurcostount,
                {
                    warband: this.MyContext,
                    model: this
                }
            )

            if (upg.CostType == 0) {
                canaddupgrade = (this.MyContext as UserWarband).GetSumCurrentDucats() >= maxccurcostount;
            }
            if (upg.CostType == 1) {
                canaddupgrade = (this.MyContext as UserWarband).GetSumCurrentGlory() >= maxccurcostount;
            }
        }
        if (canaddupgrade) {
            const careAboutRequired = await Events.runEvent(
                "getRequiredUpgradesBool",
                upg,
                [],
                true,
                {
                    warband: this.MyContext,
                    model: this
                }
            )
            if (careAboutRequired) {
                for (let i = 0; i < upg.RequiredUpgrades.length; i++) {
                    if (this.HasUpgrade(upg.RequiredUpgrades[i]) == false) {
                        canaddupgrade = false;
                    }
                }
            }
        }

        if (canaddupgrade) {
            const careAboutRestricted = await Events.runEvent(
                "getRestrictedUpgradesBool",
                upg,
                [],
                true,
                {
                    warband: this.MyContext,
                    model: this
                }
            )
            if (careAboutRestricted) {
                for (let i = 0; i < upg.Retrictions.length; i++) {
                    if (this.HasUpgrade(upg.Retrictions[i]) == true) {
                        canaddupgrade = false;
                    }
                }
            }
        }

        if (canaddupgrade) {
                canaddupgrade = ((this.MyContext as UserWarband).GetCountOfUpgradeRel(upg.ID) < maxcount || ((upg.WarbandLimit == 0)))
        }
        if (canaddupgrade) {
            canaddupgrade = await Events.runEvent(
                "canModelGetUpgrade",
                upg,
                [],
                canaddupgrade,
                {
                    warband: this.MyContext,
                    model: this
                }
            )
        }
        return {
            upgrade : upg,
            purchase : foundpurchase,
            allowed : canaddupgrade,
            cur_count: (this.MyContext as UserWarband).GetCountOfUpgradeRel(upg.ID),
            max_count: maxcount
        }
    }

    public async GetCountOfUpgradeCategory(cat : string): Promise<number> {
        let catcount = 0;

        for (let i = 0; i < this.Upgrades.length; i++) {
            const upgrade_raw = (this.Upgrades[i].HeldObject);
            if (upgrade_raw != undefined) {
                const upgrade = (upgrade_raw as any as WarbandProperty).SelfDynamicProperty.OptionChoice as Upgrade;
                if (upgrade.GetSpecialCategory() == cat) {
                    catcount += 1;
                }
            }
        }
        return catcount;
    }

    public HasUpgrade(id : string) {
        
        for (let i = 0; i < this.Upgrades.length; i++) {
            const upgrade_raw = (this.Upgrades[i].HeldObject);
            if (upgrade_raw != undefined) {
                const upgrade = (upgrade_raw as any as WarbandProperty).SelfDynamicProperty.OptionChoice as Upgrade;
                if (upgrade.GetID() == id) {
                    return true;
                }
            }
        }
        return false;
    }

    public async getContextuallyAvailableKeywords() : Promise<Keyword[]> {
        const KeywordsAvailable : Keyword[] = []
        const BaseList : string[] = []

        for (let i = 0; i < this.CurModel.KeyWord.length; i++) {
            BaseList.push(this.CurModel.KeyWord[i].ID);
        }

        if (!BaseList.includes("kw_elite") && this.IsElite()) {
            BaseList.push("kw_elite")
        }

        const Events : EventRunner = new EventRunner();
        if (this.MyContext != null) {
            const result = await Events.runEvent(
                "getContextuallyRelevantKeywordsByID",
                this.MyContext,
                [],
                BaseList,
                this
            )
            const result_fin = await Events.runEvent(
                "getContextuallyRelevantKeywordsByID",
                this,
                [],
                result,
                this
            )
            for (let i = 0; i < result_fin.length; i++) {
                const Keyword = await KeywordFactory.CreateNewKeyword(result_fin[i], null)
                KeywordsAvailable.push(Keyword);
            }
        }

        return (KeywordsAvailable);
    }

    public async GetKeywordID(){
        const KeywordsAvailable = await this.getContextuallyAvailableKeywords();
        const BaseList : string[] = []

        for (let i = 0; i < KeywordsAvailable.length; i++) {
            BaseList.push(KeywordsAvailable[i].GetID())
        }

        return BaseList;
    }
    
    public async AddUpgrade ( stash: ModelUpgradeRelationship ) {
        const CurUpgrade : Upgrade  = await stash.UpgradeObject;
        
        const NewRuleProperty = new WarbandProperty(CurUpgrade, this, null, null);
        await NewRuleProperty.HandleDynamicProps(CurUpgrade, this, null, null);
        await NewRuleProperty.BuildConsumables([])
        const NewPurchase : WarbandPurchase = new WarbandPurchase({
            cost_value : stash.Cost,
            cost_type : stash.CostType,
            count_limit : true,
            count_cap : true,
            sell_item : true,
            sell_full : true,
            purchaseid: CurUpgrade.ID,
            faction_rel_id: stash.ID,
            custom_rel: stash.SelfData,
            modelpurch : true
        }, this, NewRuleProperty);
        this.Upgrades.push(NewPurchase);

        return NewPurchase;
    }

    public async DeleteUpgrade( upgrade : WarbandPurchase ) {
        
        for (let i = 0; i < this.Upgrades.length; i++) {
            if (upgrade == (this.Upgrades[i])) {
                this.Upgrades.splice(i, 1);
                break;
            }
        }
    }

    public async GetModelInjuryOptions() {
        const AllInjuries : Injury[] = await InjuryFactory.GetAllInjury();
        const ListOfOptions : Injury[] = [];

        const eventmon : EventRunner = new EventRunner();
        for (let i = 0; i < AllInjuries.length; i++) {
            const Allow = await eventmon.runEvent(
                "allowInjuryGain",
                this,
                [this],
                true,
                AllInjuries[i]
            )
            if (Allow) {
                ListOfOptions.push(AllInjuries[i]);
            }
        }

        return ListOfOptions;
    }

    public async GetModelSkillOptions() {
        const ListOfOptions : SkillSuite[] = [];
        const BaseSkillgroups : SkillGroup[] = await SkillFactory.GetBaseSkills();
        const Patrons : Patron | null = (this.MyContext as UserWarband).Faction.GetPatronSkills();

        const eventmon : EventRunner = new EventRunner();
        if (Patrons != null) {
            const validSkills : Skill[] = [];

            for (let i = 0; i < Patrons.Skills.length; i++) {
                if (this.IsUnRestricted == true) {
                    validSkills.push(Patrons.Skills[i]);
                }else if (this.Skills.filter((item) => (item.SelfDynamicProperty.OptionChoice.ID == Patrons.Skills[i].ID)).length == 0) {

                    const Allow = await eventmon.runEvent(
                        "allowSkillGain",
                        this,
                        [this],
                        true,
                        Patrons.Skills[i]
                    )
                    if (Allow) {
                        validSkills.push(Patrons.Skills[i]);
                    }
                }
            }

            ListOfOptions.push(
                {
                    skillgroup: Patrons,
                    list: validSkills
                }
            )
        }
        
        for (let j = 0; j < BaseSkillgroups.length; j++) {
            const SkillGroup = BaseSkillgroups[j]
            const validSkills : Skill[] = [];

            for (let i = 0; i < SkillGroup.Skills.length; i++) {
                if (this.Skills.filter((item) => (item.SelfDynamicProperty.OptionChoice.ID == SkillGroup.Skills[i].ID)).length == 0) {

                    const Allow = await eventmon.runEvent(
                        "allowSkillGain",
                        this,
                        [this],
                        true,
                        SkillGroup.Skills[i]
                    )
                    if (Allow) {
                        validSkills.push(SkillGroup.Skills[i]);
                    }
                }
            }

            ListOfOptions.push(
                {
                    skillgroup: SkillGroup,
                    list: validSkills
                }
            )
        }

        return ListOfOptions;
    }

    public async AddInjury(inj : Injury) {
        const NewRuleProperty = new WarbandProperty(inj, this, null, null);
        await NewRuleProperty.HandleDynamicProps(inj, this, null, null);
        await NewRuleProperty.BuildConsumables([]);
        this.Injuries.push(NewRuleProperty);
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onGainInjury",
            NewRuleProperty,
            [this],
            null,
            inj
        )
        await this.CheckIfDead();
    }

    public async CheckIfDead() {
        const MaxScars = await this.GetMaxScars()
        
        if (this.GetBattleScars() >= MaxScars) {
            this.State = 'dead';
        }
    }

    public async GetMaxScars() {
        
        const eventmon : EventRunner = new EventRunner();
        const MaxScars = await eventmon.runEvent(
            "getMaximumScars",
            this,
            [],
            3,
            this
        )

        return MaxScars;
    }

    public async AddSkill(skl : Skill) {
        const NewRuleProperty = new WarbandProperty(skl, this, null, null);
        await NewRuleProperty.HandleDynamicProps(skl, this, null, null);
        await NewRuleProperty.BuildConsumables([]);
        this.Skills.push(NewRuleProperty);
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onGainSkill",
            skl,
            [this],
            NewRuleProperty,
            skl
        )
    }

    public UpdateStatOption(newstat: ModelStatistics, oldstat : ModelStatistics | null) {
        if (oldstat == null) {
            this.Stat_Selections.push(newstat);
        } else {
            for (let i = 0; i < this.Stat_Selections.length; i++) {
                if (GetStatAsFullString(this.Stat_Selections[i]) == GetStatAsFullString(oldstat)) {
                    
                    this.Stat_Selections.splice(i, 1);
                    this.Stat_Selections.push(newstat);
                    return;
                }
            }
        }
    }

    public async GetStatOptions()  : Promise<ModelStatistics[][]> {
        
        const seen = new Set<string>();
        const EventProc : EventRunner = new EventRunner();
        const results: ModelStatistics[][]  = await EventProc.runEvent(
            "getMemberModelStatOptions",
            this,
            [],
            [],
            this
        )

        const Output : ModelStatistics[][] = []

        for (let i = 0; i < results.length ; i++) {
            const MS : ModelStatistics[] = []
            const localseen = new Set<string>();
            for (const result of results[i]) {
                    const key = JSON.stringify({
                        movement: result.movement ?? null,
                        melee: result.melee ?? null, 
                        ranged: result.ranged ?? null,
                        base: result.base ? [...result.base].sort((a, b) => a - b) : undefined,
                        armour: result.armour ?? null, 
                        movetype: result.movetype ?? null,
                        potential: result.potential ?? null,
                        mercenary: result.mercenary ?? null
                    });

                    if (!localseen.has(key)) {
                    localseen.add(key);
                    MS.push(result);
                    }
            }
            const newkey = Array.from(localseen).join(',,,,,,,,,,') 
            if (!seen.has(newkey)) {
            seen.add(newkey);
            Output.push(MS);
            }
        }

        return Output;
    }
    
    public async CanChangeRank(): Promise<boolean> {
        let count = true;
        if (!this.Elite) {
            count = await (this.MyContext as UserWarband).CanAddMoreElite()
        }

        if (count) {
            const stats = await this.GetStats();

            if (stats.potential != undefined) {
                if (stats.potential == 2) { return false; }
            }
            return true;
        } else {
            return false;
        }
    }

    public ChangeRank() {
        this.Elite = !this.Elite;
    }

    public async ValidateStatSelection() {

        const SelectionOptions = await this.GetStatOptions();

        const StatSelections : ModelStatistics[] = [];

        for (let i =0; i < this.Stat_Selections.length; i++) {
            let IsValid = false;

            for (let j = 0; j < SelectionOptions.length; j++) {
                if (SelectionOptions[j].includes(this.Stat_Selections[i])) {
                    IsValid = true;
                }
            }

            if (IsValid) {
                StatSelections.push(this.Stat_Selections[i])
            }
        }

        this.Stat_Selections = StatSelections;
    }

    public async GetStats() {
        await this.ValidateStatSelection()
        const BaseStats = this.CurModel.Stats;
        let FinStats : ModelStatistics = {};


        if (BaseStats.armour != undefined) {FinStats.armour = BaseStats.armour}
        if (BaseStats.melee != undefined) {FinStats.melee = BaseStats.melee}
        if (BaseStats.ranged != undefined) {FinStats.ranged = BaseStats.ranged}
        if (BaseStats.base != undefined) {FinStats.base = BaseStats.base}
        if (BaseStats.mercenary != undefined) {FinStats.mercenary = BaseStats.mercenary}
        if (BaseStats.movement != undefined) {FinStats.movement = BaseStats.movement}
        if (BaseStats.movetype != undefined) {FinStats.movetype = BaseStats.movetype}
        if (BaseStats.potential != undefined) {FinStats.potential = BaseStats.potential}

        for (let i = 0; i < this.Stat_Selections.length; i++) {
            FinStats = MergeTwoStats(FinStats, this.Stat_Selections[i]);
        }
        
        const EventProc : EventRunner = new EventRunner();

        FinStats = await EventProc.runEvent(
            "updateModelStats",
            this,
            [],
            FinStats,
            null
        )

        return FinStats;
    }

    public async SetExperience(newval : number) {
        this.Experience = newval;
    }

    // @TODO Lane
    public async GetXPLimit() {
        const stats = await this.GetStats();
        if (stats.potential) {
            if (stats.potential == 0) { return 18; }
            if (stats.potential == 1) { return 7;}
            if (stats.potential == 2) { return 0;}
        }
        return 18;
    }

    public async GetModelEquipmentOptions() {
        const ListOfOptions : FactionEquipmentRelationship[] = []

        const eventmon : EventRunner = new EventRunner();
        const SkipEquip : boolean = await eventmon.runEvent(
            "overrideMercenarySkip",
            this,
            [],
            this.IsMercenary(),
            null
        )

        if (SkipEquip) {
            return ListOfOptions;
        }

        const BaseFactionOptions : FactionEquipmentRelationship[] = await (this.MyContext as UserWarband).GetFactionEquipmentOptions();

        if (this.IsUnRestricted == true) {
            return BaseFactionOptions;
        }

        const CurrentHandsAvailable : ModelHands = await this.GetModelHands();

        const RestrictionList : EquipmentRestriction[] = await eventmon.runEvent(
            "getEquipmentRestriction",
            this,
            [],
            [],
            null
        )
        
        for (let i = 0; i < BaseFactionOptions.length; i++) {

            let CanAdd = (BaseFactionOptions[i].EquipmentItem.Category != "equipment") 

            if (!CanAdd) {
                CanAdd = !(await this.HasSpecificEquipment(BaseFactionOptions[i].EquipmentItem.GetID()))
            }

            if (CanAdd) {
                CanAdd = await this.EquipItemAvailableSpace(BaseFactionOptions[i].EquipmentItem, CurrentHandsAvailable)
            }

            if (CanAdd) {
                CanAdd = await this.EquipItemCanAdd(BaseFactionOptions[i], RestrictionList)
            }

            if (CanAdd) {
                ListOfOptions.push(BaseFactionOptions[i]);
            }
        }

        return ListOfOptions;
    }

    public async HasSpecificEquipment(givenID : string) {        
        const MyEquip = await this.GetAllEquipForShow();
        for (let i = 0; i < MyEquip.length; i++) {
            const EquipItem = MyEquip[i].equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment;
            if (EquipItem.GetID() == givenID) {
                return true;
            }
        }
        return false;
    }

    public async EquipItemCanAdd(faceq : FactionEquipmentRelationship, restriction_list : EquipmentRestriction[]) {
        
        const eventmon : EventRunner = new EventRunner();
        const NewRefList : EquipmentRestriction[] = [];
        const EquipRestrictionList : EquipmentRestriction[] = await eventmon.runEvent(
            "getEquipmentRestriction",
            faceq,
            [],
            [],
            null
        )
        const BaseEquipRestrictionList : EquipmentRestriction[] = await eventmon.runEvent(
            "getEquipmentRestriction",
            faceq.EquipmentItem,
            [],
            [],
            null
        )
        for (let j = 0; j < restriction_list.length; j++) {
            NewRefList.push(restriction_list[j]);
        }
        for (let j = 0; j < EquipRestrictionList.length; j++) {
            NewRefList.push(EquipRestrictionList[j]);
        }
        for (let j = 0; j < BaseEquipRestrictionList.length; j++) {
            NewRefList.push(BaseEquipRestrictionList[j]);
        }
    
        let CanAdd = await eventmon.runEvent(
            "canModelAddItem",
            this,
            [NewRefList],
            true,
            {
                model: this,
                item : faceq
            }
        )
    
        CanAdd = await eventmon.runEvent(
            "canModelAddItem",
            faceq,
            [NewRefList],
            CanAdd,
            {
                model: this,
                item : faceq
            }
        )
    
        CanAdd = await eventmon.runEvent(
            "canModelAddItem",
            faceq.EquipmentItem,
            [NewRefList],
            CanAdd,
            {
                model: this,
                item : faceq
            }
        )
        return CanAdd
    }

    public async EquipItemAvailableSpace(faceq : Equipment, model_hands : ModelHands) {

        const EquippedItems = await this.GetAllEquipForShow();
        const KeyWordList = await this.GetKeywordsFull();

        for (let i = 0; i < EquippedItems.length; i++) {
            const item : RealWarbandPurchaseEquipment = EquippedItems[i];

            if (
                (containsTag((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Tags, "headgear") &&
                    containsTag(faceq.Tags, "headgear")) ||
                (containsTag((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Tags, "grenade") &&
                    containsTag(faceq.Tags, "grenade")) ||
                (containsTag((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Tags, "armour") &&
                    containsTag(faceq.Tags, "armour")) ||
                (containsTag((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Tags, "shield") &&
                    containsTag(faceq.Tags, "shield")) ||
                (containsTag((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Tags, "flag") &&
                    containsTag(faceq.Tags, "flag")) ||
                (containsTag((item.equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment).Tags, "instrument") &&
                    containsTag(faceq.Tags, "instrument"))
            ) {
                return false;
            }
            if (
                ((await item.equipment.GetKeywords()).filter((item) => item.ID == "kw_heavy").length > 0) &&
                (faceq.GetKeyWordIDs().includes("kw_heavy")) &&
                (KeyWordList.filter((item) => item.GetID() == "kw_strong").length == 0)
            ) {
                return false
            }
        }

        const eventmon : EventRunner = new EventRunner();
        const EquipHands : ModelHands = await eventmon.runEvent(
            "equipmentHandsCost",
            this,
            [],
            {
                melee: faceq.Stats["hands_melee"]? faceq.Stats["hands_melee"] : 0,
                ranged: faceq.Stats["hands_ranged"]? faceq.Stats["hands_ranged"] : 0,
                special: 0
            },
            {
                item: faceq,
                model: this
            }
        ) 

        
        const MeleeShield = await this.IncludesShieldComboMelee();
        const RangedShield = await this.IncludesShieldComboRanged();
        const HasShield = await this.HasShield();
        
        const IgnoreStrong = (await this.HasTwoHandedMeleeWeapon())
        const IsStrong = await this.IsKeywordPresent("kw_strong");

        if (!IgnoreStrong && IsStrong) {
            if (EquipHands.melee == 2) {
                EquipHands.melee = 1;
            }
        }

        if (MeleeShield && containsTag(faceq.Tags, "shield")) {
            if (EquipHands.melee > 0) {
                EquipHands.melee -= 1;
            }
        }
        if (RangedShield && containsTag(faceq.Tags, "shield")) {
            if (EquipHands.ranged > 0) {
                EquipHands.ranged -= 1;
            }
        }

        if (HasShield) {
            if (faceq.GetKeyWordIDs().includes("kw_shieldcombo")) {
                if (EquipHands.melee > 0) {
                    EquipHands.melee -= 1;
                }
                if (EquipHands.ranged > 0) {
                    EquipHands.ranged -= 1;
                }
            }
        }

        const CanAdd = this.CompareHands(EquipHands, model_hands)

        return CanAdd
    }

    public CompareHands(equipment_need : ModelHands, model_have : ModelHands) {
        if (
            (equipment_need.melee > model_have.melee) ||
            (equipment_need.ranged > model_have.ranged) ||
            (equipment_need.special > model_have.special)
        ) {
            return false;
        }
        return true;
    }

    public async IncludesShieldComboRanged() {
        const MyEquip = await this.GetAllEquipForShow();
        for (let i = 0; i < MyEquip.length; i++) {
            const KeywordList = await MyEquip[i].equipment.GetKeywords()
            const EquipItem = MyEquip[i].equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment;
            if (KeywordList.filter((item) => item.ID == "kw_shieldcombo").length > 0 && EquipItem.Category == "ranged") {
                return true;
            }
        }
        return false;
    }

    public async IncludesShieldComboMelee() {
        const MyEquip = await this.GetAllEquipForShow();
        for (let i = 0; i < MyEquip.length; i++) {
            const KeywordList = await MyEquip[i].equipment.GetKeywords()
            const EquipItem = MyEquip[i].equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment;
            if (KeywordList.filter((item) => item.ID == "kw_shieldcombo").length > 0 && EquipItem.Category == "melee") {
                return true;
            }
        }
        return false;
    }

    public async GetModelHands() {
        const eventmon : EventRunner = new EventRunner();
        const BaseHands : ModelHands = await eventmon.runEvent(
            "getModelHandsAvailable",
            this,
            [],
            {
                melee: 2,
                ranged: 2,
                special: 0
            },
            {
                model: this,
                warband : this.MyContext as UserWarband
            }
        )

        let IsStrong = await this.IsKeywordPresent("kw_strong");
        const MeleeShield = await this.IncludesShieldComboMelee();
        const RangedShield = await this.IncludesShieldComboRanged();

        const MyEquip = await this.GetAllEquipForShow();
        for (let i = 0; i < MyEquip.length; i++) {
            const EquipItem = MyEquip[i].equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment;
            if (EquipItem.Stats["hands_melee"]) {
                let meleeval = EquipItem.Stats["hands_melee"];
                if (IsStrong && meleeval == 2) {
                    meleeval = 1;
                    IsStrong = false;
                }
                if (containsTag(EquipItem.Tags, "shield") && MeleeShield) {
                    meleeval = 0;
                }
                if (BaseHands["melee"] == 0) {
                    BaseHands["special"] -= meleeval
                } else {
                    BaseHands["melee"] -= meleeval
                }
            }
            if (EquipItem.Stats["hands_ranged"]) {
                let rangedval = EquipItem.Stats["hands_ranged"];
                if (IsStrong && rangedval == 2) {
                    rangedval = 1;
                    IsStrong = false;
                }
                if (containsTag(EquipItem.Tags, "shield") && RangedShield) {
                    rangedval = 0;
                }
                if (BaseHands["ranged"] == 0) {
                    BaseHands["special"] -= rangedval
                } else {
                    BaseHands["ranged"] -= rangedval
                }
            }
        }
        return BaseHands;
    }

    public async HasTwoHandedMeleeWeapon() {
        const MyEquip = await this.GetAllEquipForShow();
        for (let i = 0; i < MyEquip.length; i++) {
            const EquipItem = MyEquip[i].equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment;
            if (EquipItem.Stats["hands_melee"]) {
                const meleeval = EquipItem.Stats["hands_melee"];
                if (meleeval == 2) {
                    return true;
                }
            }
        }
        return false;

    }

    public async HasShield() {
        const MyEquip = await this.GetAllEquipForShow();
        for (let i = 0; i < MyEquip.length; i++) {
            const EquipItem = MyEquip[i].equipment.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment;
            if (containsTag(EquipItem.Tags, "shield")) {
                return true;
            }
        }
        return false;

    }

    public async AddEquipment(item : FactionEquipmentRelationship) {
        const Equipment : WarbandEquipment = await WarbandFactory.BuildWarbandEquipmentFromPurchase(item, this);
        const NewPurchase : WarbandPurchase = new WarbandPurchase({
            cost_value : item.Cost,
            cost_type : item.CostType,
            count_limit : true,
            count_cap : true,
            sell_item : true,
            sell_full : true,
            purchaseid: item.EquipmentItem.ID,
            faction_rel_id: item.ID,
            custom_rel: item.SelfData,
            modelpurch : false
        }, this, Equipment);
        this.Equipment.push(NewPurchase);
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onGainEquipment",
            Equipment,
            [this.MyContext, this],
            null,
            NewPurchase
        )
    }

    public async GetAllEquipForShow() {
        
        const options : RealWarbandPurchaseEquipment[] = [ ];

        for (let i = 0; i < this.Equipment.length; i++) {
            options.push(
                {
                    purchase: this.Equipment[i],
                    equipment: this.Equipment[i].HeldObject as WarbandEquipment
                }
            )
        }

        for (let i = 0; i < this.ModelEquipments.length; i++) {
            for (let j = 0; j < this.ModelEquipments[i].SelfDynamicProperty.Selections.length; j++) {
                const SelecCur = this.ModelEquipments[i].SelfDynamicProperty.Selections[j].SelectedChoice;
                try {
                    if (SelecCur) {
                        const Val = SelecCur.value as ModelEquipmentRelationship;

                        for (let k = 0; k < Val.EquipmentItems.length; k++) {
                            const Model : WarbandEquipment = await WarbandFactory.BuildModelEquipmentFromPurchase(Val, Val.EquipmentItems[k], k, this);
                            const NewPurchase : WarbandPurchase = new WarbandPurchase({
                                cost_value : Val.SaleValue,
                                cost_type : Val.SaleType,
                                count_limit : false,
                                count_cap : false,
                                sell_item : Val.Removable,
                                sell_full : true,
                                purchaseid: Val.ID,
                                faction_rel_id: Val.ID,
                                custom_rel: Val.SelfData,
                                modelpurch: true
                            }, this, Model);

                            options.push(
                                {
                                    purchase: NewPurchase,
                                    equipment: Model
                                }
                            )
                        }

                    }
                } catch(e) { console.log(e)}
            }
        }

        return options;
    }
    
    public async DirectAddStash( item : RealWarbandPurchaseEquipment) {
        if (item.purchase.Sellable == false) {return}
        this.Equipment.push(item.purchase);
    }
    
    public async CopyStash( item : RealWarbandPurchaseEquipment ) {

        if (item.purchase.Sellable == false) {return "Cannot sell this item"}
        const IsValidToAdd = await (this.MyContext as UserWarband).AtMaxOfItem(item.purchase.PurchaseInterface);

        if (IsValidToAdd) {
            return "Warband At Limit For " + item.equipment.MyEquipment.GetTrueName();
        }

        let CanAddToThisModel = true
        if ((item.purchase.CustomInterface as IFactionEquipmentRelationship).tags['is_custom']) {
            CanAddToThisModel = await this.CanAddItem(item.purchase.PurchaseInterface)
        }

        if (!CanAddToThisModel) {
            return "This model cannot have another " + item.equipment.MyEquipment.GetTrueName();
        }
        
        const Relationship : FactionEquipmentRelationship = await EquipmentFactory.CreateFactionEquipment(item.purchase.CustomInterface as IFactionEquipmentRelationship, this, true)
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
            modelpurch : item.purchase.ModelPurchase
        }, this, Equipment);
        this.Equipment.push(NewPurchase);
        
        return Equipment.MyEquipment.Name + " Sucessfully Duplicated";
    }

    public async CanAddItem( model : string) {
        if (this.IsUnRestricted) {
            return true;
        }
        const RefModel : FactionEquipmentRelationship | null = await EquipmentFactory.CreateNewFactionEquipment(model, null);
        if (RefModel == null) {
            return false;
        }
        const eventmon : EventRunner = new EventRunner();

        const SkipEquip : boolean = await eventmon.runEvent(
            "overrideMercenarySkip",
            this,
            [],
            this.IsMercenary(),
            null
        )

        if (SkipEquip) {
            return true;
        }

        const CurrentHandsAvailable : ModelHands = await this.GetModelHands();

        const RestrictionList : EquipmentRestriction[] = await eventmon.runEvent(
            "getEquipmentRestriction",
            this,
            [],
            [],
            null
        )
        
        let CanAdd = (RefModel.EquipmentItem.Category != "equipment") 

        if (!CanAdd) {
            CanAdd = !(await this.HasSpecificEquipment(RefModel.EquipmentItem.GetID()))
        }

        if (CanAdd) {
            CanAdd = await this.EquipItemAvailableSpace(RefModel.EquipmentItem, CurrentHandsAvailable)
        }

        if (CanAdd) {
            CanAdd = await this.EquipItemCanAdd(RefModel, RestrictionList)
        }

        if (CanAdd) {
            CanAdd = await eventmon.runEvent(
                "canModelAddItem",
                RefModel,
                [[]],
                true,
                this
            )
        }
        return CanAdd;
    }

    public async EmptyStash() {
        const TempArr : WarbandPurchase[] = [];
        for (let i = 0; i < this.Equipment.length; i++) {
            TempArr.push(this.Equipment[i])
        }
        for (let i = 0; i < TempArr.length; i++) {
            this.DeleteStashWithDebt(
                {
                    purchase: TempArr[i],
                    equipment: TempArr[i].HeldObject as WarbandEquipment
                }, 1
            )
        }
    }

    public async DeleteStashWithDebt( item : RealWarbandPurchaseEquipment, debt_mod : number) {
        const CostVarDucats = item.purchase.GetTotalDucats();
        const CostVarGlory = item.purchase.GetTotalGlory();
        if (item.purchase.Sellable == false) { return; }
        const debt = (item.purchase.FullSell == false)? debt_mod : 0;
        try {
            await this.DeleteStash(item);
            if (item.purchase.CountCap == true) {
                (this.MyContext as UserWarband).Debts.ducats +=  Math.ceil(CostVarDucats * debt);
                (this.MyContext as UserWarband).Debts.glory += Math.ceil(CostVarGlory * debt);
            }

        } catch (e) { console.log(e) }
    }
    
    public async DeleteStash( item : RealWarbandPurchaseEquipment ) {
        if (item.purchase.Sellable == false) {return}
        for (let i = 0; i < this.Equipment.length; i++) {
            if (item.equipment == (this.Equipment[i].HeldObject as WarbandEquipment)) {
                this.Equipment.splice(i, 1);
                break;
            }
        }
    }
    
    public async DeleteInjury( item : WarbandProperty ) {
        for (let i = 0; i < this.Injuries.length; i++) {
            if (item == (this.Injuries[i])) {
                this.Injuries.splice(i, 1);
                break;
            }
        }
    }
    
    public async DeleteSkill( item : WarbandProperty ) {
        for (let i = 0; i < this.Skills.length; i++) {
            if (item == (this.Skills[i])) {
                this.Skills.splice(i, 1);
                break;
            }
        }
    }
}

export {IWarbandMember, WarbandMember}

