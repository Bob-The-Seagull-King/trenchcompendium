import { ContextEventEntry } from "../../resources/staticcontext/contexteventtypes";
import { ContextObject } from "./contextobject";
import { DynamicContextObject } from "./dynamiccontextobject";

interface ContextPackage {
	priority    : number;   // The priority for the event, determining which order events take place in.
    source      : any; // The source of the event
    self        : ContextObject;      // The origin object of the event function
    callback    : any;      // The function that will be called as a part of this event.
    callbackdict: ContextEventEntry;     // Any additional information that comes with the function
    dyncontext  : DynamicContextObject | null;     // The event function origin's parent context (or null)
}

export {ContextPackage}