import { ContextObject } from "./contextobject";
import { ContextPackage } from "./contextpackage";

class EventRunner {

    /**
     * Core function for handling complex interactions between objects, this can be
     * used to marry a bunch of different data types together with singular functions.
     * 
     * When an event is run, a source object is used as the 'start' of the search tree.
     * How sub-objects are gathered is based on the class of the source.
     * 
     * Objects will use all members of their ContextKeys as the keys in an event dictionary.
     * If that key has the function decided by event_id then it will create a context package
     * (giving the function to run, and some information from that object to help run it) and
     * add it to the array of context packages to go through.
     * 
     * Context Packages are then sorted by an event-priority value and run in succession.
     * 
     * The relayVar provided, if non-null, will be iteratively sent through these packages. 
     * For example the output of Package_01 will be input into Package_02 etc etc. After all
     * packages have been run through the output of Package_XX will be returned from this function.
     * 
     * @param event_id the string name of the function to run.
     * @param source_obj the object which serves as the start of the context-package gathering
     * @param arrs_extra any additional parameters specific to this question
     * @param relayVar potentially null, the item to insert into the event to be modified and returned
     * @param trackVal arbitrary value that stays consistent throughout the event
     * @returns anything
     */
    public async runEvent(
        event_id : string, 
        source_obj : ContextObject, 
        arrs_extra : any[], 
        relayVar : any, 
        trackVal : any) : Promise<any>
        {
        const Events : ContextPackage[] = await source_obj.GrabContextPackages(event_id, source_obj, arrs_extra);
        Events.sort((a, b) => a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0)
        
        // Initialize the return value
        let relay_variable = relayVar;
        let returnVal;

        // Run each event
        for (const _event of Events) {
            
            // Determine function arguments
            const args = [];

            let i = 0;
            if ((_event.source !== undefined) && (_event.source !== null)) { args[i] = _event.source; i += 1;}
            if ((relay_variable !== undefined) && (relay_variable !== null)) { args[i] = relay_variable; i += 1;}
            if ((trackVal !== undefined) && (trackVal !== null)) { args[i] = trackVal; i += 1;}
            if ((_event.callbackdict !== undefined) && (_event.callbackdict !== null)) { args[i] = _event.callbackdict; i += 1;}
            if ((_event.self !== undefined) && (_event.self !== null)) { args[i] = _event.self; i += 1;}
            if ((_event.dyncontext !== undefined)) { args[i] = _event.dyncontext; i += 1;}
            
            const final_args = args.concat(arrs_extra)
            
            // Run the event
            returnVal = await _event.callback.apply(this, final_args);
            relay_variable = returnVal;
        }

        return relay_variable;
    }
}

export {EventRunner}