import { Skill } from "../../../feature/ability/Skill";
import { IContextObject } from "../../../contextevent/contextobject";
import { DynamicOptionContextObject } from "../../../options/DynamicOptionContextObject";
import { IWarbandProperty, WarbandProperty } from "../WarbandProperty";

interface IWarbandExplorationSet {
    explorationskills: IWarbandProperty[];
    locations: IWarbandProperty[];
}

class WarbandExplorationSet {
    Skills : WarbandProperty[] = [];
    Locations : WarbandProperty[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandExplorationSet)
    {
        console.log("test");
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
            locations: locationset
        }
        
        return _objint;
    }

}

export {IWarbandExplorationSet, WarbandExplorationSet}

