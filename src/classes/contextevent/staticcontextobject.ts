import { ContextObject } from "./contextobject";
import { ContextPackage } from "./contextpackage";

/**
 * Static Context Objects are intended to be the base
 * level components comprising a larger Dynamic object.
 */
class StaticContextObject extends ContextObject {

    /**
     * Gets the event context packages of itself and any sub objects
     * @param event_id the ID name of the event
     * @param source_obj where the event is being called from
     * @param arrs_extra any extra arguments unique to the call
     * @returns an array of context packages to be run by the even handler
     */
    public async GrabContextPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) { 
        const StaticEvents : ContextPackage[] = [];
        if (this.ContextData) {         
            for (const key of Object.keys(this.ContextKeys)) {
                const context_entry = this.ContextData[key]
                if (context_entry == undefined) {continue;}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - dynamic lookup
                const func = context_entry[event_id];
                if (func !== undefined) {
                    const curr_package : ContextPackage = {
                        priority    : context_entry.event_priotity,
                        source      : source_obj,
                        self        : this,
                        callback    : func,
                        callbackdict: this.ContextKeys[key],
                        dyncontext  : this.MyContext,
                        callpath    : ["StaticContextObject"]
                    }

                    StaticEvents.push(curr_package);
                }                
             }
        }
        const SubPackages : ContextPackage[] = await this.GrabSpecialPackages(event_id, source_obj, arrs_extra);

        for (let i = 0; i < SubPackages.length; i++) {
            SubPackages[i].callpath.push("StaticContextObject");
            StaticEvents.push(SubPackages[i]);
        }
 
        return StaticEvents; 
    }
    
    /**
     * Grabs any additional packages unique to
     * class implementation.
     */
    public async GrabSpecialPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { return []; }

}

export {StaticContextObject}