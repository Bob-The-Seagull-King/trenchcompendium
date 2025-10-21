/**
 * 
 * For any given MODEL, its ModelCollection contains the base
 * as well as building any relevant variant models
 * 
 */
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { byPropertiesOf, DescriptionFactory } from '../../../utility/functions';
import { ContextObject } from '../../contextevent/contextobject';
import { Keyword } from '../glossary/Keyword';
import { KeywordFactory } from '../../../factories/features/KeywordFactory';
import { FactionEquipmentRelationship, IFactionEquipmentRelationship } from '../../relationship/faction/FactionEquipmentRelationship';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { Requester } from '../../../factories/Requester';
import {returnDescription} from "../../../utility/util";
import { Ability } from '../ability/Ability';
import { AbilityFactory } from '../../../factories/features/AbilityFactory';

interface IEquipment extends IStaticOptionContextObject {
    description: [],
    lore : [],
    keywords : string[],
    category: string,
    stats : EquipmentStats,
    modifiers : string[],
    distance: number
    abilities?: string[]
}

interface EquipmentStats {
    hands_melee?: number,
    hands_ranged?: number,
    melee?: boolean,
    ranged?: boolean
}

// Used to handle if a model / faction / member can
// be given a specific item.
interface EquipmentRestriction {
    required?: RestrictionSingle[],
    removed?: RestrictionSingle[],
    added?: RestrictionSingle[],
    permitted?: RestrictionSingle[],
    banned?: RestrictionSingle[]
}

interface RestrictionSingle {
    category? : string,
    tag? : string,
    res_type : string ,
    value : string | number,
    param? : any
}


// Creates a proper copy of an equipment restriction,
// used when an object needs to customise or overwrite
// a restriction without changing the original.
export function deepCopyEquipmentRestriction(original: EquipmentRestriction): EquipmentRestriction {
    return {
        required: original.required?.map(r => ({ ...r })),
        removed: original.removed?.map(r => ({ ...r })),
        added: original.added?.map(r => ({ ...r })),
        permitted: original.permitted?.map(r => ({ ...r })),
        banned: original.banned?.map(r => ({ ...r }))
    };
}

// Used to determine the number of a give item
// that a model / member / warband can have.
interface EquipmentLimit {
    maximum?: LimitSingle[],
    minimum?: LimitSingle[]
}

interface LimitSingle {
    id?: string,
    category? : string,
    tag? : string,
    res_type : string,
    value : string,
    subvalue?: string | number,
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
    public Abilities: Ability[] = [];
    
    public EquipmentItems : FactionEquipmentRelationship[] = []

    /**
     * Assigns parameters and creates a series of objects
     * @param data Object data in IEquipment format
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
    
    // Creates all keyword objects from their IDs
    public BuildKeywords(keywords : string[]) {
        for (let i = 0; i < keywords.length; i++) {
            const KeywordObj = KeywordFactory.CreateNewKeyword(keywords[i], this);
            this.KeyWord.push(KeywordObj);
        }
    }

    // Build a model's abilities
    public async BuildAbilities(abilities : string[]) {
        for (let i = 0; i < abilities.length; i++) {
            const AbilityObj = await AbilityFactory.CreateNewAbility(abilities[i], this);
            this.Abilities.push(AbilityObj);
        }
    }

    // Creates the factions this item is associated with
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
                                item: "equipment_id",
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
     * Returns the category as string
     * @constructor
     */
    GetCategory () {
        return this.Category;
    }

    /**
     *  Return Range as String
     */
    GetRange () {

        let rangestring = '';

        if( this.Distance ) {
            rangestring += this.Distance+'"';
        }

        if( this.Distance && this.Stats.melee ) {
            rangestring += ' / ';
        }

        if( this.Stats.melee ) {
            rangestring += 'Melee';
        }
        return rangestring;
    }

    /**
     *  Return Melee Hands as String
     */
    GetHandsMelee () {
        if( this.Stats.hands_melee ) {
            return this.Stats.hands_melee.toString() + " Hands";
        } else {
            return '';
        }
    }

    /**
     *  Return Ranged Hands as String
     */
    GetHandsRanged () {
        if( this.Stats.hands_ranged ) {
            return this.Stats.hands_ranged.toString() + " Hands";
        } else {
            return '';
        }
    }

    /**
     *  Return Modifiers as String
     */
    GetModifiers () {
        return this.Modifiers.join(', ');
    }

    /**
     *  Return Keywords
     */
    GetKeyWords () {
        return this.KeyWord;
    }

    GetKeyWordIDs () {
        const arr : string[] = []

        for (let i = 0; i < this.KeyWord.length; i++) {
            arr.push(this.KeyWord[i].GetID())
        }

        return arr;
    }

    /**
     *  Return Description as String
     */
    GetDescription () {

        if (!this.Description || this.Description.length === 0) return null;

        return returnDescription(this, this.Description);
    }

    /**
     *  Return Lore as String
     */
    GetLore () {
        if (!this.Lore || this.Lore.length === 0) return null;

        return returnDescription(this, this.Lore);
    }
}

export {IEquipment, Equipment, EquipmentStats, EquipmentRestriction, EquipmentLimit, RestrictionSingle, LimitSingle}

