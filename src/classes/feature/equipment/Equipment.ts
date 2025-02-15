/**
 * 
 * For any given MODEL, its ModelCollection contains the base
 * as well as building any relevant variant models
 * 
 */
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { Keyword } from '../glossary/Keyword';
import { KeywordFactory } from '../../../factories/features/KeywordFactory';

interface IEquipment extends IStaticOptionContextObject {
    description: [],
    lore : [],
    keywords : string[],
    category: string,
    stats : EquipmentStats,
    modifiers : string[],
    distance: number
}

interface EquipmentStats {
    hands_melee?: number,
    hands_ranged?: number,
    melee?: boolean,
    ranged?: boolean
}

interface EquipmentRestriction {
    required?: RestrictionSingle[],
    removed?: RestrictionSingle[],
    added?: RestrictionSingle[],
}

interface RestrictionSingle {
    category? : string,
    tag? : string,
    res_type : string,
    value : string
}

interface EquipmentLimit {
    maximum?: LimitSingle[],
    minimum?: LimitSingle[]
}

interface LimitSingle {
    category? : string,
    tag? : string,
    res_type : string,
    value : string,
    limit: number
}

class Equipment extends StaticOptionContextObject {
    public Description;
    public Lore;
    public KeyWord : Keyword[] = []
    public Category;
    public Stats;
    public Modifiers;
    public Distance;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IEquipment, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
        this.Lore = DescriptionFactory(data.lore, this);
        this.Category = data.category;
        this.Stats = data.stats;
        this.Modifiers = data.modifiers;
        this.Distance = data.distance;
        this.BuildKeywords(data.keywords);
    }
    

    public BuildKeywords(keywords : string[]) {
        for (let i = 0; i < keywords.length; i++) {
            const KeywordObj = KeywordFactory.CreateNewKeyword(keywords[i], this);
            this.KeyWord.push(KeywordObj);
        }
    }

}

export {IEquipment, Equipment, EquipmentStats, EquipmentRestriction, EquipmentLimit, RestrictionSingle, LimitSingle}

