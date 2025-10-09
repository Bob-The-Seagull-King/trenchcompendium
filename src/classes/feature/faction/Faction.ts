import { byPropertiesOf, DescriptionFactory } from '../../../utility/functions';
import { ContextObject } from '../../contextevent/contextobject';
import { Requester } from '../../../factories/Requester';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { ContextPackage } from '../../contextevent/contextpackage';
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { Rule } from './Rule';
import { RuleFactory } from '../../../factories/features/RuleFactory';
import { FactionModelRelationship, IFactionModelRelationship } from '../../relationship/faction/FactionModelRelationship';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { FactionEquipmentRelationship, IFactionEquipmentRelationship } from '../../relationship/faction/FactionEquipmentRelationship';
import { returnParagraphsDescription} from "../../../utility/util";


interface IFaction extends IStaticOptionContextObject {
    team: string,
    description: [],
    rules: string[],
    variant_name?: string
}

class Faction extends StaticOptionContextObject {
    
    public Team : string;
    public Description;
    public Rules : Rule[] = [];
    public Variant : string;

    public Models : FactionModelRelationship[] = []
    public EquipmentItems : FactionEquipmentRelationship[] = []

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IFaction format
     */
    public constructor(data: IFaction, parent : ContextObject | null)
    {
        super(data, parent)

        this.Description = DescriptionFactory(data.description, this);
        this.Team = data.team;
        if (data.variant_name) {
            this.Variant = data.variant_name
        } else { this.Variant = "base" }

    }

    /**
     * Grabs any additional packages unique to
     * class implementation.
     */
    public async GrabSpecialPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const static_packages : ContextPackage[] = []
        for (let i = 0; i < this.Rules.length; i++) {
            const temp_packages : any[] = await this.Rules[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < temp_packages.length; j++) {
                temp_packages[j].callpath.push("Faction")
                static_packages.push(temp_packages[j]);
            }
        }
        return static_packages;
    }

    // Construct the objects for all a faction's models
    public async BuildFactionModels(id : string) {
        const ModelList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "factionmodelrelationship",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "faction_id",
                                value: id,
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IFactionModelRelationship[]
        
        ModelList.sort(byPropertiesOf<IFactionModelRelationship>(["name", "id"]))

        for (let i = 0; i < ModelList.length; i++) {
            this.Models.push(await ModelFactory.CreateFactionModel(ModelList[i], null))
        }
    }

    // Build a factions special rules
    public async BuildRules(rules : string[]) {
        for (let i = 0; i < rules.length; i++) {
            const RuleObj = await RuleFactory.CreateNewRule(rules[i], this);
            this.Rules.push(RuleObj);
        }
    }
    
    // Build all the equipment a faction has in its armoury
    public async BuildFactionEquipment(id : string) {
        const EquipmentList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "factionequipmentrelationship",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "faction_id",
                                value: id,
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IFactionEquipmentRelationship[]

        
        EquipmentList.sort(byPropertiesOf<IFactionEquipmentRelationship>(["name", "id"]))

        for (let i = 0; i < EquipmentList.length; i++) {
            this.EquipmentItems.push(await EquipmentFactory.CreateFactionEquipment(EquipmentList[i], this))
        }
    }

    /**
     * Returns the Lore text as HTML
     */
    public GetLoreHTML () {
        return returnParagraphsDescription(this, this.Description);
    }


}

export {IFaction, Faction}

