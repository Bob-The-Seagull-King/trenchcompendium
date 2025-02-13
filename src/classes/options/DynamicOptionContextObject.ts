import { ContextPackage } from "../contextevent/contextpackage";
import { ContextObject, IContextObject } from "../contextevent/contextobject";
import { DynamicContextObject } from "../contextevent/dynamiccontextobject";
import { SelectedOption } from "./SelectedOption";
import { StaticOptionContextObject } from "./StaticOptionContextObject";

/*
DynamicOptionContextObjects are solely used to apply Context
to objects with options.

IE, a Block is an option static object, when applied to a part a
BlockInContext object is created with a relevant static object that
handles selecting relevant options.

Should only be concerned with a single Static Object each.
*/
class DynamicOptionContextObject extends DynamicContextObject {
    public OptionChoice: StaticOptionContextObject;
    public Selections : SelectedOption[] = [];

    public constructor(data : IContextObject, option_obj : StaticOptionContextObject, parent :  DynamicContextObject | null) {
        super(data, parent);
        this.OptionChoice = option_obj;

        for (let i = 0; i < this.OptionChoice.MyOptions.length; i++) {
            const NewSelection : SelectedOption = new SelectedOption(this.OptionChoice.MyOptions[i], this);
            this.Selections.push(NewSelection);
        }
    }

    /**
     * Have all suboptions reload their selections.
     */
    public async ReloadOption() {
        await this.OptionChoice.ReloadOptions();
    }

    /**
     * Grabs sub packages, also includes any selected context objects
     * if one is available.
     * 
     * Ie. If a selection includes a specific StaticContextObject, it
     * will be included in events.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const subpackages : ContextPackage[] = []
        
        const static_packages : ContextPackage[] = await this.OptionChoice.GrabContextPackages(event_id, source_obj, arrs_extra);
        for (let j = 0; j < static_packages.length; j++) {
            subpackages.push(static_packages[j])
        }

        for (let i = 0; i < this.Selections.length; i++) {
            if (this.Selections[i].SelectedChoice != null) {
                if (this.Selections[i].SelectedChoice?.value instanceof ContextObject) {
                    const static_packages : ContextPackage[] = await this.Selections[i].SelectedChoice?.value.GrabContextPackages(event_id, source_obj, arrs_extra);
                    for (let j = 0; j < static_packages.length; j++) {
                        subpackages.push(static_packages[j])
                    }
                }
            }
            
        }

        return subpackages; 
    }

}

export {DynamicOptionContextObject}