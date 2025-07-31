import { CompendiumItem, ICompendiumItemData, ItemType } from '../../CompendiumItem'
import { DescriptionFactory, GetWarbandOrNull } from '../../../utility/functions';
import { INote } from '../../Note';
import { IWarbandContextItem, WarbandContextItem } from './High_Level/WarbandContextItem';
import { DynamicOptionContextObject } from '../../options/DynamicOptionContextObject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { DynamicContextObject } from '../../contextevent/dynamiccontextobject';
import { StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextPackage } from '../../contextevent/contextpackage';
import { SelectedOption } from '../../options/SelectedOption';
import { IWarbandConsumable, WarbandConsumable } from './WarbandConsumable';
import { UserWarband } from './UserWarband';

interface IWarbandProperty {
    object_id: string,
    selections: ISelectedOption[]
    consumables : IWarbandConsumable[];
}

export interface ISelectedOption {
    option_refID : string,
    selection_ID : string | null,
    suboption? : IWarbandProperty
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

class WarbandProperty extends DynamicContextObject  {
    public SelfDynamicProperty! : DynamicOptionContextObject;
    public SubProperties : WarbandProperty[] = [];
    public Consumables : WarbandConsumable[] = [];
    public StoredSelectionVals : IWarbandProperty | null = null;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAction format
     */
    public constructor(base_obj : StaticOptionContextObject, parent : DynamicContextObject | null, dyna_obj : DynamicOptionContextObject | null, selection_vals: IWarbandProperty | null)
    {
        super(base_obj.SelfData, parent);
        this.ContextKeys = {}
        this.StoredSelectionVals = selection_vals;
    }

    public async SendConsumablesUp() {
        for (let i = 0; i < this.Consumables.length; i++) {
            if (this.Consumables[i].SelectItem != null) {
                const Warband = await GetWarbandOrNull(this.Consumables[i]);
                if (Warband != null) {
                    Warband.Consumables.push(this.Consumables[i])
                }
            }
        }
    }

    public HaveEmptyOptions() {

        for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
            if (this.SelfDynamicProperty.Selections[i].SelectedChoice == null) {
                return true;
            }
        }

        return false;
    }

    public async BuildConsumables(data: IWarbandConsumable[]) {
        if (this.MyContext != null && data != undefined) {
            for (let i = 0; i < data.length; i++) {
                const CurVal = data[i]
                const NewConsumable = new WarbandConsumable(CurVal, this.MyContext as UserWarband);
                await NewConsumable.GrabItem(CurVal);
                await NewConsumable.GrabOptions();
                this.Consumables.push(NewConsumable);
            }
        }
    }

