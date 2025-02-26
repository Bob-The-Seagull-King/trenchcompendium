import { ScenarioFactory } from '../../../factories/features/ScenarioFactory';
import { Requester } from '../../../factories/Requester';
import { GloriousDeedFactory } from '../../../factories/features/GloriousDeedFactory';
import { RuleFactory } from '../../../factories/features/RuleFactory';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { Rule } from '../faction/Rule';
import { GloriousDeed, IGloriousDeed } from './GloriousDeed';
import { ForcesData, BattlefieldData, InfiltratorData, DeploymentData, BattleLengthData, VictoryData, GloriousDeedData, Scenario, IScenario } from './Scenario';

interface GenerateObjective extends IContextObject {
    forces : ForcesData,
    battlefield : BattlefieldData,
    infiltrators? : InfiltratorData,
    victory_conditions : VictoryData,
    special_rules : string[],
    banned_deployments: string[]
}

interface GenerateDeployment extends IContextObject {
    img_link : string,
    infiltrators? : InfiltratorData,
    deployment : DeploymentData,
    battle_length? : BattleLengthData,
    special_rules : string[]
}

class ScenarioGenerator {

    public ListOfObjectives : GenerateObjective[] = [];
    public ListOfDeployments : GenerateDeployment[] = [];
    public ListOfDeedsGroupA : GloriousDeed[] = [];
    public ListOfDeedsGroupB : GloriousDeed[] = [];
    public ListOfDeedsGroupC : GloriousDeed[] = [];

    public CurrentScenario : Scenario = ScenarioFactory.CreateNewScenario("sc_claimnomansland", null);
    
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor()
    {
        this.GatherObjectives();
        this.GatherDeployments();
        this.BuildDeeds(0, this.ListOfDeedsGroupA);
        this.BuildDeeds(1, this.ListOfDeedsGroupB);
        this.BuildDeeds(2, this.ListOfDeedsGroupC);
        //this.CurrentScenario = this.ConstructNewScenario();
    }

    public ResetScenario() {
        this.CurrentScenario = this.ConstructNewScenario();
    }

    public GatherObjectives() {
        const AllObjectives : GenerateObjective[] = Requester.MakeRequest(
            {searchtype: "file", searchparam: {type: 'scenarioobjective'}}
        ) as GenerateObjective[]

        this.ListOfObjectives = AllObjectives;
    }

    public GatherDeployments() {
        const AllDeployments : GenerateDeployment[] = Requester.MakeRequest(
            {searchtype: "file", searchparam: {type: 'scenariodeployment'}}
        ) as GenerateDeployment[]

        this.ListOfDeployments = AllDeployments;
    }
    
    public BuildDeeds(group_id : number, group_list : GloriousDeed[]) {
        const AllDeedsGroup : IGloriousDeed[] = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "factionequipmentrelationship",
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

    public ConstructNewScenario() {
        if (this.ListOfObjectives.length === 0) throw new Error("No objectives available.");
        if (this.ListOfDeedsGroupC.length === 0) throw new Error("No deeds available in Group C.");

        const ChosenObjective : GenerateObjective = this.ListOfObjectives[Math.floor(Math.random() * this.ListOfObjectives.length)]
        const FilteredDeploymentList : GenerateDeployment[] = this.ListOfDeployments.filter((item) => (!ChosenObjective.banned_deployments.includes(item.id)))
        if (FilteredDeploymentList.length === 0) throw new Error("No valid deployments available.");
        const ChosenDeployment : GenerateDeployment = FilteredDeploymentList[Math.floor(Math.random() * FilteredDeploymentList.length)]

        const DeedsGroupA : GloriousDeed[] = this.getTwoRandomElements(this.ListOfDeedsGroupA);
        const DeedsGroupB : GloriousDeed[] = this.getTwoRandomElements(this.ListOfDeedsGroupB);
        const DeedsGroupC : GloriousDeed[] = [this.ListOfDeedsGroupC[Math.floor(Math.random() * this.ListOfDeedsGroupC.length)]]

        const AllDeedsCombined : string[] = []
        for (let i = 0; i < DeedsGroupA.length; i++) {AllDeedsCombined.push(DeedsGroupA[i].ID)}
        for (let i = 0; i < DeedsGroupB.length; i++) {AllDeedsCombined.push(DeedsGroupB[i].ID)}
        for (let i = 0; i < DeedsGroupC.length; i++) {AllDeedsCombined.push(DeedsGroupC[i].ID)}

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
                allowed: (ChosenDeployment.infiltrators? ChosenDeployment.infiltrators.allowed : ChosenObjective.infiltrators? ChosenObjective.infiltrators.allowed : 0),
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
                        content: "Players score one Glory Point for every model that completes any of the following Glorious Deeds. Victory Points for these can only be gained once – whichever player completes them first gets the Glory!"
                    }
                ]
            },
            special_rules : (ChosenObjective.special_rules || []).concat(ChosenDeployment.special_rules || [])
        }

        return ScenarioFactory.CreateScenario(NewScenarioJson, null);
    }

    public getTwoRandomElements<T>(arr: T[]): [T, T] {      
        const index1 = Math.floor(Math.random() * arr.length);
        let index2;
        do {
            index2 = Math.floor(Math.random() * arr.length);
        } while (index2 === index1);
        
        return [arr[index1], arr[index2]];
    }

}

export {ScenarioGenerator}

