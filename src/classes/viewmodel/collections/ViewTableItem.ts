// Import typescript classes
import { CompendiumItem } from "../../../classes/CompendiumItem";

class ViewTableItem {

    readonly HeldItem: CompendiumItem;
    readonly Colour: string;
    IsActive = false;

    /**
     * Empty constructor
     */
    constructor(item: CompendiumItem, colourName: string){
        this.HeldItem = item;
        this.Colour = colourName;
    }

    /**
     * Swaps the current active-state of the tablt item
     */
    SwitchStates() {
        if (this.IsActive) {
            this.IsActive = false;
        } else {
            this.IsActive = true;
        }
    }
}

export {ViewTableItem}