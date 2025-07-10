import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './High_Level/WarbandContextItem';
import { DynamicOptionContextObject } from '../../options/DynamicOptionContextObject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextPackage } from '../../contextevent/contextpackage';
import { SelectedOption } from '../../options/SelectedOption';
import { IChoice } from '../../options/StaticOption';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { EventRunner } from '../../contextevent/contexteventhandler';

interface IWarbandConsumable extends IContextObject {
    associate_id : string,
    object_id: string | null,
    object_type : string | null
}

/**
 * basic dunamicoptioncontextobject should be modified so any given selection
 * can contain a basic object IF its selection is one, and if the selected object
 * is a staticoptioncontextobject, it will instead generate a dynamicoptioncontextobject
 * to store as its basic object
 * 
 * then the warbandproperty should be able to generate properties based on the
 * selections where each dynamicoptioncontextobject has its own warband property
 * associated with their respective parent warbandproperty for conversion purposes
 * 
 * the warbandproperty interface can have an optional iselectoption param for furter iwarbandproperty
 * for deconstruction and construction
 */

class WarbandConsumable extends DynamicContextObject  {
    public SelectItem : ContextObject | null = null;
    public AssociateID : string;
    public SelectType : string | null = null;
    public Options : IChoice[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(base_obj : IWarbandConsumable, parent : DynamicContextObject | null)
    {
        super(base_obj, parent);
        this.AssociateID = base_obj.associate_id;
        this.SelectType = base_obj.object_type;
    }

    public async OnSelect(option : IChoice) {
        this.SelectItem = option.value;
        
        const eventmon : EventRunner = new EventRunner();
        await eventmon.runEvent(
            "runConsumableSelect",
            this,
            [this.MyContext],
            null,
            this
        )
    }

    public async GrabOptions() {
        const eventmon : EventRunner = new EventRunner();
        this.Options = await eventmon.runEvent(
            "getConsumableOptionsList",
            this,
            [this.MyContext],
            [],
            this
        )
    }

    public async GrabItem(warband_data : IWarbandConsumable) {
        console.log("Consumable : Grab Item")
        console.log(warband_data);
        if (warband_data.object_id && warband_data.object_type) {
            switch (warband_data.object_type) {
                case "faction_equipment":
                    this.SelectItem = await EquipmentFactory.CreateNewFactionEquipment(warband_data.object_id, null)
                    this.SelectType = warband_data.object_id
                    return;
                default:
                    return;
            }
        }
    }

    
    public ConvertToInterface() {

        const _objint : IWarbandConsumable = {
            id: this.ID, // The id of the item
            name: this.GetTrueName(), // The name of the item
            source: this.Source? this.Source : "", // The source of the item (core book, homebrew, etc)
            tags: this.Tags,
            contextdata: this.ContextKeys,
            associate_id : this.AssociateID,
            object_id: this.SelectItem? this.SelectItem.ID : null,
            object_type: this.SelectType? this.SelectType : null
        }
        
        return _objint;
    }

    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> {
        
        const SubPackages : ContextPackage[] = []

         if (this.ContextData) {            
            for (const key of Object.keys(this.ContextKeys)) {
                const context_entry = this.ContextData[key]
                if (context_entry == undefined) {continue;}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - dynamic lookup
                const func = context_entry[event_id];
                if (func !== undefined) {
                    const curr_package : ContextPackage = {
                        priority    : context_entry.event_priotity,
                        source      : source_obj,
                        self        : this,
                        callback    : func,
                        callbackdict: this.ContextKeys[key],
                        dyncontext  : this.MyContext,
                        callpath    : ["DynamicContextObject"]
                    }

                    SubPackages.push(curr_package);
                }                
             }
        }

        return SubPackages;
    }

    public GetOwnDescription() {
        if (Object.prototype.hasOwnProperty.call(this.SelectItem, 'Description')) {
            return (this.SelectItem as any).Description;
        }
        return null;
    }

    public GetOwnName() {
        if (this.SelectItem != null) {
            return (this.SelectItem).GetTrueName();
        } else {
            return "";
        }
    }

}

export {IWarbandConsumable, WarbandConsumable}

