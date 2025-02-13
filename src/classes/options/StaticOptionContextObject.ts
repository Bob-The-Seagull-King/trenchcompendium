import { IContextObject } from "../contextevent/contextobject";
import { StaticOptionFactory } from "../../factories/features/StaticOptionFactory";
import { StaticContextObject } from "../contextevent/staticcontextobject";
import { IStaticOption, StaticOption } from "./StaticOption";
import { DynamicContextObject } from "../contextevent/dynamiccontextobject";

interface IStaticOptionContextObject extends IContextObject {
    options : IStaticOption[]
}

/*
StaticOptionContextObjects are static objects which contain some
number of options to select from, generated upon construction.

Some Options include questions to generate selection options, which
use this object to grab the relevant context source for event handling.
*/
class StaticOptionContextObject extends StaticContextObject {
    public MyOptions : StaticOption[];

    public constructor(data : IStaticOptionContextObject, parent : DynamicContextObject | null) {
        super(data, parent)

        this.MyOptions = this.BuildOptions(data.options)
    }

    /**
     * Construct a series of options. These options are
     * not initialized with their selections available.
     */
    public BuildOptions(data : IStaticOption[]) {
        const OptionSet : StaticOption[] = []

        for (let i = 0; i < data.length; i++) {
            const newOption : StaticOption = StaticOptionFactory.CreateStaticOption(data[i], this)
            OptionSet.push(newOption);
        }

        return OptionSet;
    }

    /**
     * Have all options search for potential selections
     * to choose from.
     */
    public async ReloadOptions() {
        for (let i = 0; i < this.MyOptions.length; i++) {
            await this.MyOptions[i].FindChoices();
        }
    }


}

export {IStaticOptionContextObject, StaticOptionContextObject}