/* modelupgraderelationship */

import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { Model } from '../../feature/model/Model';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { Equipment } from '../../feature/equipment/Equipment';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { Faction } from '../../feature/faction/Faction';
import { FactionFactory } from '../../../factories/features/FactionFactory';

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
            await this.MyOptions[i].FindChoices();
        }
        this.BuildOptionModel();
    }

}

export {IFactionModelRelationship, FactionModelRelationship}

