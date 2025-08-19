import { BaseContextCallTable } from "../../resources/staticcontext/BaseContextTable";
import { CallEventTable, ContextEventVals } from "../../resources/staticcontext/contexteventtypes";
import { CompendiumItem, ICompendiumItemData } from "../CompendiumItem";
import { ContextPackage } from "./contextpackage";

interface IContextObject extends ICompendiumItemData {
    contextdata : ContextEventVals | null; // ContextEvent keys used for when events are run through the object
}

class ContextObject extends CompendiumItem {

    public SelfData : any; // The interface data, used as reference
    public ContextKeys : ContextEventVals = {} // The values that correlate to the context data table
    public readonly ContextData : CallEventTable = BaseContextCallTable; // The table searched through in Events

    public MyContext : ContextObject | null = null; // The parent object, if any

    public constructor(data : IContextObject, parent : ContextObject | null) {
        super(data);
        this.SelfData = data;
        this.MyContext = parent;
        if (data.contextdata) {
            this.ContextKeys = data.contextdata;    
        }  
    }

    /**
     * Gets the name of an object to display outwards.
     */
    public GetTrueName() {
        if (this.Name != undefined) {
            return this.Name;
        }
        return "name_unidentified";
    }

    /**
     * Gets the name of an object to display outwards.
     */
    public GetPresentationName() {
        if (this.Name != undefined) {
            return this.Name;
        }
        return "name_unidentified";
    }

    /**
     * Grab context packages from this object, and potentially any child objects.
     */
    public async GrabContextPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { return []; }

}

export {ContextObject, IContextObject}