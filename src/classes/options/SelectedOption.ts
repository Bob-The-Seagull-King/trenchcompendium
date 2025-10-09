import { EventRunner } from "../contextevent/contexteventhandler";
import { DynamicOptionContextObject } from "./DynamicOptionContextObject";
import { IChoice, StaticOption } from "./StaticOption"
import { StaticOptionContextObject } from "./StaticOptionContextObject";
import { UserWarband } from "../saveitems/Warband/UserWarband";
import { GetWarbandOrNull } from "../../utility/functions";

/*
In a DynamicOptionContextObject, each option in the respective
StaticOptionContextObject has a corresponding SelectedOption, which
contains the StaticOption, a reference to the relevant StaticOptionContextObject,
and option-selection tech.
*/
class SelectedOption {

    public Option : StaticOption;
    public SelectionSet : IChoice[] = [];
    public SelectedChoice : IChoice | null = null;
    public MyParent : DynamicOptionContextObject;
    public NestedOption : DynamicOptionContextObject | null = null;
    public SelectedID : null | string = null;

    public constructor(option : StaticOption, parent : DynamicOptionContextObject) {
        this.Option = option;
        this.MyParent = parent;
    }

    // Re-grab options available to it from the Option object
    public async GetSelectionChoices() {
        this.SelectionSet = this.Option.Selections;
    }

    // Get the display-suitable string for its selected option, or "" if not possible
    public GetSelectedTitle() {
        if (this.SelectedChoice != null) {
            return this.SelectedChoice.display_str;
        }
        return "";
    }

    // Return the selected IChoice
    public GetSelected() {
        return this.SelectedChoice;
    }

    // See if the selected option is allowed to be changed.
    // All selections can be changed if null, but Options with single set to TRUE
    // cannot be changed once an option is selected
    public CanChange() {
        return (this.Option.Single == false || this.SelectedChoice == null)
    }

    // Update the selected choice by the ID of that choice
    // use this when we want the change to trigger something, such as user action
    public async UserUpdateSelection(_id : string | null) {
        this.SelectOption(_id)
        
        const warband : UserWarband | null = await GetWarbandOrNull(this.MyParent)
        const Events = new EventRunner()
        await Events.runEvent(
            "onSelectPropertyValue",
            this.MyParent,
            [this.MyParent, warband],
            null,
            this
        )
    }

    /**
     * Given a specific id, set the current choice
     * to one of this object's Option's selections.
     */
    public SelectOption(_id : string | null) {
        this.SelectedID = _id;
        if (_id == null) {
            this.SelectedChoice = null;
            this.NestedOption = null;
        } else {
        for (let i = 0; i < this.SelectionSet.length; i++) {
            if (this.SelectionSet[i].id == _id) {
                this.SelectedChoice = this.SelectionSet[i]
                const SelectedVal = this.SelectedChoice.value;
                if ((SelectedVal instanceof StaticOptionContextObject)) {
                    SelectedVal.MyContext = this.MyParent;
                    this.HandleObjectDynamics(this.SelectedChoice);
                } else {
                    this.NestedOption = null;
                }
                break;
            }
        }}
    }

    // If relevant create and build a nested option, if the choice
    // selected needs one.
    public async HandleObjectDynamics(choice_selected : IChoice) {
        this.NestedOption = new DynamicOptionContextObject(choice_selected.value.SelfData, choice_selected.value, this.MyParent);
        await this.NestedOption.BuildSelections();
    }

}

export {SelectedOption}