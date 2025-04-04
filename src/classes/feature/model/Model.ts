/**
 * 
 * Game Model / Unit, includes variants and base models
 * 
 */

import { IModelUpgradeRelationship, ModelUpgradeRelationship } from '../../relationship/model/ModelUpgradeRelationship';
import { AbilityFactory } from '../../../factories/features/AbilityFactory';
import { KeywordFactory } from '../../../factories/features/KeywordFactory';
import { byPropertiesOf, DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { Ability } from '../ability/Ability';
import { IKeyword, Keyword } from '../glossary/Keyword';
import { ModelStatistics } from './ModelStats';
import { Requester } from '../../../factories/Requester';
import { UpgradeFactory } from '../../../factories/features/UpgradeFactory';
import { IModelEquipmentRelationship, ModelEquipmentRelationship } from '../../relationship/model/ModelEquipmentRelationship';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { ContextPackage } from '../../contextevent/contextpackage';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { EquipmentLimit, EquipmentRestriction } from '../equipment/Equipment';
import { FactionModelRelationship, IFactionModelRelationship } from '../../relationship/faction/FactionModelRelationship';
import { ModelFactory } from '../../../factories/features/ModelFactory';

interface IModel extends IContextObject {
    description: [];
    lore: [];
    team: string;
    stats : ModelStatistics;
    keywords : string[];
    abilities : string[];
    variant_name?: string;
    /*
    upgrades
    equipment restrictions
    preset equipment
     */
}

class Model extends StaticContextObject {

    public Description;
    public Lore;
    public Team : string;
    public Stats : ModelStatistics;
    public KeyWord : Keyword[] = [];
    public Abilities : Ability[] = [];
    public Variant : string;
    public UpgradeList : ModelUpgradeRelationship[] = []
    public EquipmentList : ModelEquipmentRelationship[] = []

    public RestrictedEquipment : EquipmentRestriction[] | null = null;
    public LimitedEquipment : EquipmentLimit[] | null = null;
    public StatChoices : ModelStatistics[][] | null = null;
    public Models : FactionModelRelationship[] = []
    
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IModel format
     */
    public constructor(data: IModel, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
        this.Lore = DescriptionFactory(data.lore, this);
        this.Team = data.team;
        this.Stats = data.stats;
        if (data.variant_name) {
            this.Variant = data.variant_name
        } else { this.Variant = "base" }

        this.RunEquipmentRestriction();
        this.RunEquipmentLimit();
        this.RunStatOptions();
    }
    
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
                                item: "model_id",
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


    public RunStatOptions() {
        const EventProc : EventRunner = new EventRunner();

        EventProc.runEvent(
            "getModelStatOptions",
            this,
            [],
            [],
            null
        ).then(result => {
            this.StatChoices = result;
        });
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

    public RunEquipmentLimit() {
        const EventProc : EventRunner = new EventRunner();

        EventProc.runEvent(
            "getEquipmentLimit",
            this,
            [],
            [],
            null
        ).then(result => {
            this.LimitedEquipment = result;
        });
    }

    public BuildKeywords(keywords : string[]) {
        for (let i = 0; i < keywords.length; i++) {
            const KeywordObj = KeywordFactory.CreateNewKeyword(keywords[i], this);
            this.KeyWord.push(KeywordObj);
        }
    }

    public async BuildAbilities(abilities : string[]) {
        for (let i = 0; i < abilities.length; i++) {
            const AbilityObj = await AbilityFactory.CreateNewAbility(abilities[i], this);
            this.Abilities.push(AbilityObj);
        }
    }
    
    public async BuildModelUpgrades(id : string) {
        const UpgradeList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "modelupgraderelationship",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "model_id_set",
                                value: id,
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IModelUpgradeRelationship[]
        
        UpgradeList.sort(byPropertiesOf<IModelUpgradeRelationship>(["upgrade_id"]))

        for (let i = 0; i < UpgradeList.length; i++) {
            this.UpgradeList.push(await UpgradeFactory.CreateModelUpgrade(UpgradeList[i]))
        }
    }
    
    public async BuildModelEquipment(id : string) {
        const EquipmentList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "modelequipmentrelationship",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "model_id",
                                value: id,
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IModelEquipmentRelationship[]
        
        EquipmentList.sort(byPropertiesOf<IModelEquipmentRelationship>(["name", "id"]))

        for (let i = 0; i < EquipmentList.length; i++) {
            this.EquipmentList.push(await EquipmentFactory.CreateModelEquipment(EquipmentList[i], this))
        }
    }

}

export {IModel, Model}

