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
import { Equipment } from "../../../feature/equipment/Equipment";
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

export interface MemberAndWarband {
    warband: UserWarband,
    model: WarbandMember
}

interface ModelHands {
    ranged: number,
    melee : number,
    special : number
}

export interface MemberUpgradePresentation {
    upgrade : ModelUpgradeRelationship,
    purchase : WarbandPurchase | null,
    allowed : boolean
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
    active : boolean,
    equipment : IWarbandPurchaseEquipment[],
    list_upgrades : IWarbandPurchaseUpgrade[],
    list_injury : IWarbandProperty[],
    list_skills : IWarbandProperty[],
    list_modelequipment : IWarbandProperty[],
    experience : number,
    elite : boolean,
    recruited: boolean,
    fighterName: string
}

class WarbandMember extends DynamicContextObject {

    public readonly boldXpIndices = [2, 4, 7, 10, 14, 18];

    Notes : INote[];
    IsActive : boolean;
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

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandMember, parent : DynamicContextObject | null)
    {
        super(data, parent)
        this.Notes = data.notes;
        this.IsActive = data.active;
        this.Experience = data.experience;
        this.Elite = data.elite;
        this.Recruited = data.recruited;
    }
    

    public async BuildModelEquipProperties(data : IWarbandMember = this.SelfData) {
        const all_eq : ModelEquipmentRelationship[] = this.CurModel.EquipmentList;
        this.ModelEquipments = [];
        for (let i = 0; i < all_eq.length; i++) {
            let IsFound = false
            for (let j = 0; j < data.subproperties.length; j++) {
                if (data.subproperties[j].object_id == all_eq[i].ID) {
                    const NewEquip = await EquipmentFactory.CreateNewModelEquipment(data.list_modelequipment[j].object_id, this)
                    const NewRuleProperty = new WarbandProperty(NewEquip, this, null, data.subproperties[j]);
                    await NewRuleProperty.HandleDynamicProps(NewEquip, this, null, data.subproperties[j]);
                    this.ModelEquipments.push(NewRuleProperty);
                    IsFound = true;
                    break;
                }
            }
            if (IsFound == false) {
                const NewRuleProperty = new WarbandProperty(all_eq[i], this, null, null);
                await NewRuleProperty.HandleDynamicProps(all_eq[i], this, null, null);
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
                    this.SubProperties.push(NewRuleProperty);
                    IsFound = true;
                    break;
                }
            }
            if (IsFound == false) {
                const NewRuleProperty = new WarbandProperty(all_abils[i], this, null, null);
                await NewRuleProperty.HandleDynamicProps(all_abils[i], this, null, null);
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
            
            const NewPurchase : WarbandPurchase = new WarbandPurchase(curUpgrade.purchase, this, NewRuleProperty);
            this.Upgrades.push(NewPurchase);
        }

        return this.Upgrades;
    }

    
    public async getContextuallyAvailableAbilities() : Promise<Ability[]> {
        const AbilitiesAvailable : Ability[] = []
        const BaseList : Ability[] = []
        
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
                result,
                BaseList,
                this
            )
            for (let i = 0; i < result_fin.length; i++) {
                AbilitiesAvailable.push(result[i]);
            }
        } else {
            for (let i = 0; i < BaseList.length; i++) {
                AbilitiesAvailable.push(BaseList[i]);
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
                for (let j = 0; j < MERelationship.EquipmentItems.length; j++) {
                    const IsFound = false
                    /*
                    for (let k = 0; k < this.Equipment.length; k++) {
                        if (this.Equipment[k].HeldObject.ID == MERelationship.ID + "_" + MERelationship.EquipmentItems[j].ID + "_" + j) {
                            IsFound = true;
                            break;
                        }
                    }*/
                    if ( !IsFound ) {
                        const Model : WarbandEquipment = await WarbandFactory.BuildModelEquipmentFromPurchase(MERelationship, MERelationship.EquipmentItems[j], this);
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
                            modelpurch: false
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
            const Value = await SkillFactory.CreateNewSkill(CurVal.object_id, this);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this, null, CurVal)
            this.Skills.push(NewLocation);
        }
    }

    public async BuildInjuries(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = await InjuryFactory.CreateNewInjury(CurVal.object_id, this);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this, null, CurVal);
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
            active : this.IsActive,
            equipment : equipmentlist,
            list_upgrades : upgradelist,
            list_injury : injuryset,
            list_skills : skillset,
            experience : this.Experience,
            list_modelequipment: modelpropset,
            elite : this.Elite,
            recruited : this.Recruited,
            fighterName: '' // @TODO: Set Fighter name - initially empty Fighter Name might even be correct
        }
        
        return _objint;
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

    public IsMercenary(): boolean {
        if (this.CurModel.Stats.mercenary) {
            return this.CurModel.Stats.mercenary
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
        const keywordarr : Keyword[] = [];
        for (let i = 0; i < this.CurModel.KeyWord.length; i++) {
            keywordarr.push(this.CurModel.KeyWord[i]);
        }
        return keywordarr;
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

    public GetSubCosts(type : number) {
        let countvar = 0;
        for (let i = 0; i < this.Upgrades.length; i++) {
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

    /**
     * Get the name of the Fighter
     * - i.e. "Steve the fearless"
     *
     * // @TODO: This need to be set somewhere
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
     * Return the total cost of the fighter in Ducats
     * - This includes base cost plus upgrades
     *
     * // @TODO: calculate actual ducats value
     * @return: int
     */
    GetTotalCostDucats () {

        const $total = this.GetBaseCostDucats () + 50;
        return $total;

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
     * Returns the total cost of the fighter in Glory
     * - This includes base cost plus upgrades
     *
     * // @TODO: calculate actual glory value
     * @return: int
     */
    GetTotalCostGlory () {

        const total = this.GetBaseCostGlory() + 2;
        return total;
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
        return this.Injuries.length;
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
            "getUpgradeLimitTrue", // @TODO Lane
            upg,
            [],
            maxcount,
            {
                warband: this.MyContext,
                model: this
            }
        )

        let canaddupgrade = (await this.GetCountOfUpgradeCategory(category) < limit_of_category || category == "upgrades")

        if (canaddupgrade) {
            const careAboutRequired = await Events.runEvent(
                "getRequiresUpgradesBool", // @TODO Lane
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
                "canModelGetUpgrade", // @TODO Lane
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
            allowed : canaddupgrade
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
        const BaseList : Keyword[] = []

        for (let i = 0; i < this.CurModel.KeyWord.length; i++) {
            BaseList.push(this.CurModel.KeyWord[i]);
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
                result,
                BaseList,
                this
            )
            for (let i = 0; i < result_fin.length; i++) {
                KeywordsAvailable.push(result[i]);
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

    public async GetModelEquipmentOptions() {
        const ListOfOptions : FactionEquipmentRelationship[] = []
        const BaseFactionOptions : FactionEquipmentRelationship[] = await (this.MyContext as UserWarband).GetFactionEquipmentOptions();

        const eventmon : EventRunner = new EventRunner();

        const CurrentHandsAvailable : ModelHands = await this.GetModelHands();

        for (let i = 0; i < BaseFactionOptions.length; i++) {
            let CanAdd = await eventmon.runEvent(
                "canModelAddItem", // @TODO Lane
                BaseFactionOptions[i],
                [],
                true,
                this
            )
            if (CanAdd) {
                const EquipHands : ModelHands = await eventmon.runEvent(
                    "equipmentHandsCost", // @TODO Lane
                    BaseFactionOptions[i],
                    [],
                    true,
                    this
                )
                CanAdd = this.CompareHands(EquipHands, CurrentHandsAvailable)
            }
            if (CanAdd) {
                ListOfOptions.push(BaseFactionOptions[i]);
            }
        }

        return ListOfOptions;
    }

    public CompareHands(equipment_need : ModelHands, model_have : ModelHands) {
        return true; //@TODO Lane compare hands
    }

    public async GetModelHands() {
        const BaseHands : ModelHands = {
            melee: 2,
            ranged: 2,
            special: 0
        }
        const eventmon : EventRunner = new EventRunner();
        const AvailableHands = await eventmon.runEvent(
                "getModelHandsAvailable",
                this,
                [],
                true,
                this.MyContext
            )
        // @TODO Lane get how many hands they have left
        return BaseHands;
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
    }
    
    public async DirectAddStash( item : RealWarbandPurchaseEquipment) {
        this.Equipment.push(item.purchase);
    }
    
    public async CopyStash( item : RealWarbandPurchaseEquipment ) {

        const IsValidToAdd = await (this.MyContext as UserWarband).AtMaxOfItem(item.purchase.PurchaseInterface);

        if (IsValidToAdd) {
            return "Warband At Limit For " + item.equipment.MyEquipment.GetTrueName();
        }

        const CanAddToThisModel = await this.CanAddItem(item.purchase.PurchaseInterface)

        if (!CanAddToThisModel) {
            return "This model cannot have another " + item.equipment.MyEquipment.GetTrueName();
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
            modelpurch : item.purchase.ModelPurchase
        }, this, Equipment);
        this.Equipment.push(NewPurchase);
        
        return Equipment.MyEquipment.Name + " Sucessfully Duplicated";
    }

    public async CanAddItem( model : string) {
        const RefModel : FactionEquipmentRelationship = await EquipmentFactory.CreateNewFactionEquipment(model, null);
        
        const eventmon : EventRunner = new EventRunner();
        const CanAdd = await eventmon.runEvent(
            "canModelAddItem",
            RefModel,
            [],
            true,
            this
        )
        return CanAdd;
    }

    public async DeleteStashWithDebt( item : RealWarbandPurchaseEquipment, debt_mod : number) {
        const CostVarDucats = item.purchase.GetTotalDucats();
        const CostVarGlory = item.purchase.GetTotalGlory();

        try {
            await this.DeleteStash(item);
            (this.MyContext as UserWarband).Debts.ducats +=  Math.ceil(CostVarDucats * debt_mod);
            (this.MyContext as UserWarband).Debts.glory += Math.ceil(CostVarGlory * debt_mod);

        } catch (e) { console.log(e) }
    }
    
    
    public async DeleteStash( item : RealWarbandPurchaseEquipment ) {
        
        for (let i = 0; i < this.Equipment.length; i++) {
            if (item.equipment == (this.Equipment[i].HeldObject as WarbandEquipment)) {
                this.Equipment.splice(i, 1);
                break;
            }
        }
    }
}

export {IWarbandMember, WarbandMember}

