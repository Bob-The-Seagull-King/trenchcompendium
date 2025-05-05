/* modelupgraderelationship */

import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { Model } from '../../feature/model/Model';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { Equipment } from '../../feature/equipment/Equipment';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { Faction } from '../../feature/faction/Faction';
import { FactionFactory } from '../../../factories/features/FactionFactory';
import {getCostType} from "../../../utility/functions";
import {GetPresentationStatistic, PresentModelStatistics} from "../../feature/model/ModelStats";
import { ModelUpgradeRelationship } from '../model/ModelUpgradeRelationship';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { Ability } from '../../feature/ability/Ability';

interface IFactionModelRelationship extends IStaticOptionContextObject {
    faction_id : string[],
    model_id : string,
    captain : boolean,
    mercenary : boolean,
    cost : number,
    cost_type : number,
    restricted_models : FactionModelRestriction[],
    warband_minimum : number,
    warband_maximum : number
}

interface FactionModelRestriction {
    upgrade_ids : string[],
    max_count : 0
}

class FactionModelRelationship extends StaticOptionContextObject {
    
    public Model! : Model;
    public Captain : boolean;
    public Mercenary : boolean;

    public Cost : number;
    public CostType : number;
    public Restricted_Models : FactionModelRestriction[]
    public Minimum : number;
    public Maximum : number;
    
    public Factions : Faction[] = [];
    
    public constructor(data: IFactionModelRelationship, parent : ContextObject | null)
    {
        super(data, parent)
        this.Captain = data.captain;
        this.Mercenary = data.mercenary
        this.Cost = data.cost;
        this.CostType = data.cost_type;
        this.Restricted_Models = data.restricted_models;
        this.Minimum = data.warband_minimum;
        this.Maximum = data.warband_maximum;
    }

    public async BuildModel(model_id : string) {        
        this.Model = await ModelFactory.CreateNewModel(model_id, null);
    }

    public async GetFactions(data : string[]) {
        for (let i = 0; i < data.length; i++) {
            this.Factions.push(await FactionFactory.CreateNewFaction(data[i], null))
        }
    }

    public async BuildOptionModel() {
        for (let i = 0; i < this.MyOptions.length; i++) {
            for (let j = 0; j < this.MyOptions[i].Selections.length; j++) {
                this.MyOptions[i].Selections[j].value = await ModelFactory.CreateNewModel(this.MyOptions[i].Selections[j].value, this);
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
        this.BuildOptionModel();
    }


    /**
     * Outputs
     */

    /**
     * Get the Name
     */
    public getName () : string {
        return this.Model.getName();
    }

    /**
     * Get Cost String as "100 Ducats" or "6 Glory"
     */
    public getCostString () : string {
        if (!this.Cost || this.Cost <= 0) {
            return 'Unnamed Model';
        }

        return this.Cost + " " + getCostType(this.CostType);
    }

    /**
     * Get the Availability String
     */
    public getAvailabilityString () : string {
        return this.Minimum.toString() + "-" + this.Maximum.toString();
    }

    /**
     * Does this model have abilities?
     */
    public hasAbilities () : boolean {
        return this.Model.hasAbilities();
    }


    /**
     * Does this model have a description text?
     * - This is mostly the equipment Text
     */
    public hasDescription () : boolean {
        return this.Model.hasDescription();
    }

    /**
     * Does this model have keywords?
     */
    public hasKeywords () : boolean {
        return this.Model.hasKeywords();
    }

    /**
     * Get List of Keywords
     */
    public getKeywords () {
        return this.Model.getKeywords();
    }

    /**
     * Does this model have upgrades?
     */
    public hasUpgrades () : boolean {
        return this.Model.hasUpgrades();
    }

    /**
     * Returns the list of upgrades for this model
     */
    public async getUpgrades (faction : Faction) {
        return await this.getContextuallyAvailableUpgrades(faction);
    }

    
    public async getContextuallyAvailableUpgrades(faction : Faction) : Promise<ModelUpgradeRelationship[]> {
        const UpgradesListAvailable : ModelUpgradeRelationship[] = []
        const BaseList : ModelUpgradeRelationship[] = []
        
        for (let i = 0; i < this.Model.UpgradeList.length; i++) {
            BaseList.push(this.Model.UpgradeList[i]);
        }

        if (this.Mercenary != true) {
            const Events : EventRunner = new EventRunner();
            const result = await Events.runEvent(
                "getContextuallyAddedUpgrades",
                faction,
                [],
                BaseList,
                this.Model
            )
            for (let i = 0; i < result.length; i++) {
                UpgradesListAvailable.push(result[i]);
            }
        }

        return UpgradesListAvailable;
    }

    public async getContextuallyAvailableAbilities(faction : Faction) : Promise<Ability[]> {
        const AbilitiesAvailable : Ability[] = []
        const BaseList : Ability[] = []
        
        for (let i = 0; i < this.Model.Abilities.length; i++) {
            BaseList.push(this.Model.Abilities[i]);
        }

        if (this.Mercenary != true) {
            const Events : EventRunner = new EventRunner();
            const result = await Events.runEvent(
                "getContextuallyAddedAbilities",
                faction,
                [],
                BaseList,
                this.Model
            )
            for (let i = 0; i < result.length; i++) {
                AbilitiesAvailable.push(result[i]);
            }
        }

        return AbilitiesAvailable;
    }

    /**
     * Does this model have a lore text?
     */
    public hasLore () : boolean {
        return this.Model.hasLore();
    }

    /**
     * Gets the base size (or options) for a model as a string
     */
    public async getBaseSizeString () : Promise<string> {

        return await this.Model.getBaseSizeString();

    }

    /**
     * Returns the slug of the model in use
     * @constructor
     */
    public GetSlug() {
        return this.Model.GetSlug();
    }

}

export {IFactionModelRelationship, FactionModelRelationship}

