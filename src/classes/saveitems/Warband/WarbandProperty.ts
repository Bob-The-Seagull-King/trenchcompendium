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

interface IWarbandProperty {
    object_id: string,
    selections: ISelectedOption[]
}

interface ISelectedOption {
    option_refID : string,
    selection_ID : number | null,
    suboption? : IWarbandProperty
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
    public SubProperties : WarbandProperty[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(base_obj : StaticOptionContextObject, parent : DynamicContextObject | null, dyna_obj : DynamicOptionContextObject | null, selection_vals: IWarbandProperty | null)
    {
        super(base_obj.SelfData, parent);
        if (dyna_obj != null) {
            this.SelfDynamicProperty = dyna_obj;
        } else {
            this.SelfDynamicProperty = new DynamicOptionContextObject(base_obj.SelfData, base_obj, parent);
        }

        if (selection_vals != null) {
            for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
                const CurSelection = this.SelfDynamicProperty.Selections[i];
                for (let j = 0; j < selection_vals.selections.length; j++) {
                    if (selection_vals.selections[j].option_refID == CurSelection.Option.RefID) {
                        CurSelection.SelectOption(selection_vals.selections[j].selection_ID)
                        const subselect = selection_vals.selections[j].suboption;
                        if (subselect != undefined) {
                            this.GenerateSubProperties(subselect, CurSelection)
                        }
                        break;
                    }
                }
            }
        }
    }

    public GenerateSubProperties(selection_vals: IWarbandProperty, self_selection : SelectedOption) {
        const Nested = self_selection.NestedOption
        if (Nested != null) {
            const NewSkill = new WarbandProperty(Nested.OptionChoice, this, Nested, selection_vals);
            this.SubProperties.push(NewSkill);
        }
    }

    public RegenerateSubProperties( ) {
        const RegenProperties : WarbandProperty[] = []
        for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
            const CurSelection = this.SelfDynamicProperty.Selections[i]
            let IsFound = false;
            if (CurSelection.NestedOption != null) {
                for (let j = 0; j < this.SubProperties.length; j++) {
                    if (this.SubProperties[j].SelfDynamicProperty == CurSelection.NestedOption) {
                        IsFound = true;
                        RegenProperties.push(this.SubProperties[j]);
                        break;
                    }
                }
                if (IsFound == false) {
                    const selectionarray : ISelectedOption[] = [];                    
                    const NewSkill = new WarbandProperty(
                        CurSelection.NestedOption.OptionChoice, 
                        this, 
                        CurSelection.NestedOption, 
                        {
                        object_id: CurSelection.Option.RefID,
                        selections: selectionarray
                        });
                    RegenProperties.push(NewSkill);
                }
            }
        }
        this.SubProperties = RegenProperties;
    }

    public SelectSelfOption(selection_index : number, selection_id : number) {
        if (this.SelfDynamicProperty.Selections[selection_index] != undefined) {
            this.SelfDynamicProperty.Selections[selection_index].SelectOption(selection_id);
            this.RegenerateSubProperties();
        }
    }

    public ConvertToInterface() {
        const selectionarray : ISelectedOption[] = [];
        for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
            const sel_item = this.SelfDynamicProperty.Selections[i]
            const sel_val = sel_item.SelectedChoice;
            let sel_id = null
            if (sel_val != undefined) { if (sel_val != null) { sel_id = sel_val.id; } }
            let warband_subitem = null;
            if (sel_item.NestedOption != null) {
                for (let j = 0; j < this.SubProperties.length; i++) {
                    if (this.SubProperties[i].SelfDynamicProperty == sel_item.NestedOption) {
                        warband_subitem = this.SubProperties[i].ConvertToInterface();
                        break;
                    }
                }
            }
            if (warband_subitem == null) {
                selectionarray.push(
                    {                    
                        option_refID : this.SelfDynamicProperty.Selections[i].Option.RefID,
                        selection_ID : sel_id
                    }
                )
            } else {                
                selectionarray.push(
                    {                    
                        option_refID : this.SelfDynamicProperty.Selections[i].Option.RefID,
                        selection_ID : sel_id,
                        suboption   : warband_subitem
                    }
                )
            }
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

