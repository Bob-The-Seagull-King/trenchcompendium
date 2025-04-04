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
import { IWarbandPurchaseEquipment, IWarbandPurchaseUpgrade, WarbandPurchase } from "./WarbandPurchase";
import { INote } from "../../../Note";
import { Model } from "../../../feature/model/Model";
import { ModelFactory } from "../../../../factories/features/ModelFactory";
import { WarbandEquipment } from "./WarbandEquipment";
import { UpgradeFactory } from "../../../../factories/features/UpgradeFactory";
import { InjuryFactory } from "../../../../factories/features/InjuryFactory";
import { Upgrade } from "../../../feature/ability/Upgrade";
import { Equipment } from "../../../feature/equipment/Equipment";

interface IWarbandMember extends IContextObject {
    model: string,
    subproperties : IWarbandProperty[],
    notes : INote[]
    active : boolean,
    equipment : IWarbandPurchaseEquipment[],
    list_upgrades : IWarbandPurchaseUpgrade[],
    list_injury : IWarbandProperty[],
    list_skills : IWarbandProperty[],
    experience : number,
    elite : boolean
}

class WarbandMember extends DynamicContextObject {
    Notes : INote[];
    IsActive : boolean;
    CurModel : Model | null = null;
    SubProperties : WarbandProperty[] = [];
    Equipment : WarbandPurchase[] = [];
    Upgrades : WarbandPurchase[] = [];
    Skills : WarbandProperty[] = [];
    Injuries : WarbandProperty[] = [];
    Experience : number;
    Elite : boolean;


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
        this.BuildModel(data.model)
        this.BuildEquipment(data.equipment);
        this.BuildUpgrade(data.list_upgrades);
        this.BuildSkills(data.list_skills);
        this.BuildInjuries(data.list_injury);
        this.BuildNewProperties();
    }
    

    public BuildNewProperties() {
        console.log("Build New Properties")
    }

    public BuildEquipment(data : IWarbandPurchaseEquipment[]) {
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandEquipment = new WarbandEquipment(data[i].equipment, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Equipment.push(NewPurchase);
        }

    }

    public BuildUpgrade(data : IWarbandPurchaseUpgrade[]) {
        for (let i = 0; i < data.length; i++) {            
            const Value = UpgradeFactory.CreateNewUpgrade(data[i].upgrade.object_id, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Value);
            this.Equipment.push(NewPurchase);
        }
    }

    public BuildSkills(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = SkillFactory.CreateNewSkill(CurVal.object_id, this);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            this.Skills.push(NewLocation);
        }
    }

    public BuildInjuries(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = InjuryFactory.CreateNewInjury(CurVal.object_id, this);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            this.Injuries.push(NewLocation);
        }
    }

    public BuildModel(data : string) {
        const Value = ModelFactory.CreateNewModel(data, this);
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
            contextdata : this.ContextData,            
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
            elite : this.Elite
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
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.Skills.length; i++) {
            const static_packages : ContextPackage[] = await this.Skills[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            }
        }  

        for (let i = 0; i < this.Upgrades.length; i++) {
            const static_packages : ContextPackage[] = await (this.Upgrades[i].HeldObject as Upgrade).GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            }
        } 

        for (let i = 0; i < this.Injuries.length; i++) {
            const static_packages : ContextPackage[] = await this.Injuries[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            }
        }  

        for (let i = 0; i < this.Equipment.length; i++) {
            const static_packages : ContextPackage[] = await (this.Equipment[i].HeldObject as Equipment).GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.SubProperties.length; i++) {
            const static_packages : ContextPackage[] = await this.SubProperties[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            }
        } 

        return subpackages; 
    }


}

export {IWarbandMember, WarbandMember}

