import { DynamicOptionContextObject } from "./DynamicOptionContextObject";
import { IChoice, StaticOption } from "./StaticOption"

/*
In a DynamicOptionContextObject, each option in the respective
StaticOptionContextObject has a corresponding SelectedOption, which
contains the StaticOption, a reference to the relevant StaticOptionContextObject,
and option-selection tech.
*/
class SelectedOption {

    public Option : StaticOption;
    public SelectedChoice : IChoice | null = null;
    public MyParent : DynamicOptionContextObject;

    public constructor(option : StaticOption, parent : DynamicOptionContextObject) {
        this.Option = option;
        this.MyParent = parent;
    }

    /**
     * Given a specific id, set the current choice
     * to one of this object's Option's selections.
     */
    public SelectOption(_id : number) {
        for (let i = 0; i < this.Option.Selections.length; i++) {
            if (this.Option.Selections[i].id == _id) {
                this.SelectedChoice = this.Option.Selections[i]
                break;
            }
        }
    }

}

export {SelectedOption}