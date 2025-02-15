/* modelupgraderelationship */

import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { Model } from '../../feature/model/Model';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { Equipment } from '../../feature/equipment/Equipment';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';

interface IModelEquipmentRelationship extends IStaticOptionContextObject {
    model_id : string[],
    mandatory_equipment : string[],
    removable : boolean
}

class ModelEquipmentRelationship extends StaticOptionContextObject {
    
    public EquipmentItems : Equipment[] = [];
    public Removable : boolean;
    
    public constructor(data: IModelEquipmentRelationship, parent : ContextObject | null)
    {
        super(data, parent)
        this.Removable = data.removable;
        this.BuildEquipment(data.mandatory_equipment);
        this.BuildOptionEquipment();
    }

    public BuildEquipment(equipment : string[]) {
        for (let i = 0; i < equipment.length; i++) {
            const EquipObj = EquipmentFactory.CreateNewEquipment(equipment[i], this);
            this.EquipmentItems.push(EquipObj);
        }
    }

    public BuildOptionEquipment() {
        for (let i = 0; i < this.MyOptions.length; i++) {
            for (let j = 0; j < this.MyOptions[i].Selections.length; j++) {
                this.MyOptions[i].Selections[j].value = EquipmentFactory.CreateModelEquipment(this.MyOptions[i].Selections[j].value, this);
            }
        }
    }

    
    /**
     * Have all options search for potential selections
     * to choose from.
     */
    public async ReloadOptions() {
        for (let i = 0; i < this.MyOptions.length; i++) {
            await this.MyOptions[i].FindChoices();
        }
    }

}

export {IModelEquipmentRelationship, ModelEquipmentRelationship}

