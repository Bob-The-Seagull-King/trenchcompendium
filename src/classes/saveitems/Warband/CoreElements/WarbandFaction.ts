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

interface IWarbandFaction extends IContextObject {
    faction_property: IWarbandProperty,
    faction_rules : IWarbandProperty[]
    patron_id?: string,
}

class WarbandFaction extends DynamicContextObject {
    MyFaction: WarbandProperty;
    MyPatron: Patron | null = null;
    MyFactionRules : WarbandProperty[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(data: IWarbandFaction, parent : DynamicContextObject | null)
    {
        super(data, parent)
        const Value = FactionFactory.CreateNewFaction(data.faction_property.object_id, this);
        this.MyFaction = new WarbandProperty(Value, this, null, data.faction_property);
        if (data.patron_id) {
            this.MyPatron = SkillFactory.CreateNewPatron(data.patron_id, this);
        }
        this.BuildFactionRules(data);
    }

    public BuildFactionRules(data : IWarbandFaction) {
        const FactionObj : Faction = this.MyFaction.SelfDynamicProperty.OptionChoice as Faction;
        for (let i = 0; i < FactionObj.Rules.length; i++) {
            let IsFound = false
            for (let j = 0; j < data.faction_rules.length; j++) {
                if (data.faction_rules[j].object_id == FactionObj.Rules[i].ID) {
                    const NewRuleProperty = new WarbandProperty(FactionObj.Rules[i], this, null, data.faction_rules[j]);
                    this.MyFactionRules.push(NewRuleProperty);
                    IsFound = true;
                    break;
                }
            }
            if (IsFound == false) {
                const NewRuleProperty = new WarbandProperty(FactionObj.Rules[i], this, null, null);
                this.MyFactionRules.push(NewRuleProperty);
            }
        }
    }

    public ConvertToInterface() {
        let PatronID = undefined;
        if (this.MyPatron != null) { PatronID = this.MyPatron.ID }

        const ruleset : IWarbandProperty[] = [];
        for (let i = 0; i < this.MyFactionRules.length; i++) {
            ruleset.push(this.MyFactionRules[i].ConvertToInterface())
        }

        const _objint : IWarbandFaction = {
            contextdata : this.ContextData,            
            id: this.ID,
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags,
            faction_property: this.MyFaction.ConvertToInterface(),
            faction_rules : ruleset,
            patron_id: PatronID,
        }
        
        return _objint;
    }
    
    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = []        

        for (let i = 0; i < this.MyFactionRules.length; i++) {
            const static_packages : ContextPackage[] = await this.MyFactionRules[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            }
        }
        
        const static_packages : ContextPackage[] = await this.MyFaction.GrabContextPackages(event_id, source_obj, arrs_extra);
        for (let j = 0; j < static_packages.length; j++) {
            subpackages.push(static_packages[j])
        }

        if (this.MyPatron != null) {
            const static_packages : ContextPackage[] = await this.MyPatron.GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                subpackages.push(static_packages[j])
            } 
        }

        return subpackages; 
    }


}

export {IWarbandFaction, WarbandFaction}

