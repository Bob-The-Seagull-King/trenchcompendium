import { ScenarioFactory } from '../../../factories/features/ScenarioFactory';
import { Requester } from '../../../factories/Requester';
import { GloriousDeedFactory } from '../../../factories/features/GloriousDeedFactory';
import { DescriptionFactory } from '../../../utility/functions';
import { IContextObject } from '../../contextevent/contextobject';
import { GloriousDeed, IGloriousDeed } from './GloriousDeed';
import { ForcesData, BattlefieldData, InfiltratorData, DeploymentData, BattleLengthData, VictoryData, GloriousDeedData, Scenario, IScenario } from './Scenario';

interface GenerateObjective extends IContextObject {
    forces : ForcesData,
    battlefield : BattlefieldData,
    infiltrators? : InfiltratorData,
    victory_conditions : VictoryData,
    special_rules : string[],
    banned_deployments: string[],
    description: []
}

interface GenerateDeployment extends IContextObject {
    img_link : string,
    infiltrators? : InfiltratorData,
    deployment : DeploymentData,
    battle_length? : BattleLengthData,
    special_rules : string[],
    description: []
}

interface GenCode {
    obj : number,
    dep : number,
    gl_a_1 : number,
    gl_a_2 : number,
    gl_b_1 : number,
    gl_b_2 : number,
    gl_fn : number
}

interface GenTitles {
    obj : string,
    dep : string,
    gl_a_1 : string,
    gl_a_2 : string,
    gl_b_1 : string,
    gl_b_2 : string,
    gl_fn : string
}

interface ScenarioSet {
    genscen : Scenario,
    id : string,
    infobox : GenTitles
}

const zeroPad = (num : number, places : number) => String(num).padStart(places, '0')

class ScenarioGenerator {

    public ListOfObjectives : GenerateObjective[] = [];
    public ListOfDeployments : GenerateDeployment[] = [];
    public ListOfDeedsGroupA : GloriousDeed[] = [];
    public ListOfDeedsGroupB : GloriousDeed[] = [];
    public ListOfDeedsGroupC : GloriousDeed[] = [];

    public CurrentScenario!: ScenarioSet;

    public DeploymentDataDesc : any[] = []
    public ScenarioDataDesc : any[] = []
    public DeedDataDesc : any[] = []
    public RulesDataDesc : any[] = []

