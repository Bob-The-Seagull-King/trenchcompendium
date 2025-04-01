import { BaseContextCallTable } from "../../resources/staticcontext/BaseContextTable";
import { CallEventTable, ContextEventVals } from "../../resources/staticcontext/contexteventtypes";
import { CompendiumItem, ICompendiumItemData } from "../CompendiumItem";
import { ContextPackage } from "./contextpackage";

interface IContextObject extends ICompendiumItemData {
    contextdata : ContextEventVals; // ContextEvent keys used for when events are run through the object
}

class ContextObject extends CompendiumItem {

    public SelfData : any;
    public ContextKeys : ContextEventVals = {}
    public ContextData : CallEventTable | undefined; // The table searched through in Events

    public MyContext : ContextObject | null = null; // The parent object, if any

    public constructor(data : IContextObject, parent : ContextObject | null) {
        super(data);
        this.SelfData = data;
        this.MyContext = parent;
        this.ContextKeys = data.contextdata;        
        this.ContextData = BaseContextCallTable;
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
     * Grab context packages from this object, and potentially any child objects.
     */
    public async GrabContextPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { return []; }

}

export {ContextObject, IContextObject}