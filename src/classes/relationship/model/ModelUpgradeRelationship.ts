/* modelupgraderelationship */

import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import {DescriptionFactory, getCostType} from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { Model } from '../../feature/model/Model';
import { Upgrade } from '../../feature/ability/Upgrade';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { UpgradeFactory } from '../../../factories/features/UpgradeFactory';
import { EventRunner } from '../../contextevent/contexteventhandler';

interface IModelUpgradeRelationship extends IStaticOptionContextObject {
    model_id_set : string[],
    upgrade_id : string,
    cost : number,
    cost_type : number,
    restricted_upgrades : ModelUpgradeRestriction[],
    warband_limit : number,
    required_upgrades : string[]
}

interface ModelUpgradeRestriction {
    upgrade_ids : string[],
    max_count : 0
}



class ModelUpgradeRelationship extends StaticOptionContextObject {

    public UpgradeObject! : Upgrade;
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
    public constructor(data: IModelUpgradeRelationship, parent : ContextObject | null)
    {
        super(data, parent)
        this.Cost = data.cost;
        this.CostType = data.cost_type;
        this.WarbandLimit = data.warband_limit;
        this.Retrictions = data.restricted_upgrades;
        this.RequiredUpgrades = data.required_upgrades;
    }

    public async BuildUpgrade(upgrade_id : string) {
        this.UpgradeObject = await UpgradeFactory.CreateNewUpgrade(upgrade_id, null);
    }

    public async GetRestrictions() {
        const restrictions : string[] = [];
        
        for (let i = 0; i < this.RequiredUpgrades.length; i++) {
            const ReqUpgrade : Upgrade = await UpgradeFactory.CreateNewUpgrade(this.RequiredUpgrades[i], null);
            restrictions.push("Requires " + ReqUpgrade.Name);
        }

        const EventProc: EventRunner = new EventRunner();

        const result = await EventProc.runEvent(
            "getUpgradeRestrictionsPresentation",
            this,
            [],
            restrictions,
            null
        );
        return result.join(',');
    }

    public GetSpecialCategory() {
        if (this.UpgradeObject.Tags['special_category']) {
            return this.UpgradeObject.Tags['special_category'].toString();
        } else {
            return 'upgrades';
        }
    }

    /**
     * Return the Cost string for this Upgrade
     */
    public GetCostString () {

        if( this.Cost > 0) {
            return this.Cost + ' ' + getCostType(this.CostType);
        } else {
            return '';
        }
    }

    /**
     * Returns the max limit as int for this upgrade
     * // @TODO: add actual limit number
     * - 0 if no limit
     */
    public GetLimitNumber () {
        return 2;
    }

    /**
     * Get the Limit String For this Upgrade
     * @constructor
     */
    public GetLimitString () {

        if( this.WarbandLimit != 0 ) {
            return 'Limit: ' + this.WarbandLimit.toString();
        } else {
            return '';
        }

    }
}

export {IModelUpgradeRelationship, ModelUpgradeRelationship}


export type UpgradesGrouped = {[type : string]: ModelUpgradeRelationship[]};