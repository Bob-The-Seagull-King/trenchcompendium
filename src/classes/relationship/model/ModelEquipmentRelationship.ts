import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextObject } from '../../contextevent/contextobject';
import { Equipment } from '../../feature/equipment/Equipment';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';

interface IModelEquipmentRelationship extends IStaticOptionContextObject {
    model_id : string[],
    mandatory_equipment : string[],
    removable : boolean,
    salevalue? : number,
    saletype? : number
}

class ModelEquipmentRelationship extends StaticOptionContextObject {
    
    public EquipmentItems : Equipment[] = [];
    public Removable : boolean;
    public SaleValue : number;
    public SaleType : number;
    
    public constructor(data: IModelEquipmentRelationship, parent : ContextObject | null)
    {
        super(data, parent)
        this.Removable = data.removable;
        if (data.salevalue) {
            this.SaleValue = data.salevalue;
        } else {
            this.SaleValue = 0;
        }
        if (data.saletype) {
            this.SaleType = data.saletype;
        } else {
            this.SaleType = 0;
        }
    }

    // Build the equipment item
    public async BuildEquipment(equipment : string[], skipcheck = true) {
        for (let i = 0; i < equipment.length; i++) {
            const EquipObj = await  EquipmentFactory.CreateNewEquipment(equipment[i], this, skipcheck);
            this.EquipmentItems.push(EquipObj);
        }
    }

    // Build the ModelEquipment objects that can be selected from
    public async BuildOptionEquipment() {
        for (let i = 0; i < this.MyOptions.length; i++) {
            for (let j = 0; j < this.MyOptions[i].Selections.length; j++) {
                if (this.MyOptions[i].Selections[j].value.id) {
                    this.MyOptions[i].Selections[j].value = await EquipmentFactory.CreateModelEquipment(this.MyOptions[i].Selections[j].value, this);
                }
            }
        }
    }

    // Get a collection of equipment held by this object with no duplicates
    public getUniqueEquipment() {
        const UniqueEquipment : Equipment[] = []
        const IDList : string[] = []
        for (let i = 0; i < this.EquipmentItems.length; i++) {
            if (!IDList.includes(this.EquipmentItems[i].ID)) {
                IDList.push(this.EquipmentItems[i].ID);
                UniqueEquipment.push(this.EquipmentItems[i])
            }
        }

        return UniqueEquipment;
    }
    
    /**
     * Have all options search for potential selections
     * to choose from.
     */
    public async ReloadOptions() {
        for (let i = 0; i < this.MyOptions.length; i++) {
            this.MyOptions[i].Selections = await this.MyOptions[i].FindChoices();
        }
        this.BuildOptionEquipment();
    }

}

export {IModelEquipmentRelationship, ModelEquipmentRelationship}