    public async HandleDynamicProps(base_obj : StaticOptionContextObject, parent : DynamicContextObject | null, dyna_obj : DynamicOptionContextObject | null, selection_vals: IWarbandProperty | null) {

        if (dyna_obj != null) {
            this.SelfDynamicProperty = dyna_obj;
        } else {
            this.SelfDynamicProperty = new DynamicOptionContextObject(base_obj.SelfData, base_obj, this);  
            await this.SelfDynamicProperty.BuildSelections();  
        }
        
        if (selection_vals != null) {
            for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
                const CurSelection = this.SelfDynamicProperty.Selections[i];
                await CurSelection.GetSelectionChoices();
                for (let j = 0; j < selection_vals.selections.length; j++) {
                    if (selection_vals.selections[j].option_refID == CurSelection.Option.RefID) {
                        if (CurSelection.Option.AutoSelect == true && CurSelection.SelectionSet.length > 0) {
                            CurSelection.SelectOption(CurSelection.SelectionSet[0].id);
                        } else {
                            CurSelection.SelectOption(selection_vals.selections[j].selection_ID)
                        }
                        const subselect = selection_vals.selections[j].suboption;
                        if (subselect != undefined) {
                            await this.GenerateSubProperties(subselect, CurSelection)
                        }
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
                const CurSelection = this.SelfDynamicProperty.Selections[i];
                await CurSelection.GetSelectionChoices();
                if (CurSelection.Option.AutoSelect == true && CurSelection.SelectionSet.length > 0) {
                    CurSelection.SelectOption(CurSelection.SelectionSet[0].id);
                }
            }
        }
    }

    // ITS IN HERE, KILL IT
    public async GenerateSubProperties(selection_vals: IWarbandProperty, self_selection : SelectedOption) {
        const Nested = self_selection.NestedOption
        if (Nested != null) {
            let found = false
            for (let i = 0; i < this.SubProperties.length; i++) {
                if (this.SubProperties[i].ID == Nested.OptionChoice.ID) {
                    found = true;
                    const NewSkill = this.SubProperties[i]
                    await NewSkill.HandleDynamicProps(Nested.OptionChoice, this, Nested, selection_vals)
                    await NewSkill.BuildConsumables(selection_vals.consumables)
                    break;
                }
            }
            if (found == false) {
                const NewSkill = new WarbandProperty(Nested.OptionChoice, this, Nested, selection_vals);
                await NewSkill.HandleDynamicProps(Nested.OptionChoice, this, Nested, selection_vals)
                await NewSkill.BuildConsumables(selection_vals.consumables)
                this.SubProperties.push(NewSkill);
            }
        }
    }

    public async RegenerateSubProperties( ) {
        this.ConvertToInterface();
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
                        selections: selectionarray,
                        consumables: []
                        });
                    await NewSkill.HandleDynamicProps(CurSelection.NestedOption.OptionChoice, 
                        this, 
                        CurSelection.NestedOption, 
                        {
                        object_id: CurSelection.Option.RefID,
                        selections: selectionarray,
                        consumables: []
                        })
                    RegenProperties.push(NewSkill);
                }
            }
        }
        this.SubProperties = RegenProperties;
    }

    public async SelectSelfOption(selection_index : number, selection_id : string) {
        if (this.SelfDynamicProperty.Selections[selection_index] != undefined) {
            this.SelfDynamicProperty.Selections[selection_index].SelectOption(selection_id);
            await this.RegenerateSubProperties();
            await this.RegenerateOptions();
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
                for (let j = 0; j < this.SubProperties.length; j++) {
                    if (this.SubProperties[j].SelfDynamicProperty == sel_item.NestedOption) {
                        warband_subitem = this.SubProperties[j].ConvertToInterface();
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

        const consumablelist : IWarbandConsumable[] = [];
        for (let i = 0; i < this.Consumables.length; i++) {
            consumablelist.push(this.Consumables[i].ConvertToInterface())
        }

        const _objint : IWarbandProperty = {
            object_id: this.SelfDynamicProperty.OptionChoice.ID,
            selections: selectionarray,
            consumables: consumablelist
        }

        this.SelfData = _objint;
        this.StoredSelectionVals = _objint;
        
        return _objint;
    }

    public async RegenerateOptions() {
        await this.SelfDynamicProperty.ReloadOption();
        for (let i = 0; i < this.Consumables.length; i++) {
            await this.Consumables[i].GrabOptions()
        }
        
        await this.ReSelectPicks();
    }

    public async ReSelectPicks() {
        this.ConvertToInterface();
        const selection_vals = this.StoredSelectionVals
        
        if (selection_vals != null) {
            for (let i = 0; i < this.SelfDynamicProperty.Selections.length; i++) {
                const CurSelection = this.SelfDynamicProperty.Selections[i];
                await CurSelection.GetSelectionChoices();
                for (let j = 0; j < selection_vals.selections.length; j++) {
                    if (selection_vals.selections[j].option_refID == CurSelection.Option.RefID) {
                        if (CurSelection.Option.AutoSelect == true && CurSelection.SelectionSet.length > 0) {
                            CurSelection.SelectOption(CurSelection.SelectionSet[0].id);
                        } else {
                            CurSelection.SelectOption(selection_vals.selections[j].selection_ID)
                        }
                        const subselect = selection_vals.selections[j].suboption;
                        if (subselect != undefined) {
                            await this.GenerateSubProperties(subselect, CurSelection)
                        }
                        break;
                    }
                }
            }
        }
    }
    
    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const static_packages : ContextPackage[] = await this.SelfDynamicProperty.GrabContextPackages(event_id, source_obj, arrs_extra);
        for (let i = 0; i < static_packages.length; i++) {
            static_packages[i].callpath.push("WarbandProperty")
        }
        return static_packages;
    }

    public GetOwnDescription() {
        if (Object.prototype.hasOwnProperty.call(this.SelfDynamicProperty.OptionChoice, 'Description')) {
            return (this.SelfDynamicProperty.OptionChoice as any).Description;
        }
        return null;
    }

    public GetOwnName() {
        return (this.SelfDynamicProperty.OptionChoice).GetTrueName();
    }

    public GetOwnID() {
        return (this.SelfDynamicProperty.OptionChoice).GetID();
    }

}

export {IWarbandProperty, WarbandProperty}

