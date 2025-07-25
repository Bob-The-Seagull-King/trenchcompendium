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
import { Equipment } from "../../../feature/equipment/Equipment";
import { EventRunner } from "../../../contextevent/contexteventhandler";
import { WarbandMember } from "./WarbandMember";
import { Keyword } from "../../../feature/glossary/Keyword";
import { RealWarbandPurchaseModel, WarbandPurchase } from "./WarbandPurchase";
import { containsTag } from "../../../../utility/functions";

interface IWarbandEquipment extends IContextObject {
    equipment_id: IWarbandProperty,
    subproperties : IWarbandProperty[]
}

export interface WarbandEquipmentCache {
    CanRemove : boolean,
    CanSwap : boolean,
    KeywordsCache : Keyword[],
    range: number
}

class WarbandEquipment extends DynamicContextObject {
    MyEquipment!: WarbandProperty;
    SubProperties : WarbandProperty[] = [];
    EquipmentCache : WarbandEquipmentCache | null = null;

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
        const Value = await EquipmentFactory.CreateNewEquipment(equipment_property.object_id, this, true);
        this.MyEquipment = new WarbandProperty(Value, this, null, equipment_property);
        await this.MyEquipment.HandleDynamicProps(Value, this, null, equipment_property)
        await this.MyEquipment.BuildConsumables(equipment_property.consumables)
    }
    
    public IsTagPresent(id : string) {
        const tags = this.Tags
        const subtags = this.GetEquipmentItem().Tags
        return ((containsTag(tags, id)) || (containsTag(subtags, id)))
    }
    
    public async BuildNewProperties(fighter : WarbandMember, Purchase : WarbandPurchase) {
        
        const eventmon : EventRunner = new EventRunner();
        const CanRemove = await eventmon.runEvent(
            "canRemoveItemFromModel",
            this,
            [],
            Purchase.Sellable,
            fighter
        )

        const noSwap = await eventmon.runEvent(
            "cantSwapItemFromModel",
            this,
            [],
            false,
            fighter
        )

        const keywords = await eventmon.runEvent(
            "findFinalKeywordsForEquipment",
            fighter,
            [this],
            this.GetEquipmentItem().GetKeyWords(),
            null
        )

        const rangenew = await eventmon.runEvent(
            "getnewrange",
            fighter,
            [this],
            this.GetEquipmentItem().Distance,
            null
        )

        this.EquipmentCache = {
            CanRemove: CanRemove,
            CanSwap: noSwap,
            KeywordsCache : keywords,
            range: rangenew
        }
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
                selections: [],
                consumables: []
            }
        }

        const _objint : IWarbandEquipment = {
            contextdata : this.ContextKeys,            
            id: this.ID,
            name: this.Name != undefined? this.Name : "",
            source: this.Source != undefined? this.Source : "",
            tags: this.Tags,
            equipment_id: EquipmentDat,
            subproperties : subpropset  
        }
        this.SelfData = _objint;
        return _objint;
    }
    

    public async GetKeywords() : Promise<Keyword[]> {
        
        if (this.MyContext instanceof WarbandMember) {
        const eventmon : EventRunner = new EventRunner();
            const keywords = await eventmon.runEvent(
                "findFinalKeywordsForEquipment",
                this.MyContext,
                [this],
                this.GetEquipmentItem().GetKeyWords(),
                null
            )
            return keywords;
        } else {
            return this.GetEquipmentItem().GetKeyWords();
        }
    }

    /**
     *  Return Range as String
     */
    GetRange () {
        if (this.EquipmentCache) {
            let rangestring = '';

            if( this.EquipmentCache?.range ) {
                rangestring += this.EquipmentCache?.range+'"';
            }

            if( this.EquipmentCache?.range && this.GetEquipmentItem().Stats.melee ) {
                rangestring += ' / ';
            }

            if( this.GetEquipmentItem().Stats.melee ) {
                rangestring += 'Melee';
            }
            return rangestring;
        } else {
            return this.GetEquipmentItem().GetRange();
        }
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
                static_packages[j].callpath.push("WarbandEquipment")
                subpackages.push(static_packages[j])
            }
        }        

        for (let i = 0; i < this.SubProperties.length; i++) {
            const static_packages : ContextPackage[] = await this.SubProperties[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < static_packages.length; j++) {
                static_packages[j].callpath.push("WarbandEquipment")
                subpackages.push(static_packages[j])
            }
        } 

        return subpackages; 
    }

    public GetSubCosts(type : number, overridecap = false) {
        return 0;
    }

    public GetEquipmentItem() : Equipment {
        return this.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment
    }

}

export {IWarbandEquipment, WarbandEquipment}

