/**
 * 
 * Game Model / Unit, includes variants and base models
 * 
 */

import { IModelUpgradeRelationship, ModelUpgradeRelationship, UpgradesGrouped } from '../../relationship/model/ModelUpgradeRelationship';
import { AbilityFactory } from '../../../factories/features/AbilityFactory';
import { KeywordFactory } from '../../../factories/features/KeywordFactory';
import {byPropertiesOf, DescriptionFactory, getCostType} from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { Ability } from '../ability/Ability';
import { IKeyword, Keyword } from '../glossary/Keyword';
import { GetPresentationStatistic, MergeTwoStats, ModelStatistics, PresentModelStatistics } from './ModelStats';
import { Requester } from '../../../factories/Requester';
import { UpgradeFactory } from '../../../factories/features/UpgradeFactory';
import { IModelEquipmentRelationship, ModelEquipmentRelationship } from '../../relationship/model/ModelEquipmentRelationship';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { ContextPackage } from '../../contextevent/contextpackage';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { Equipment, EquipmentLimit, EquipmentRestriction } from '../equipment/Equipment';
import { FactionModelRelationship, IFactionModelRelationship } from '../../relationship/faction/FactionModelRelationship';
import { ModelFactory } from '../../../factories/features/ModelFactory';
import { Faction } from '../faction/Faction';

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
    public StatChoices: ModelStatistics[][] | null = null;
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


    public async RunStatOptions() {
        const EventProc : EventRunner = new EventRunner();

        await EventProc.runEvent(
            "getModelStatOptions",
            this,
            [],
            [],
            null
        ).then(result => {
            this.StatChoices = result;
        });
    }

    public async RunEquipmentRestriction() {
        const EventProc : EventRunner = new EventRunner();

        await EventProc.runEvent(
            "getEquipmentRestriction",
            this,
            [],
            [],
            null
        ).then(result => {
            this.RestrictedEquipment = result;
        });
    }

    public async RunEquipmentLimit() {
        const EventProc : EventRunner = new EventRunner();

        await EventProc.runEvent(
            "getEquipmentLimit",
            this,
            [],
            [],
            null
        ).then(result => {
            this.LimitedEquipment = result;
        });
    }

    public async GetPresentableStatistics() {
        const BaseStats = await this.GetStatsInfluencedByEquipmentProvided();

        if (this.StatChoices == null) {        
            const EventProc : EventRunner = new EventRunner();

            const result = await EventProc.runEvent(
                "getModelStatOptions",
                this,
                [],
                [],
                null
            )
            
            return GetPresentationStatistic(BaseStats, result);
        } else {               
            return GetPresentationStatistic(BaseStats, this.StatChoices);
        }
    }

    public async GetStatsInfluencedByEquipmentProvided() {
        let InfluencedStats = MergeTwoStats(this.Stats, {})
        const EventProc : EventRunner = new EventRunner();
        for (let i = 0; i < this.EquipmentList.length; i++) {
            for (let j = 0; j < this.EquipmentList[i].EquipmentItems.length; j++) {
                const CurEquip : Equipment = this.EquipmentList[i].EquipmentItems[j]

                InfluencedStats = await EventProc.runEvent(
                    "updateModelStats",
                    CurEquip,
                    [],
                    InfluencedStats,
                    null
                )
                
            }
        }       
        return InfluencedStats;
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
            this.UpgradeList.push(await UpgradeFactory.CreateModelUpgrade(UpgradeList[i], this))
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
    
    
    
    public GetSplitUpgrades() : UpgradesGrouped {

        const groups : UpgradesGrouped = {}

        const UpgradeListFull : ModelUpgradeRelationship[] = this.UpgradeList

        for (let i = 0; i < UpgradeListFull.length; i++) {
            const special_cat = UpgradeListFull[i].GetSpecialCategory()
            if (groups[special_cat]) {
                groups[special_cat].push(UpgradeListFull[i])
            } else {
                groups[special_cat] = [UpgradeListFull[i]]
            }
        }

        return groups;
    }


    /**
     * Outputs
     */

    /**
     * Get the Name
     */
    public getName () : string {
        if (!this.Name || this.Name.trim() === '') {
            return 'Unnamed Model';
        }

        return this.Name;
    }

    public getUniqueEquipment() {
        const UniqueEquipment : ModelEquipmentRelationship[] = []
        const IDList : string[] = []
        for (let i = 0; i < this.EquipmentList.length; i++) {
            if (!IDList.includes(this.EquipmentList[i].ID)) {
                IDList.push(this.EquipmentList[i].ID);
                UniqueEquipment.push(this.EquipmentList[i])
            }
        }

        return UniqueEquipment;
    }

    /**
     * Does this model have abilities?
     */
    public hasAbilities () : boolean {
        if( this.Abilities.length > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Does this model have a description text?
     * - This is mostly the equipment Text
     */
    public hasDescription () : boolean {
        if( this.Description.length > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Does this model have keywords?
     */
    public hasKeywords () : boolean {
        if( this.KeyWord.length > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get List of Keywords
     */
    public getKeywords ()  {
        return this.KeyWord;
    }

    public getKeywordIDs() : string[] {
        const idlist : string[] = []

        for (let i = 0; i < this.KeyWord.length; i++) {
            idlist.push(this.KeyWord[i].ID)
        }

        return idlist;
    }

    /**
     * Does this model have upgrades?
     */
    public hasUpgrades () : boolean {
        if( this.UpgradeList.length > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the list of upgrades for this model
     */
    public getUprgades () {
        return this.UpgradeList;
    }

    /**
     * Does this model have a lore text?
     */
    public hasLore () : boolean {
        if( this.Lore ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the ID of the Model
     */
    public GetSlug () {
        return this.ID;
    }


    /**
     * Returns the base size (or options) for a model as a string
     */
    public async getBaseSizeString () : Promise<string> {
        const stats : PresentModelStatistics = await this.GetPresentableStatistics();
        
        const basestats: string[] = []
            if (stats.base != undefined) {
            for (let i = 0; i < stats.base?.length; i++) {
                const curstats : string[] = []
                for (let j = 0; j < stats.base[i].length; j++) {
                    curstats.push(stats.base[i][j].toString());
                }
                basestats.push(curstats.join('x') + "mm")
            }
        }
    
        return basestats.join('/')
    }



}

export {IModel, Model}

