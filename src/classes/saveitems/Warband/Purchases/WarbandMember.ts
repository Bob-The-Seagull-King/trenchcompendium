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
import { IWarbandPurchaseEquipment, IWarbandPurchaseUpgrade, RealWarbandPurchaseEquipment, WarbandPurchase } from "./WarbandPurchase";
import { INote } from "../../../Note";
import { Model } from "../../../feature/model/Model";
import { ModelFactory } from "../../../../factories/features/ModelFactory";
import { WarbandEquipment } from "./WarbandEquipment";
import { UpgradeFactory } from "../../../../factories/features/UpgradeFactory";
import { InjuryFactory } from "../../../../factories/features/InjuryFactory";
import { Upgrade } from "../../../feature/ability/Upgrade";
import { Equipment } from "../../../feature/equipment/Equipment";
import { Keyword } from "../../../feature/glossary/Keyword";

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
    elite : boolean,
    recruited: boolean
}

class WarbandMember extends DynamicContextObject {
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
    

    public BuildNewProperties() {
        console.log("Build New Properties")
    }

    public async BuildEquipment(data : IWarbandPurchaseEquipment[]) {
        for (let i = 0; i < data.length; i++) {
            const Model : WarbandEquipment = await new WarbandEquipment(data[i].equipment, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Model);
            this.Equipment.push(NewPurchase);
        }

    }

    public async BuildUpgrade(data : IWarbandPurchaseUpgrade[]) {
        for (let i = 0; i < data.length; i++) {            
            const Value = await UpgradeFactory.CreateNewUpgrade(data[i].upgrade.object_id, this);
            const NewPurchase : WarbandPurchase = new WarbandPurchase(data[i].purchase, this, Value);
            this.Equipment.push(NewPurchase);
        }
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
            elite : this.Elite,
            recruited : this.Recruited
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
                static_packages[j].callpath.push(this.constructor.name)
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.Skills.length; i++) {
            const static_packages : ContextPackage[] = await this.Skills[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push(this.constructor.name)
                subpackages.push(static_packages[j])
            }
        }  

        for (let i = 0; i < this.Upgrades.length; i++) {
            const static_packages : ContextPackage[] = await (this.Upgrades[i].HeldObject as Upgrade).GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push(this.constructor.name)
                subpackages.push(static_packages[j])
            }
        } 

        for (let i = 0; i < this.Injuries.length; i++) {
            const static_packages : ContextPackage[] = await this.Injuries[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push(this.constructor.name)
                subpackages.push(static_packages[j])
            }
        }  

        for (let i = 0; i < this.Equipment.length; i++) {
            const static_packages : ContextPackage[] = await (this.Equipment[i].HeldObject as Equipment).GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push(this.constructor.name)
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.SubProperties.length; i++) {
            const static_packages : ContextPackage[] = await this.SubProperties[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push(this.constructor.name)
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
        // @TODO
        return 0;
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

}

export {IWarbandMember, WarbandMember}

