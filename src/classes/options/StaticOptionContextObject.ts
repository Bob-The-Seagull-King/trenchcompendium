import { ContextObject, IContextObject } from "../contextevent/contextobject";
import { StaticOptionFactory } from "../../factories/features/StaticOptionFactory";
import { StaticContextObject } from "../contextevent/staticcontextobject";
import { IStaticOption, StaticOption } from "./StaticOption";
import { EventRunner } from "../contextevent/contexteventhandler";

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

    public constructor(data : IStaticOptionContextObject, parent : ContextObject | null) {
        super(data, parent)
        this.MyOptions = this.BuildOptions(data.options)
    }
    
    
    public async RunOptionsParse() {
        
        const EventProc : EventRunner = new EventRunner();
        for (let i = 0; i < this.MyOptions.length; i++) {
            const result_a = await EventProc.runEvent(
                "parseOptionFilterDown",
                this,
                [],
                this.MyOptions[i].Selections,
                i
            )
            this.MyOptions[i].Selections = result_a;
            const result_b = await EventProc.runEvent(
                    "parseOptionsIntoRelevantType",
                    this,
                    [],
                    this.MyOptions[i].Selections,
                    i
                )
            this.MyOptions[i].Selections = result_b;
        }
    }

    /**
     * Construct a series of options. These options are
     * not initialized with their selections available.
     */
    public BuildOptions(data : IStaticOption[]) {
        const OptionSet : StaticOption[] = []

        if (data != undefined) {
            for (let i = 0; i < data.length; i++) {
                const newOption : StaticOption = StaticOptionFactory.CreateStaticOption(data[i], this)
                OptionSet.push(newOption);
            }
        }

        return OptionSet;
    }

    /**
     * Have all options search for potential selections
     * to choose from.
     */
    public async ReloadOptions() {
        for (let i = 0; i < this.MyOptions.length; i++) {
            this.MyOptions[i].Selections = await this.MyOptions[i].FindChoices();
        }
        await this.RunOptionsParse();
    }


}

export {IStaticOptionContextObject, StaticOptionContextObject}