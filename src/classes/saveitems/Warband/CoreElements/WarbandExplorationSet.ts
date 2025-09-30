import { Skill } from "../../../feature/ability/Skill";
import { ContextObject, IContextObject } from "../../../contextevent/contextobject";
import { DynamicOptionContextObject } from "../../../options/DynamicOptionContextObject";
import { ISelectedOption, IWarbandProperty, WarbandProperty } from "../WarbandProperty";
import { DynamicContextObject} from "../../../contextevent/dynamiccontextobject";
import { SkillFactory } from "../../../../factories/features/SkillFactory";
import { ExplorationFactory } from "../../../../factories/features/ExplorationFactory";
import { ContextPackage } from "../../../contextevent/contextpackage";
import { UserWarband } from "../UserWarband";
import { WarbandMember } from "../Purchases/WarbandMember";
import { ExplorationTable } from "../../../feature/exploration/ExplorationTable";
import { ExplorationLocation } from "../../../feature/exploration/ExplorationLocation";
import { StaticOption } from "../../../options/StaticOption";
import { IChoice } from "../../../options/StaticOption";
import { EventRunner } from "../../../contextevent/contexteventhandler";
import { containsTag } from "../../../../utility/functions";
import { WarbandConsumable } from "../WarbandConsumable";

interface IWarbandExplorationSet extends IContextObject {
    explorationskills: IWarbandProperty[];
    locations: IWarbandProperty[];
    location_mods? : IWarbandProperty[];
}

export interface ExplorationSkillSuite {
    skill: WarbandProperty,
    count: number,
    sources : string[]
}

export interface ExplorationTableSuite {
    table : ExplorationTable,
    valid_locs : FilteredLocation[]
}

export interface FilteredLocation {
    location : ExplorationLocation,
    options : FilteredOptions[]
}

export function CheckRelevantFullOptions(loc : FilteredLocation) {
    const list : StaticOption[] = []

    for (let i = 0; i < loc.location.MyOptions.length; i++) {
        if (!containsTag(loc.location.MyOptions[i].Tags, "unrequired_selection")) {
            list.push(loc.location.MyOptions[i])
        }
    }

    return list;
}

export function CheckRelevantBaseOptions(loc : FilteredLocation) {
    const list : FilteredOptions[] = []

    for (let i = 0; i < loc.options.length; i++) {
        if (!containsTag(loc.options[i].baseopt.Tags, "unrequired_selection")) {
            list.push(loc.options[i])
        }
    }

    return list;
}

export interface FilteredOptions {
    baseopt : StaticOption
    selection_valid : IChoice[]
}

export interface GeneralLocationCache {
    exploration_skills?: WarbandProperty[]
}

export interface StoredLocation {
    true_obj? : WarbandProperty,
    base_item : FilteredLocation,
    selected_options: ISelectedOption[]
}

