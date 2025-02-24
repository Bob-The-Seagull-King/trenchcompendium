import { GloriousDeedFactory } from '../../../factories/features/GloriousDeedFactory';
import { RuleFactory } from '../../../factories/features/RuleFactory';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { Rule } from '../faction/Rule';
import { GloriousDeed } from './GloriousDeed';

interface IScenario extends IContextObject {
    description: [],
    img_link : string,
    forces : ForcesData,
    battlefield : BattlefieldData,
    infiltrators : InfiltratorData,
    deployment : DeploymentData,
    battle_length : BattleLengthData,
    victory_conditions : VictoryData,
    glorious_deeds : GloriousDeedData,
    special_rules : string[]
}

interface ForcesData {
    even_match: boolean,
    description: []
}

interface BattlefieldData {
    standard_terrain: boolean,
    field_size: [],
    extra_features: []
}

interface InfiltratorData {
    infil_type: number, // 0 = No, 1 = Yes, 2 = Special
    description: []
}

interface DeploymentData {
    description: []
}

interface VictoryData {
    description: []
}

interface BattleLengthData {
    min : number,
    max : number,
    description: []
}

interface GloriousDeedData {
    deeds : string[],
    optional_deeds : string[],
    description: []
}

class Scenario extends StaticContextObject {
    public Description;
    public ImgLink : string;

    public EvenMatch : boolean;
    public ForcesDesc;

    public StandardTerrain : boolean;
    public BattlefieldSize;
    public BattlefieldExtra;

    public InfiltratorType : number;
    public InfiltratorDesc;

    public DeploymentDesc;

    public VictoryDesc;

    public BattleMin : number;
    public BattleMax : number;
    public BattlelengthDesc;

    public Deeds : GloriousDeed[] = [];
    public OptionalDeeds : GloriousDeed[] = [];
    public DeedsDesc;

    public SpecialRules : Rule[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IScenario, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
        this.ImgLink = data.img_link;

        this.EvenMatch = data.forces.even_match;
        this.ForcesDesc = DescriptionFactory(data.forces.description, this);

        this.StandardTerrain = data.battlefield.standard_terrain;
        this.BattlefieldSize = DescriptionFactory(data.battlefield.field_size, this);
        this.BattlefieldExtra = DescriptionFactory(data.battlefield.extra_features, this);

        this.InfiltratorType = data.infiltrators.infil_type;
        this.InfiltratorDesc = DescriptionFactory(data.infiltrators.description, this);
        
        this.DeploymentDesc = DescriptionFactory(data.deployment.description, this);
        
        this.VictoryDesc = DescriptionFactory(data.victory_conditions.description, this);

        this.BattleMin = data.battle_length.min;
        this.BattleMax = data.battle_length.max;
        this.BattlelengthDesc = DescriptionFactory(data.battle_length.description, this);
        
        this.DeedsDesc = DescriptionFactory(data.glorious_deeds.description, this);
        this.BuildRules(data.special_rules);
        this.BuildDeeds(data.glorious_deeds.deeds);
        this.BuildOptionalDeeds(data.glorious_deeds.optional_deeds);
    }

    public BuildRules(rules : string[]) {
        for (let i = 0; i < rules.length; i++) {
            const RuleObj = RuleFactory.CreateNewRule(rules[i], this);
            this.SpecialRules.push(RuleObj);
        }
    }
    
    public BuildDeeds(deeds : string[]) {
        for (let i = 0; i < deeds.length; i++) {
            const DeedObj = GloriousDeedFactory.CreateNewGloriousDeed(deeds[i], this);
            this.Deeds.push(DeedObj);
        }
    }
    
    public BuildOptionalDeeds(deeds : string[]) {
        for (let i = 0; i < deeds.length; i++) {
            const DeedObj = GloriousDeedFactory.CreateNewGloriousDeed(deeds[i], this);
            this.OptionalDeeds.push(DeedObj);
        }
    }

}

export {IScenario, Scenario, ForcesData, BattlefieldData, InfiltratorData, DeploymentData, VictoryData, BattleLengthData, GloriousDeedData}

