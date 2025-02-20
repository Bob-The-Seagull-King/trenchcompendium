/* modelupgraderelationship */

import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { Model } from '../../feature/model/Model';
import { Upgrade } from '../../feature/ability/Upgrade';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { UpgradeFactory } from '../../../factories/features/UpgradeFactory';

interface IModelUpgradeRelationship {
    id : string,
    model_id_set : string[],
    upgrade_id : string,
    cost : number,
    cost_type : number,
    restricted_upgrades : ModelUpgradeRestriction[],
    warband_limit : number,
    faction_mask : string[]
}

interface ModelUpgradeRestriction {
    upgrade_ids : string[],
    max_count : 0
}

class ModelUpgradeRelationship {
    public ID : string;
    public UpgradeObject : Upgrade;
    public Cost : number;
    public CostType : number;
    public WarbandLimit : number
    public Retrictions : ModelUpgradeRestriction[]
    public RequiredUpgrades : string[]
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IModelUpgradeRelationship)
    {
        this.ID = data.id;
        this.Cost = data.cost;
        this.CostType = data.cost_type;
        this.WarbandLimit = data.warband_limit;
        this.Retrictions = data.restricted_upgrades;
        this.RequiredUpgrades = data.faction_mask;
        this.UpgradeObject = UpgradeFactory.CreateNewUpgrade(data.upgrade_id, null);
    }

}

export {IModelUpgradeRelationship, ModelUpgradeRelationship}

