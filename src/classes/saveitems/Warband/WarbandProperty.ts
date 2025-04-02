import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './High_Level/WarbandContextItem';
import { DynamicOptionContextObject } from '../../options/DynamicOptionContextObject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextPackage } from '../../contextevent/contextpackage';

interface IWarbandProperty {
    object_id: string,
    selections: ISelectedOption[]
}

interface ISelectedOption {
    option_refID : string,
    selection_ID : number | null;
}

///// TODO

///// HANDLE EXTRA PROPERTY WHEN SELECTED WARBANDPROPERTY OPTION IS ITSELF SOMETHING WITH OPTIONS
///// Property collect all subproperties loop including parents
///// Base selected objects are included in context events, but their subselected options aren't
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

class WarbandProperty extends DynamicContextObject  {
    public SelfDynamicProperty : DynamicOptionContextObject;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(selection_vals: IWarbandProperty, base_obj : StaticOptionContextObject, parent : DynamicContextObject | null)
    {
        super(base_obj.SelfData, parent);
        this.SelfDynamicProperty = new DynamicOptionContextObject(base_obj.SelfData, base_obj, parent)

        for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
            const CurSelection = this.SelfDynamicProperty.Selections[i];
            for (let j = 0; j < selection_vals.selections.length; j++) {
                if (selection_vals.selections[j].option_refID == CurSelection.Option.RefID) {
                    CurSelection.SelectOption(selection_vals.selections[j].selection_ID)
                    break;
                }
            }
        }
    }

    public ConvertToInterface() {
        const selectionarray : ISelectedOption[] = [];
        for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
            const sel_val = this.SelfDynamicProperty.Selections[i].SelectedChoice;
            let sel_id = null
            if (sel_val != undefined) { if (sel_val != null) { sel_id = sel_val.id; } }
            selectionarray.push(
                {                    
                    option_refID : this.SelfDynamicProperty.Selections[i].Option.RefID,
                    selection_ID : sel_id
                }
            )
        }

        const _objint : IWarbandProperty = {
            object_id: this.SelfDynamicProperty.OptionChoice.ID,
            selections: selectionarray
        }
        
        return _objint;
    }
    
    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const static_packages : ContextPackage[] = await this.SelfDynamicProperty.GrabContextPackages(event_id, source_obj, arrs_extra);
        return static_packages;
    }

}

export {IWarbandProperty, WarbandProperty}

