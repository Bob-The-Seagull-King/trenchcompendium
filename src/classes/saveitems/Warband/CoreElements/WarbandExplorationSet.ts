import { Skill } from "../../../feature/ability/Skill";
import { ContextObject, IContextObject } from "../../../contextevent/contextobject";
import { DynamicOptionContextObject } from "../../../options/DynamicOptionContextObject";
import { IWarbandProperty, WarbandProperty } from "../WarbandProperty";
import { DynamicContextObject} from "../../../contextevent/dynamiccontextobject";
import { SkillFactory } from "../../../../factories/features/SkillFactory";
import { ExplorationFactory } from "../../../../factories/features/ExplorationFactory";
import { ContextPackage } from "../../../contextevent/contextpackage";

interface IWarbandExplorationSet extends IContextObject {
    explorationskills: IWarbandProperty[];
    locations: IWarbandProperty[];
}

class WarbandExplorationSet extends DynamicContextObject {
    Skills : WarbandProperty[] = [];
    Locations : WarbandProperty[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandExplorationSet, parent : DynamicContextObject | null)
    {
        super(data, parent)
    }

    public async BuildSkills(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = await SkillFactory.CreateNewSkill(CurVal.object_id, this);
            const NewSkill = new WarbandProperty(Value, this, null, CurVal);
            await NewSkill.HandleDynamicProps(Value, this, null, CurVal);
            this.Skills.push(NewSkill);
        }
    }

    public async BuildLocations(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = await ExplorationFactory.CreateNewExplorationLocation(CurVal.object_id, this);
            const NewLocation = new WarbandProperty(Value, this, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this, null, CurVal);
            this.Locations.push(NewLocation);
        }
    }

    public ConvertToInterface() {
        const skillset : IWarbandProperty[] = [];
        for (let i = 0; i < this.Skills.length; i++) {
            skillset.push(this.Skills[i].ConvertToInterface())
        }
        const locationset : IWarbandProperty[] = [];
        for (let i = 0; i < this.Locations.length; i++) {
            locationset.push(this.Locations[i].ConvertToInterface())
        }
        const _objint : IWarbandExplorationSet = {
            explorationskills: skillset,
            locations: locationset,
            contextdata : this.ContextKeys,            
            id: this.ID,
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags
        }
        
        return _objint;
    }
    
    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = []
        
        for (let i = 0; i < this.Skills.length; i++) {
            const static_packages : ContextPackage[] = await this.Skills[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandExplorationSet")
                subpackages.push(static_packages[j])
            }
        }

        for (let i = 0; i < this.Locations.length; i++) {
            const static_packages : ContextPackage[] = await this.Locations[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandExplorationSet")
                subpackages.push(static_packages[j])
            }
        }

        return subpackages; 
    }


}

export {IWarbandExplorationSet, WarbandExplorationSet}

