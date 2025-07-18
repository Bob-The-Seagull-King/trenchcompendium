/* modelupgraderelationship */

import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { Model } from '../../feature/model/Model';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { Equipment, EquipmentRestriction, EquipmentStats } from '../../feature/equipment/Equipment';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { Faction } from '../../feature/faction/Faction';
import { FactionFactory } from '../../../factories/features/FactionFactory';
import {getCostType} from "../../../utility/functions";

interface IFactionEquipmentRelationship extends IContextObject {
    faction_id : string[],
    equipment_id : string,
    cost : number,
    costtype : number,
    limit : number
}


class FactionEquipmentRelationship extends StaticContextObject {
    
    public EquipmentItem! : Equipment;

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
    }

    public async MakeItem(id : string, skipcheck = false) {
        this.EquipmentItem = await EquipmentFactory.CreateNewEquipment(id, null, skipcheck);
    }

    public async GetFactions(data : string[]) {
        data.sort()
        for (let i = 0; i < data.length; i++) {
            this.Factions.push(await FactionFactory.CreateNewFaction(data[i], null))
        }
    }

    public async getFactionEquipmentStats() : Promise<EquipmentStats> {
        const FinalStats : EquipmentStats = {}

        if (this.EquipmentItem.Stats.hands_melee != undefined) {FinalStats.hands_melee = this.EquipmentItem.Stats.hands_melee}
        if (this.EquipmentItem.Stats.hands_ranged != undefined) {FinalStats.hands_ranged = this.EquipmentItem.Stats.hands_ranged}
        if (this.EquipmentItem.Stats.melee != undefined) {FinalStats.melee = this.EquipmentItem.Stats.melee}
        if (this.EquipmentItem.Stats.ranged != undefined) {FinalStats.ranged = this.EquipmentItem.Stats.ranged}
        
        const Events : EventRunner = new EventRunner();
        const result = await Events.runEvent(
            "modifyEquipmentStats",
            this,
            [],
            FinalStats,
            null
        )

        return result;
    }
    
    public async RunEquipmentRestriction() {
        const EventProc : EventRunner = new EventRunner();

        this.RestrictedEquipment = await EventProc.runEvent(
            "getEquipmentRestriction",
            this,
            [],
            [],
            null
        )
    }

    /**
     * Returns the limit value for this item
     * @return {number} The limit value
     */
    public GetLimit() {
        return this.Limit;
    }

    /**
     * Returns the limit value for this item
     * @return {string} The restriction value as a string
     * @TODO: return the restriction as a string e.g. "Assassins only"
     */
    public GetRestrictionString() {
        // return 'Assassins only';
        return '';
    }

    public GetCostString() {
        return this.Cost + " " + getCostType(this.CostType)
    }
}

export {IFactionEquipmentRelationship, FactionEquipmentRelationship}

