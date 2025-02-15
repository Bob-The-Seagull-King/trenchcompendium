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
    }

    public BuildEquipment(equipment : string[]) {
        for (let i = 0; i < equipment.length; i++) {
            const EquipObj = EquipmentFactory.CreateNewEquipment(equipment[i], this);
            this.EquipmentItems.push(EquipObj);
        }
    }

}

export {IModelEquipmentRelationship, ModelEquipmentRelationship}

