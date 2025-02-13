import { StaticOption, StaticOptionContextObjectQuestion } from "../../classes/options/StaticOption";
import { EventRunner } from "../../classes/contextevent/contexteventhandler";
import { DynamicContextObject } from "../../classes/contextevent/dynamiccontextobject";
import { ContextObject } from "../../classes/contextevent/contextobject";

/**
 * Events that can be called by the runEvent method,
 * all options components of the interfaces that ineherit them.
 */
export interface CallEvents {
    event_priotity : number,
    genericEvent? : (this: EventRunner, eventSource : any, trackVal : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<void>, // Generic all-purpose event, avoid using if possible
    genericReturnEvent? : (this: EventRunner, eventSource : any, relayVar : any, trackVal : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<any>; // Generic all-purpose event if you want a value returned, avoid using if possible
    optionSearchEvent? : (this: EventRunner, eventSource : any, relayVar : ContextObject[], trackVal : StaticOptionContextObjectQuestion, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, ) => Promise<ContextObject[]> // When being searched by an Option, use this to determine if an object should be added to their selections
}

/**
 * Events used by Option objects to generate selections
 */
export interface OptionEvents {
    genericReturn : (self_item: StaticOption, context_func : ContextEventEntry, input : string) => string // Basic return, just sends the string
    genericResultReturn : (self_item: StaticOption, context_func : ContextEventEntry, input : any) => string // Basic search result return
}

export interface CallEventTable {[tokenid: string]: CallEvents}
export interface OptionEventTable {[tokenid: string]: OptionEvents}

export type ContextEventVals = {[type : string]: ContextEventEntry};
export type ContextEventEntry = {[type : string]: any};