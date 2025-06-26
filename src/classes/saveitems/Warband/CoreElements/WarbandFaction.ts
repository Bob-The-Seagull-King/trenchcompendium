import { Skill } from "../../../feature/ability/Skill";
import { ContextObject, IContextObject } from "../../../contextevent/contextobject";
import { DynamicOptionContextObject } from "../../../options/DynamicOptionContextObject";
import { IWarbandProperty, WarbandProperty } from "../WarbandProperty";
import { DynamicContextObject} from "../../../contextevent/dynamiccontextobject";
import { SkillFactory } from "../../../../factories/features/SkillFactory";
import { ExplorationFactory } from "../../../../factories/features/ExplorationFactory";
import { ContextPackage } from "../../../contextevent/contextpackage";
import { FactionFactory } from "../../../../factories/features/FactionFactory";
import { IPatronRelationship, Patron } from "../../../feature/skillgroup/Patron";
import { Faction } from "../../../feature/faction/Faction";
import { EventRunner } from "../../../contextevent/contexteventhandler";
import { Requester } from "../../../../factories/Requester";
import { Rule } from "../../../feature/faction/Rule";

interface IWarbandFaction extends IContextObject {
    faction_property: IWarbandProperty,
    faction_rules : IWarbandProperty[]
    patron_id?: string,
}

class WarbandFaction extends DynamicContextObject {
    MyFaction!: WarbandProperty;
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
    }

    public async BuildFaction(faction_property : IWarbandProperty) {        
        const Value = await FactionFactory.CreateNewFaction(faction_property.object_id, this);
        this.MyFaction = new WarbandProperty(Value, this, null, faction_property);
        await this.MyFaction.HandleDynamicProps(Value, this, null, faction_property);
    }

    public async BuildPatron(patron_id : string | undefined) {        
        if (patron_id) {
            this.MyPatron = await SkillFactory.CreateNewPatron(patron_id, this);
        }
    }

    public async BuildFactionRules(data : IWarbandFaction) {
        if (this.MyFaction) {
            const FactionObj : Faction = this.MyFaction.SelfDynamicProperty.OptionChoice as Faction;
            for (let i = 0; i < FactionObj.Rules.length; i++) {
                let IsFound = false
                for (let j = 0; j < data.faction_rules.length; j++) {
                    if (data.faction_rules[j].object_id == FactionObj.Rules[i].ID) {
                        const NewRuleProperty = new WarbandProperty(FactionObj.Rules[i], this, null, data.faction_rules[j]);
                        await NewRuleProperty.HandleDynamicProps(FactionObj.Rules[i], this, null, data.faction_rules[j]);
                        this.MyFactionRules.push(NewRuleProperty);
                        IsFound = true;
                        break;
                    }
                }
                if (IsFound == false) {
                    const NewRuleProperty = new WarbandProperty(FactionObj.Rules[i], this, null, null);
                    await NewRuleProperty.HandleDynamicProps(FactionObj.Rules[i], this, null, null);
                    this.MyFactionRules.push(NewRuleProperty);
                }
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

        let FactionData = null
        if (this.MyFaction) {
            FactionData = this.MyFaction.ConvertToInterface();
        } else {
            FactionData = {
                object_id: "",
                selections: []
            }
        }
        const _objint : IWarbandFaction = {
            contextdata : this.ContextKeys,            
            id: this.ID,
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags,
            faction_property: FactionData,
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
                static_packages[j].callpath.push("WarbandFaction")
                subpackages.push(static_packages[j])
            }
        }
        
        if (this.MyFaction) {
            const static_packages : ContextPackage[] = await this.MyFaction.GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                console.log(this.MyFaction.GetTrueName())
                console.log(static_packages[j])
                if (!static_packages[j].callpath.includes("StaticContextObject") || static_packages[j].callpath.includes("Selection")) {
                    static_packages[j].callpath.push("WarbandFaction")
                    subpackages.push(static_packages[j])
                }
            }
        }

        if (this.MyPatron != null) {
            const static_packages : ContextPackage[] = await this.MyPatron.GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandFaction")
                subpackages.push(static_packages[j])
            } 
        }

        return subpackages; 
    }

    public async FindAllPatronOptions() {
        const AllPatrons: Patron[] = [];
        const PatronList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "patronrelationship",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "faction_id",
                                value: this.MyFaction?.SelfDynamicProperty.OptionChoice.ID,
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IPatronRelationship[]

        for (let i = 0; i < PatronList.length; i++) {
            const Patron = await SkillFactory.CreateNewPatron(PatronList[i].id, this)
            AllPatrons.push(Patron);
        }

        return AllPatrons;
    }

    public async UpdatePatron(patorn_name : string) {
        if (patorn_name == "" ) {
            this.MyPatron = null;
        } else {
            const Patron = await SkillFactory.CreateNewPatron(patorn_name, this)
            this.MyPatron = Patron;
        }
    }

    public GetSelfName() {
        if (this.MyFaction != undefined) {
            if (this.MyFaction.SelfDynamicProperty.OptionChoice.Name) {
                return this.MyFaction.SelfDynamicProperty.OptionChoice.Name
            }
        }

        return '';
    }

    public GetModifierProperties() {
        const PropertyList : WarbandProperty[] = [];

        for (let i = 0; i < this.MyFactionRules.length; i++) {
            const FactionRule : Rule = this.MyFactionRules[i].SelfDynamicProperty.OptionChoice as Rule;
            PropertyList.push(this.MyFactionRules[i])
        }

        return PropertyList;
    }


}

export {IWarbandFaction, WarbandFaction}

