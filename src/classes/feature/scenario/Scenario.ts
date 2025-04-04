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
    allowed: number, // 0 = No, 1 = Yes, 2 = Special
    description: any[]
}

interface DeploymentData {
    staggered: boolean,
    description: []
}

interface VictoryData {
    description: []
}

interface BattleLengthData {
    min : number,
    max : number,
    description: any[]
}

interface GloriousDeedData {
    deeds : string[],
    optional_deeds : string[],
    description: any[]
}

class Scenario extends StaticContextObject {
    public Description;
    public ImgLink : string;

    public EvenMatch : boolean;
    public ForcesDesc;

    public StandardTerrain : boolean;
    public BattlefieldSize;
    public BattlefieldExtra;
    public BattlefieldTerrainStandard : any[] = []

    public InfiltratorType : number;
    public InfiltratorDesc;

    public DeploymentDesc;
    public StaggeredDeployment : boolean;

    public VictoryDesc;

    public BattleMin : number;
    public BattleMax : number;
    public BattlelengthDesc;

    public Deeds : GloriousDeed[] = [];
    public OptionalDeeds : GloriousDeed[] = [];
    public DeedsDesc;

    public SpecialRules : Rule[] = [];

    private StandardTerrainData = [
        {
            tags: {desc_type : "default"},
            content: "The player with the lower number of models in their force can place one of the following terrain pieces on the table:"
        },
        {
            tags: {desc_type : "list"},
            content: "",
            subcontent:  [
                {
                    tags: {desc_type : "default"},
                    content: "One Building (a tower, house etc.)"
                },
                {
                    tags: {desc_type : "default"},
                    content: "One Piece of Dangerous Terrain (swamp, barbed wire etc.)"
                },
                {
                    tags: {desc_type : "default"},
                    content: "One Piece of Difficult Terrain (forest, rocky ground)"
                },
                {
                    tags: {desc_type : "default"},
                    content: "One Piece of Impassable terrain (12” river with a bridge or ford, sheer cliffs etc.) Maximum two pieces per battle"
                },
                {
                    tags: {desc_type : "default"},
                    content: "One Hill"
                },
                {
                    tags: {desc_type : "default"},
                    content: "One Fence/wall/other defendable terrain piece (max one per player)"
                },
                {
                    tags: {desc_type : "default"},
                    content: "6” Section of a Trench"
                }
            ]
        },
        {
            tags: {desc_type : "default"},
            content: "Each building must be placed at least 8” away from any table edge and at least 6” away from the nearest building terrain piece."
        },
        {
            tags: {desc_type : "default"},
            content: "In addition, both players should add six smaller terrain pieces like boxes, sandbags, bomb craters, wells, fountains etc. anywhere on the table to create cover."
        }
    ]

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
        this.BattlefieldTerrainStandard = DescriptionFactory(this.StandardTerrainData, this);

        this.InfiltratorType = data.infiltrators.allowed;
        this.InfiltratorDesc = DescriptionFactory(data.infiltrators.description, this);
        
        this.StaggeredDeployment = data.deployment.staggered;
        this.DeploymentDesc = DescriptionFactory(data.deployment.description, this);
        
        this.VictoryDesc = DescriptionFactory(data.victory_conditions.description, this);

        this.BattleMin = data.battle_length.min;
        this.BattleMax = data.battle_length.max;
        this.BattlelengthDesc = DescriptionFactory(data.battle_length.description, this);
        
        this.DeedsDesc = DescriptionFactory(data.glorious_deeds.description, this);
        this.BuildDeeds(data.glorious_deeds.deeds);
        this.BuildOptionalDeeds(data.glorious_deeds.optional_deeds);
    }

    public async BuildRules(rules : string[]) {
        for (let i = 0; i < rules.length; i++) {
            const RuleObj = await RuleFactory.CreateNewRule(rules[i], this);
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

