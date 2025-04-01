import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { DescriptionFactory } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './WarbandContextItem';
import { DynamicOptionContextObject } from '../../options/DynamicOptionContextObject';
import { IContextObject } from '../../contextevent/contextobject';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { StaticOptionContextObject } from '../../options/StaticOptionContextObject';

interface IWarbandProperty {
    object_id: string,
    selections: ISelectedOption[]
}

interface ISelectedOption {
    option_refID : string,
    selection_ID : number | null;
}

class WarbandProperty  {
    public SelfDynamicProperty : DynamicOptionContextObject;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(selection_vals: IWarbandProperty, base_obj : StaticOptionContextObject, parent : DynamicContextObject | null)
    {
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

}

export {IWarbandProperty, WarbandProperty}

