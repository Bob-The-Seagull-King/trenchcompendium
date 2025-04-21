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
    }

    public async BuildEquipment(equipment : string[]) {
        for (let i = 0; i < equipment.length; i++) {
            const EquipObj = await  EquipmentFactory.CreateNewEquipment(equipment[i], this);
            this.EquipmentItems.push(EquipObj);
        }
    }

    public async BuildOptionEquipment() {
        for (let i = 0; i < this.MyOptions.length; i++) {
            for (let j = 0; j < this.MyOptions[i].Selections.length; j++) {
                this.MyOptions[i].Selections[j].value = await EquipmentFactory.CreateModelEquipment(this.MyOptions[i].Selections[j].value, this);
            }
        }
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

