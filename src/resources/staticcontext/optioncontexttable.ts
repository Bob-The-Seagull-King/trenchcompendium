import { OptionEventTable, ContextEventEntry } from "./contexteventtypes";
import { StaticOption } from "../../classes/options/StaticOption";

export const OptionCallTable : OptionEventTable = {
    basic_option_default : {        
        genericReturn(self_item: StaticOption, context_func : ContextEventEntry, input : string) {
            return input;
        },
        genericResultReturn(self_item: StaticOption, context_func : ContextEventEntry, input : any) {
            if (input.name) {
                return input.name;
            } else if (input.id) {
                return input.id;
            } else {return ""}
        }
    }
}