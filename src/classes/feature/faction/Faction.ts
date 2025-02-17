import { IModelUpgradeRelationship, ModelUpgradeRelationship } from '../../relationship/model/ModelUpgradeRelationship';
import { AbilityFactory } from '../../../factories/features/AbilityFactory';
import { KeywordFactory } from '../../../factories/features/KeywordFactory';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { Ability } from '../ability/Ability';
import { IKeyword, Keyword } from '../glossary/Keyword';
import { Requester } from '../../../factories/Requester';
import { UpgradeFactory } from '../../../factories/features/UpgradeFactory';
import { IModelEquipmentRelationship, ModelEquipmentRelationship } from '../../relationship/model/ModelEquipmentRelationship';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { ContextPackage } from '../../contextevent/contextpackage';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { EquipmentLimit, EquipmentRestriction } from '../equipment/Equipment';
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { IRule, Rule } from './Rule';
import { RuleFactory } from '../../../factories/features/RuleFactory';
import { FactionModelRelationship, IFactionModelRelationship } from '../../relationship/faction/FactionModelRelationship';
import { ModelFactory } from '../../../factories/features/ModelFactory';


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

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IModel format
     */
    public constructor(data: IFaction, parent : ContextObject | null)
    {
        super(data, parent)

        this.Description = DescriptionFactory(data.description, this);
        this.Team = data.team;
        if (data.variant_name) {
            this.Variant = data.variant_name
        } else { this.Variant = "base" }

        this.BuildFactionModels(data.id);
        this.BuildRules(data.rules)
    }
    
    public BuildFactionModels(id : string) {
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

        for (let i = 0; i < ModelList.length; i++) {
            this.Models.push(ModelFactory.CreateFactionModel(ModelList[i], null))
        }
    }

    public BuildRules(rules : string[]) {
        for (let i = 0; i < rules.length; i++) {
            const RuleObj = RuleFactory.CreateNewRule(rules[i], this);
            this.Rules.push(RuleObj);
        }
    }


}

export {IFaction, Faction}