    // Data used by all default scenarios
    private DeploymentData = [{
                    tags: {desc_type : "paragraph"},
                    content: "The player that did not roll for Missions rolls a D6 and consults the chart below to determine how the warbands deploy for the game."
                },
                {
                    tags: {desc_type : "headless_table"},
                    content: "",
                    subcontent: [
                        {
                            tags: {desc_type : "table_row"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "1"
                                },
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "Chance Encounter"
                                }
                            ]
                        },{
                            tags: {desc_type : "table_row"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "2"
                                },
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "Standard Deployment"
                                }
                            ]
                        },{
                            tags: {desc_type : "table_row"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "3"
                                },
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "Flank Attack"
                                }
                            ]
                        },{
                            tags: {desc_type : "table_row"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "4"
                                },
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "Long Distance Battle"
                                }
                            ]
                        },{
                            tags: {desc_type : "table_row"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "5"
                                },
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "Tunnels"
                                }
                            ]
                        },{
                            tags: {desc_type : "table_row"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "6"
                                },
                                {
                                    tags: {desc_type : "table_item"},
                                    content: "Fog Of War"
                                }
                            ]
                        }
                    ]
                }]
    private ScenarioData = [
                    {
                        tags: {desc_type : "paragraph"},
                        content: "After terrain has been placed, either player rolls a D6 and consults the chart below to determine the victory conditions for the game. Note that if you are playing the campaign, the winner always gains 5 Victory Points if otherwise the result would indicate less."
                    },
                    {
                        tags: {desc_type : "paragraph"},
                        content: "",
                        subcontent: [
                    {
                        tags: {desc_type : "headless_table"},
                        content: "",
                        subcontent: [
                            {
                                tags: {desc_type : "table_row"},
                                content: "",
                                subcontent: [
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "1"
                                    },
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "Attritional Battle"
                                    }
                                ]
                            },{
                                tags: {desc_type : "table_row"},
                                content: "",
                                subcontent: [
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "2"
                                    },
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "Take and Hold"
                                    }
                                ]
                            },{
                                tags: {desc_type : "table_row"},
                                content: "",
                                subcontent: [
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "3"
                                    },
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "Sabotage"
                                    }
                                ]
                            },{
                                tags: {desc_type : "table_row"},
                                content: "",
                                subcontent: [
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "4"
                                    },
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "Over the Top"
                                    }
                                ]
                            },{
                                tags: {desc_type : "table_row"},
                                content: "",
                                subcontent: [
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "5"
                                    },
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "Breakthrough"
                                    }
                                ]
                            },{
                                tags: {desc_type : "table_row"},
                                content: "",
                                subcontent: [
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "6"
                                    },
                                    {
                                        tags: {desc_type : "table_item"},
                                        content: "Retrieve"
                                    }
                                ]
                            }
                        ]
                    }]
                    }]
    private DeedData = [{
                        tags: {desc_type : "paragraph"},
                        content: "To determine the Glorious Deeds for the scenario, each player rolls two D6, one after the other. If a player rolls the same result on both dice, roll one of the dice again until it shows a different result. Match each player’s results to their table below."
                    },
                    {
                        tags: {desc_type : "paragraph"},
                        content: "Finally, every scenario shares a fifth Glorious Deed: “Victorious: Win the Battle.” Completing any of these Glorious Deeds earns the player 1 Glory Point. Once a Glorious Deed is completed by a player, it cannot be completed again by either player."
                    }]
    private RulesData = [{
                            tags: {desc_type : "paragraph"},
                            content: "These rules can be used to generate either one-off or Campaign scenarios on the fly. To Generate a Scenario, follow these steps:"
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "",
                            subcontent: [
                        {
                            tags: {desc_type : "headless_table"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "table_row"},
                                    content: "",
                                    subcontent: [
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "1"
                                        },
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "One player rolls for Scenario type on the chart below."
                                        }
                                    ]
                                },{
                                    tags: {desc_type : "table_row"},
                                    content: "",
                                    subcontent: [
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "2"
                                        },
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "One player rolls for Deployment type on the chart below"
                                        }
                                    ]
                                },{
                                    tags: {desc_type : "table_row"},
                                    content: "",
                                    subcontent: [
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "3"
                                        },
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "Both players roll for Glorious Deeds on the charts below."
                                        }
                                    ]
                                },{
                                    tags: {desc_type : "table_row"},
                                    content: "",
                                    subcontent: [
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "4"
                                        },
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "Players set up Terrain according to the instructions."
                                        }
                                    ]
                                },{
                                    tags: {desc_type : "table_row"},
                                    content: "",
                                    subcontent: [
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "5"
                                        },
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "Players deploy their troops according to instructions."
                                        }
                                    ]
                                },{
                                    tags: {desc_type : "table_row"},
                                    content: "",
                                    subcontent: [
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "6"
                                        },
                                        {
                                            tags: {desc_type : "table_item"},
                                            content: "Determine the Length of the Game as detailed below."
                                        }
                                    ]
                                }
                            ]
                        }]
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "bold"},
                                    content: "Setting Up"
                                }
                            ]
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "Unless the scenario instructs otherwise, the players take it in turns to deploy one model at a time, starting with the player who has more models in their warband (rolloff if both have the same number of models."
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "Models must be set up wholly within their own deployment zone. If a player runs out of models to set up, the other player sets up all their models afterwards. Once the players have set up their models, deployment ends and the battle begins."
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "When a model that is not set up on the playing area moves onto the table, measure the move from its entry point as determined in the scenario."
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "bold"},
                                    content: "Terrain"
                                }
                            ]
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "Set up terrain as explained in the terrain section of the book. It is important for any battlefield to have enough terrain to block Line of Sight at regular intervals so that the game does not turn into a battle where only longrange weapons matter. Both players should set up an equal number of terrain pieces"
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "",
                            subcontent: [
                                {
                                    tags: {desc_type : "bold"},
                                    content: "Game Length"
                                }
                            ]
                        },
                        {
                            tags: {desc_type : "paragraph"},
                            content: "At the end of the fifth turn of the game, one of the players rolls a D6. If the result is 4 or more, the game ends. If the game continues, the game ends at the end of the sixth turn. "
                        }
                    ]
    
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor()
    {
        this.GatherObjectives();
        this.GatherDeployments();
        this.BuildDeeds(3, this.ListOfDeedsGroupA);
        this.BuildDeeds(1, this.ListOfDeedsGroupB);
        this.BuildDeeds(2, this.ListOfDeedsGroupC); 
        
        this.ScenarioDataDesc = DescriptionFactory(this.ScenarioData, this);   
        this.DeedDataDesc = DescriptionFactory(this.DeedData, this);   
        this.DeploymentDataDesc = DescriptionFactory(this.DeploymentData, this);       
        this.RulesDataDesc = DescriptionFactory(this.RulesData, this);       
        this.ConstructNewScenario().then(result => {
            if (this.CurrentScenario == null) {
            this.CurrentScenario = result; }});
        
    }

    // Regenerates the scenario held by the generator
    public async ResetScenario() {
        this.CurrentScenario = await this.ConstructNewScenario();
    }

    // Given a specific code, create the corresponding random scenario
    public async SetCodeScenario(code : string) {

        const code_split = code.split(/\D+/)

        if (code_split.length == 8) {
            const code_values : GenCode = {
                obj : Number(code_split[1]),
                dep : Number(code_split[2]),
                gl_a_1 : Number(code_split[3]),
                gl_a_2 : Number(code_split[4]),
                gl_b_1 : Number(code_split[5]),
                gl_b_2 : Number(code_split[6]),
                gl_fn : Number(code_split[7])
            }
            this.CurrentScenario = await this.ConstructNewScenario(code_values);
        }else {
            this.CurrentScenario = await this.ConstructNewScenario();
        }
    }

    // Get all objectives that a scenario can have
    public GatherObjectives() {
        const AllObjectives : GenerateObjective[] = Requester.MakeRequest(
            {searchtype: "file", searchparam: {type: 'scenarioobjective'}}
        ) as GenerateObjective[]

        this.ListOfObjectives = AllObjectives;
    }

    // Get all deployment options a scenario can have
    public GatherDeployments() {
        const AllDeployments : GenerateDeployment[] = Requester.MakeRequest(
            {searchtype: "file", searchparam: {type: 'scenariodeployment'}}
        ) as GenerateDeployment[]

        this.ListOfDeployments = AllDeployments;
    }
    
    // Build all glorious deeds for a scenario
    public BuildDeeds(group_id : number, group_list : GloriousDeed[]) {
        const AllDeedsGroup : IGloriousDeed[] = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "gloriousdeed",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "tags",
                                value: "random_gen_group",
                                equals: true,
                                strict: true,
                                istag : true,
                                tagvalue: group_id
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IGloriousDeed[]

        for (let i = 0; i < AllDeedsGroup.length; i++) {
            const NewDeed : GloriousDeed = GloriousDeedFactory.CreateGloriousDeed(AllDeedsGroup[i], null);
            group_list.push(NewDeed);
        }
    }

    // Build a new scenario, or a specific one if given a code-created preset
    public async ConstructNewScenario(code? : GenCode) : Promise<ScenarioSet> {

        let genstring = "Ob"
        if (this.ListOfObjectives.length === 0) throw new Error("No objectives available.");
        if (this.ListOfDeedsGroupC.length === 0) throw new Error("No deeds available in Group C.");
        
        const obj_num = Math.floor(Math.random() * this.ListOfObjectives.length)
        
        const ChosenObjective : GenerateObjective = this.ListOfObjectives[code? code.obj : obj_num]
        genstring += zeroPad(obj_num,2);
        
        const FilteredDeploymentList : GenerateDeployment[] = this.ListOfDeployments.filter((item) => (!ChosenObjective.banned_deployments.includes(item.id)))
        if (FilteredDeploymentList.length === 0) throw new Error("No valid deployments available.");
        
        const dep_num = Math.floor(Math.random() * FilteredDeploymentList.length)
        
        const ChosenDeployment : GenerateDeployment = FilteredDeploymentList[code? code.dep : dep_num]
        genstring += "Dp"+zeroPad(dep_num,2);
        
        const deedfin_num = Math.floor(Math.random() * this.ListOfDeedsGroupC.length)
        genstring += "GlPo"
        const resultA = this.getTwoRandomElements(this.ListOfDeedsGroupA,genstring);
        const DeedsGroupA : GloriousDeed[] = code?  [this.ListOfDeedsGroupA[code.gl_a_1],this.ListOfDeedsGroupA[code.gl_a_2]]: resultA.elements;
        genstring = resultA.modifiedId;
        genstring += "GlPt"
        const resultB = this.getTwoRandomElements(this.ListOfDeedsGroupB,genstring);
        const DeedsGroupB : GloriousDeed[] = code?  [this.ListOfDeedsGroupB[code.gl_b_1],this.ListOfDeedsGroupB[code.gl_b_2]]: resultB.elements;
        genstring = resultB.modifiedId;
        genstring += "GlFn"
        const DeedsGroupC : GloriousDeed[] = [this.ListOfDeedsGroupC[code? code.gl_fn : deedfin_num]]
        
        const AllDeedsCombined : string[] = []
        for (let i = 0; i < DeedsGroupA.length; i++) {
            AllDeedsCombined.push(DeedsGroupA[i].ID);
        }
        for (let i = 0; i < DeedsGroupB.length; i++) {
            AllDeedsCombined.push(DeedsGroupB[i].ID)
        }
        for (let i = 0; i < DeedsGroupC.length; i++) {
            AllDeedsCombined.push(DeedsGroupC[i].ID)
        }
        genstring += zeroPad(deedfin_num,2);

        const NewScenarioJson : IScenario = {
            id: ChosenObjective.id+"_"+ChosenDeployment.id,
            name: ChosenObjective.name+" | "+ChosenDeployment.name,
            source: "core", 
            tags: {},
            contextdata : {},
            description: [],
            img_link : ChosenDeployment.img_link,
            forces : ChosenObjective.forces,
            battlefield : ChosenObjective.battlefield,
            infiltrators : {
                allowed: (ChosenDeployment.infiltrators? ChosenDeployment.infiltrators.allowed : ChosenObjective.infiltrators? ChosenObjective.infiltrators.allowed : 1),
                description: (ChosenDeployment.infiltrators? ChosenDeployment.infiltrators.description : ChosenObjective.infiltrators? ChosenObjective.infiltrators.description : [
                    {
                        tags: {desc_type : "default"},
                        content: "Infiltrators can be deployed."
                    }
                ])
            },
            deployment : ChosenDeployment.deployment,
            battle_length : (ChosenDeployment.battle_length? ChosenDeployment.battle_length : { 
                min: 5,
                max: 6,
                description: [
                    {
                        tags: {desc_type : "default"},
                        content: "At the end of the fifth turn of the game, one of the players rolls a D6. If the result is 4 or more, the game ends. If the game continues, the game ends at the end of the sixth turn."
                    }
                ]
            } ),
            victory_conditions : ChosenObjective.victory_conditions,
            glorious_deeds : {
                deeds : AllDeedsCombined,
                optional_deeds : [],
                description: [
                    {
                        tags: {desc_type : "default"},
                        content: "Players score one Glory Point for every model that completes any of the following Glorious Deeds. Glory Points for these can only be gained once – whichever player completes them first gets the Glory!"
                    }
                ]
            },
            special_rules : (ChosenObjective.special_rules || []).concat(ChosenDeployment.special_rules || [])
        }

        const info : GenTitles = {            
            obj : ChosenObjective.name,
            dep : ChosenDeployment.name,
            gl_a_1 : DeedsGroupA[0].GetTrueName(),
            gl_a_2 : DeedsGroupA[1].GetTrueName(),
            gl_b_1 : DeedsGroupB[0].GetTrueName(),
            gl_b_2 : DeedsGroupB[1].GetTrueName(),
            gl_fn : DeedsGroupC[0].GetTrueName()
        }
        const ScenGen : Scenario = await ScenarioFactory.CreateScenario(NewScenarioJson, null);
        return {
            genscen : ScenGen,
            id : genstring,
            infobox: info
        }
        
    }

    // For any give list, return two random elements alongwith their codes for a gen code
    public getTwoRandomElements<T>(arr: any[], idstring : string): { elements: any[], modifiedId: string } {      
        const index1 = Math.floor(Math.random() * arr.length);
        let index2 = index1;
        while (index2 === index1) {
            index2 = Math.floor(Math.random() * arr.length);
        }
        idstring += zeroPad(index1,2) + "_" 
        idstring += zeroPad(index2,2) 
        
        return {
            elements: [arr[index1], arr[index2]],
            modifiedId: idstring
        };
    }

}

export {ScenarioGenerator, GenerateDeployment, GenerateObjective, ScenarioSet}

