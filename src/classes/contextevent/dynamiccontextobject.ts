import { ContextObject } from "./contextobject";
import { ContextPackage } from "./contextpackage";

/**
 * Dynamic Context Objects refer to objects that contain
 * other objects, as well as information that may change
 * over time.
 */
class DynamicContextObject extends ContextObject {

    /**
     * Gets the event context packages of its sub objects
     * @param event_id the ID name of the event
     * @param source_obj where the event is being called from
     * @param arrs_extra any extra arguments unique to the call
     * @returns an array of context packages to be run by the even handler
     */
    public async GrabContextPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) { 
        
        const SubPackages : ContextPackage[] = await this.GrabSubPackages(event_id, source_obj, arrs_extra);
        
        for (let i = 0; i < SubPackages.length; i++) {
            SubPackages[i].callpath.push("DynamicContextObject")
            if (SubPackages[i].dyncontext == null) {
                SubPackages[i].dyncontext = this;
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