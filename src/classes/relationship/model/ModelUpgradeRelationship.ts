/* modelupgraderelationship */

import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { getCostType} from '../../../utility/functions';
import { ContextObject } from '../../contextevent/contextobject';
import { Upgrade } from '../../feature/ability/Upgrade';
import { UpgradeFactory } from '../../../factories/features/UpgradeFactory';
import { EventRunner } from '../../contextevent/contexteventhandler';

interface IModelUpgradeRelationship extends IStaticOptionContextObject {
    model_id_set : string[],
    upgrade_id : string,
    cost : number,
    cost_type : number,
    restricted_upgrades : string[],
    warband_limit : number,
    required_upgrades : string[]
}

class ModelUpgradeRelationship extends StaticOptionContextObject {

    public UpgradeObject! : Upgrade;
    public Cost : number;
    public CostType : number;
    public WarbandLimit : number
    public Retrictions : string[]
    public RequiredUpgrades : string[]
    /**
     * Assigns parameters and creates a series of objects
     * @param data Object data in IModelUpgradeRelationship format
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

    // Create the relevant upgrade object
    public async BuildUpgrade(upgrade_id : string) {
        this.UpgradeObject = await UpgradeFactory.CreateNewUpgrade(upgrade_id, null);
    }

    // Take restrictions and convert them into a human readable format
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

    // Get the special category of this upgrade, or return 'upgrades' if none
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