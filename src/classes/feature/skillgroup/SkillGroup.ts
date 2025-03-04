/**
 * explorationtable
 */
import { byPropertiesOf, DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { Requester } from '../../../factories/Requester';
import { ExplorationFactory } from '../../../factories/features/ExplorationFactory';
import { ISkill, Skill } from '../ability/Skill';
import { SkillFactory } from '../../../factories/features/SkillFactory';


class SkillGroup extends StaticContextObject {
    public Skills : Skill[] = [];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IContextObject, parent : ContextObject | null)
    {
        super(data, parent)
        this.BuildFactionEquipment(data.id);
    }

    
    public BuildFactionEquipment(id : string) {
        const LocationList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "skill",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "skill_group",
                                value: id,
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as ISkill[]


        for (let i = 0; i < LocationList.length; i++) {
            this.Skills.push(SkillFactory.CreateSkill(LocationList[i], this))
        }

        this.Skills.sort(byPropertiesOf<Skill>(["TableVal"]))
    }

}

export {SkillGroup}

