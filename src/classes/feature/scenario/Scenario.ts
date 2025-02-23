import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';

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
    even_match: number, // 0 = No, 1 = Yes, 2 = Special
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
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IScenario, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
    }

}

export {IScenario, Scenario, ForcesData, BattlefieldData, InfiltratorData, DeploymentData, VictoryData, BattleLengthData, GloriousDeedData}

