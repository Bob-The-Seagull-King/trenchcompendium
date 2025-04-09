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
import { EquipmentFactory } from "../../../../factories/features/EquipmentFactory";

interface IWarbandEquipment extends IContextObject {
    equipment_id: IWarbandProperty,
    subproperties : IWarbandProperty[]
}

class WarbandEquipment extends DynamicContextObject {
    MyEquipment!: WarbandProperty;
    SubProperties : WarbandProperty[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandEquipment, parent : DynamicContextObject | null)
    {
        super(data, parent)
    }

    public async BuildEquipment(equipment_property : IWarbandProperty) {        
        const Value = await EquipmentFactory.CreateNewEquipment(equipment_property.object_id, this);
        this.MyEquipment = new WarbandProperty(Value, this, null, equipment_property);
    }
    
    public BuildNewProperties() {
        console.log("Build New Properties")
    }

    public ConvertToInterface() {
        
        const subpropset : IWarbandProperty[] = [];
        for (let i = 0; i < this.SubProperties.length; i++) {
            subpropset.push(this.SubProperties[i].ConvertToInterface())
        }

        let EquipmentDat = null
        if (this.MyEquipment) {
            EquipmentDat = this.MyEquipment.ConvertToInterface();
        } else {
            EquipmentDat = {
                object_id: "",
                selections: []
            }
        }

        const _objint : IWarbandEquipment = {
            contextdata : this.ContextData,            
            id: this.ID,
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags,
            equipment_id: EquipmentDat,
            subproperties : subpropset  
        }
        
        return _objint;
    }
    
    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = [] 
        
        if (this.MyEquipment) {
            const static_packages : ContextPackage[] = await this.MyEquipment.GrabContextPackages(event_id, source_obj, arrs_extra);
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

export {IWarbandEquipment, WarbandEquipment}

