/* modelupgraderelationship */

import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { Model } from '../../feature/model/Model';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { Equipment, EquipmentRestriction } from '../../feature/equipment/Equipment';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { Faction } from '../../feature/faction/Faction';
import { FactionFactory } from '../../../factories/features/FactionFactory';

interface IFactionEquipmentRelationship extends IContextObject {
    faction_id : string[],
    equipment_id : string,
    cost : number,
    costtype : number,
    limit : number
}


class FactionEquipmentRelationship extends StaticContextObject {
    
    public EquipmentItem : Equipment;

    public Cost : number;
    public CostType : number;
    public Limit : number

    public Factions : Faction[] = [];
    
    public RestrictedEquipment : EquipmentRestriction[] | null = null;
    
    public constructor(data: IFactionEquipmentRelationship, parent : ContextObject | null)
    {
        super(data, parent)
        this.Cost = data.cost;
        this.CostType = data.costtype;
        this.Limit = data.limit;
        this.GetFactions(data.faction_id)
        this.EquipmentItem = EquipmentFactory.CreateNewEquipment(data.equipment_id, null);
        this.RunEquipmentRestriction();
    }

    public GetFactions(data : string[]) {
        data.sort()
        for (let i = 0; i < data.length; i++) {
            this.Factions.push(FactionFactory.CreateNewFaction(data[i], null))
        }
    }

    
    public RunEquipmentRestriction() {
        const EventProc : EventRunner = new EventRunner();

        EventProc.runEvent(
            "getEquipmentRestriction",
            this,
            [],
            [],
            null
        ).then(result => {
            this.RestrictedEquipment = result;
        });
    }

}

export {IFactionEquipmentRelationship, FactionEquipmentRelationship}

