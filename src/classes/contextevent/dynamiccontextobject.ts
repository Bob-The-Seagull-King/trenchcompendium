import { ContextObject } from "./contextobject";
import { ContextPackage } from "./contextpackage";

/**
 * Dynamic Context Objects refer to objects that contain
 * other objects, as well as information that may change
 * over time.
 */
class DynamicContextObject extends ContextObject {

    public async GrabContextPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) { 
        
        const SubPackages : ContextPackage[] = await this.GrabSubPackages(event_id, source_obj, arrs_extra);

        for (let i = 0; i < SubPackages.length; i++) {
            if (SubPackages[i].dyncontext == null) {
                SubPackages[i].dyncontext = this;
            }
        }

        if (this.ContextData) {            
            for (const key of Object.keys(this.ContextKeys)) {
                const context_entry = this.ContextData[key]
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
                        dyncontext  : this.MyContext
                    }

                    SubPackages.push(curr_package);
                }                
             }
        }

        return SubPackages;
    }

    /**
     * Grabs the packages from any sub-objects, based
     * on class implementation.
     */
    public async GrabSubPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { return []; }

}

export {DynamicContextObject}