class WarbandExplorationSet extends DynamicContextObject {
    Skills : WarbandProperty[] = [];
    Locations : WarbandProperty[] = [];
    LocationMods : WarbandProperty[] = [];
    GeneralCache : GeneralLocationCache = {};
    CurLocation : StoredLocation | null = null;

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
            const Value = await SkillFactory.CreateNewSkill(CurVal.object_id, this.MyContext? this.MyContext as UserWarband : null);
            const NewSkill = new WarbandProperty(Value, this.MyContext? this.MyContext as UserWarband : null, null, CurVal);
            await NewSkill.HandleDynamicProps(Value, this.MyContext? this.MyContext as UserWarband : null, null, CurVal);
            await NewSkill.BuildConsumables(CurVal.consumables);
            this.Skills.push(NewSkill);
        }
    }

    public async BuildLocations(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = await ExplorationFactory.CreateNewExplorationLocation(CurVal.object_id, this.MyContext? this.MyContext as UserWarband : null, true);
            const NewLocation = new WarbandProperty(Value, this.MyContext? this.MyContext as UserWarband : null, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this.MyContext? this.MyContext as UserWarband : null, null, CurVal);
            await NewLocation.BuildConsumables(CurVal.consumables);
            this.Locations.push(NewLocation);
        }
    }

    public async BuildLocationMods(data : IWarbandProperty[]) {
        for (let i = 0; i < data.length; i++) {
            const CurVal = data[i];
            const Value = await ExplorationFactory.CreateNewExplorationLocation(CurVal.object_id, this.MyContext? this.MyContext as UserWarband : null, true);
            const NewLocation = new WarbandProperty(Value, this.MyContext? this.MyContext as UserWarband : null, null, CurVal);
            await NewLocation.HandleDynamicProps(Value, this.MyContext? this.MyContext as UserWarband : null, null, CurVal);
            await NewLocation.BuildConsumables(CurVal.consumables);
            this.LocationMods.push(NewLocation);
        }
    }

    public async RebuildProperties() {
        for (let i = 0; i < this.Locations.length; i++) {
            const CurVal = this.Locations[i]
            await CurVal.RegenerateOptions();
        }
        for (let i = 0; i < this.LocationMods.length; i++) {
            const CurVal = this.LocationMods[i]
            await CurVal.RegenerateOptions();
        }
        for (let i = 0; i < this.Skills.length; i++) {
            const CurVal = this.Skills[i]
            await CurVal.RegenerateOptions();
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
        const locationmodset : IWarbandProperty[] = [];
        for (let i = 0; i < this.LocationMods.length; i++) {
            locationmodset.push(this.LocationMods[i].ConvertToInterface())
        }
        const _objint : IWarbandExplorationSet = {
            explorationskills: skillset,
            locations: locationset,
            location_mods: locationmodset,
            contextdata : this.ContextKeys,            
            id: this.ID,
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags
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

        for (let i = 0; i < this.LocationMods.length; i++) {
            const static_packages : ContextPackage[] = await this.LocationMods[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandExplorationSet")
                subpackages.push(static_packages[j])
            }
        }

        return subpackages; 
    }

    public async GetSkills() {
        const SumSkills : WarbandProperty[] = [];
        for (let i = 0; i < this.Skills.length; i++) {
            SumSkills.push(this.Skills[i]);
        }
        for (let i = 0; i < (this.MyContext as UserWarband).Models.length; i++) {
            const Mdl = (this.MyContext as UserWarband).Models[i].HeldObject as WarbandMember;
            const NewSkills = await Mdl.GetExplorationSkills();
            for (let j = 0; j < NewSkills.length; j++) {
                SumSkills.push(NewSkills[j])
            }
        }
        return SumSkills;
    }

    public async GetSkillsInFormat() {
        const SumSkills : ExplorationSkillSuite[] = [];
        for (let i = 0; i < this.Skills.length; i++) {
            this.TryAddToSkillsFormat(SumSkills, this.Skills[i], "Warband Skills")
        }
        for (let i = 0; i < (this.MyContext as UserWarband).Models.length; i++) {
            const Mdl = (this.MyContext as UserWarband).Models[i].HeldObject as WarbandMember;
            const NewSkills = await Mdl.GetExplorationSkills();
            for (let j = 0; j < NewSkills.length; j++) {
                this.TryAddToSkillsFormat(SumSkills, NewSkills[j], "Model: " + Mdl.GetTrueName())
            }
        }
        
        const NewSkills = await (this.MyContext as UserWarband).GetSelfExplorationSkills();
        for (let j = 0; j < NewSkills.length; j++) {
            this.TryAddToSkillsFormat(SumSkills, NewSkills[j], (NewSkills[j].Tags["SkillOrigin"])? NewSkills[j].Tags["SkillOrigin"]?.toString(): "Location")
        }
        return SumSkills;
    }

    public async GetWarbandModifiers() {
        if (this.GeneralCache.exploration_skills != null) {
            return this.GeneralCache.exploration_skills
        }

        const SkillList : WarbandProperty[] = [];
        const Events : EventRunner = new EventRunner();

        for (let i = 0; i < this.Locations.length; i++) {
            const ShowWarband = await Events.runEvent(
                "showSkillOnWarband",
                this.Locations[i],
                [],
                false,
                this
            )

            if (ShowWarband) {
                SkillList.push(this.Locations[i])
            }
        }

        for (let i = 0; i < this.LocationMods.length; i++) {
            SkillList.push(this.LocationMods[i])
        }
        
        this.GeneralCache.exploration_skills = SkillList;
        return SkillList;
    }

    public TryAddToSkillsFormat(skillsformatted : ExplorationSkillSuite[], NewSkill : WarbandProperty, source = "Warband") {
        
        const selected = skillsformatted.find((i) => i.skill.SelfDynamicProperty.OptionChoice.GetID() === NewSkill.SelfDynamicProperty.OptionChoice.GetID());
        if (selected) {
            selected.count += 1;
            selected.sources.push(source);
        } else {
            skillsformatted.push(
                {
                    skill: NewSkill,
                    count: 1,
                    sources: [source]
                }
            )
        }
    }

    public GetObjectsWithAttatch() {
        const List : WarbandProperty[] = []
        for (let i = 0; i < this.Locations.length; i++) {
            const obj = (this.Locations[i])
            if (obj.SelfDynamicProperty.OptionChoice.ContextKeys["warband_attatch"]) {
                List.push(this.Locations[i])
            }
        }
        for (let i = 0; i < this.LocationMods.length; i++) {
            const obj = (this.LocationMods[i])
            if (obj.SelfDynamicProperty.OptionChoice.ContextKeys["warband_attatch"]) {
                List.push(this.LocationMods[i])
            }
        }

        return List;
    }

    public async GetValidNewLocations() {
        const LocationSuite : ExplorationTableSuite[] = []

        const TableList : ExplorationTable[] = await ExplorationFactory.GetAllTables(this, true);

        for (let i = 0; i < TableList.length; i++) {
            const ValidLocs : FilteredLocation[] = []

            for (let j = 0; j < TableList[i].ExplorationLocations.length; j++) {
                const selected = this.Locations.find((k) => k.SelfDynamicProperty.OptionChoice.GetID() === TableList[i].ExplorationLocations[j].GetID());

                if (!selected || (this.MyContext as UserWarband).IsUnRestricted) {
                    const ValidLoc : FilteredLocation = await this.GetValidOptionsForLocation(TableList[i].ExplorationLocations[j]);
                    ValidLocs.push(
                        ValidLoc
                    )
                }
            }

            LocationSuite.push(
                {
                    table: TableList[i],
                    valid_locs: ValidLocs
                }
            )
        }

        return LocationSuite;
    }

    public async GetValidOptionsForLocation(explor_loc : ExplorationLocation) : Promise<FilteredLocation> {
        const eventmon : EventRunner = new EventRunner();
        const OptionList : FilteredOptions[] = []

        for (let i = 0; i < explor_loc.MyOptions.length; i++) {
            const ValidSelections: IChoice[] = [];

            for (let j = 0; j < explor_loc.MyOptions[i].Selections.length; j++) {
                if (explor_loc.MyOptions[i].Selections[j].value instanceof ContextObject) {
                    const IsValid = await eventmon.runEvent(
                        "canChooseOptionLocation",
                        explor_loc.MyOptions[i].Selections[j].value,
                        [],
                        true,
                        this.MyContext as UserWarband
                    )

                    if (IsValid) { ValidSelections.push(explor_loc.MyOptions[i].Selections[j]) }
                } else { ValidSelections.push(explor_loc.MyOptions[i].Selections[j]) }
            }
            if (ValidSelections.length > 0) {
                OptionList.push(
                    {
                        baseopt: explor_loc.MyOptions[i],
                        selection_valid: ValidSelections
                    }
                )
            }
        }

        return (
            {
                location: explor_loc,
                options: OptionList
            }
        )
    }

    public async DeleteLocation( mod : WarbandProperty ) {
        for (let i = 0; i < this.Locations.length; i++) {
            if (mod == (this.Locations[i])) {
                mod.SendConsumablesUp();
                this.Locations.splice(i, 1);
                break;
            }
        }
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onRemoveLocation",
            mod,
            [this.MyContext],
            null,
            this
        )
    }
    
    public async AddExplorationLocation ( location: ExplorationLocation, option: ISelectedOption[]) {

        const Selections : IWarbandProperty = {
            object_id: location.GetID(),
            selections: option,
            consumables: []
        }

        const NewRuleProperty = new WarbandProperty(location, this.MyContext? this.MyContext as UserWarband : null, null, Selections);
        await NewRuleProperty.HandleDynamicProps(location, this.MyContext? this.MyContext as UserWarband : null, null, Selections);
        this.Locations.push(NewRuleProperty);
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onGainLocation",
            this,
            [this.MyContext as UserWarband],
            null,
            NewRuleProperty
        )

    }
    public async AddExplorationMod ( location: ExplorationLocation, option: ISelectedOption[]) {

        const Selections : IWarbandProperty = {
            object_id: location.GetID(),
            selections: option,
            consumables: []
        }

        const NewRuleProperty = new WarbandProperty(location, this.MyContext? this.MyContext as UserWarband : null, null, Selections);
        await NewRuleProperty.HandleDynamicProps(location, this.MyContext? this.MyContext as UserWarband : null, null, Selections);
        this.LocationMods.push(NewRuleProperty);
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onGainLocation",
            this,
            [this.MyContext as UserWarband],
            null,
            NewRuleProperty
        )

    }

    public async AssignTempLocation() {
        
        if (this.CurLocation == null) {
            return;
        }
        if (this.CurLocation.true_obj == null) {
            return;
        }
        const refitem = this.CurLocation.true_obj
        this.Locations.push(refitem);
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onGainLocation",
            refitem,
            [this.MyContext as UserWarband],
            null,
            refitem
        )
        this.GeneralCache.exploration_skills = undefined;
        this.CurLocation = null;

        const consumables_past_save : WarbandConsumable[] = []
        for (let i = 0; i < refitem.Consumables.length; i++) {
            if (refitem.Consumables[i].SelectItem != null || refitem.Consumables[i].Tags["post_save"]) {
                consumables_past_save.push(refitem.Consumables[i])
            }
        }

        refitem.Consumables = consumables_past_save;
    }
    
    public async AddTempExplorationLocation ( location: ExplorationLocation, option: ISelectedOption[]) {
        if (this.CurLocation == null) {
            return;
        }
        const Selections : IWarbandProperty = {
            object_id: location.GetID(),
            selections: option,
            consumables: []
        }

        const NewRuleProperty = new WarbandProperty(location, this.MyContext? this.MyContext as UserWarband : null, null, Selections);
        await NewRuleProperty.HandleDynamicProps(location, this.MyContext? this.MyContext as UserWarband : null, null, Selections);
        this.CurLocation.true_obj = NewRuleProperty;
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "onPickLocation",
            NewRuleProperty,
            [this.MyContext as UserWarband],
            null,
            NewRuleProperty
        )

    }

}

export {IWarbandExplorationSet, WarbandExplorationSet}

