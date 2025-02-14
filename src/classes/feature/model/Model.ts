/**
 * 
 * Game Model / Unit, includes variants and base models
 * 
 */

import { AbilityFactory } from '../../../factories/features/AbilityFactory';
import { KeywordFactory } from '../../../factories/features/KeywordFactory';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { Ability } from '../ability/Ability';
import { IKeyword, Keyword } from '../glossary/Keyword';
import { ModelStatistics } from './ModelStats';

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
        this.BuildKeywords(data.keywords);
        this.BuildAbilities(data.abilities);
    }

    public BuildKeywords(keywords : string[]) {
        for (let i = 0; i < keywords.length; i++) {
            const KeywordObj = KeywordFactory.CreateNewKeyword(keywords[i], this);
            this.KeyWord.push(KeywordObj);
        }
    }

    public BuildAbilities(abilities : string[]) {
        for (let i = 0; i < abilities.length; i++) {
            const AbilityObj = AbilityFactory.CreateNewAbility(abilities[i], this);
            this.Abilities.push(AbilityObj);
        }
    }

}

export {IModel, Model}

