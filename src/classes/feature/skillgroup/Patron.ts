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
import { Faction } from '../faction/Faction';
import { FactionFactory } from '../../../factories/features/FactionFactory';

interface IPatron extends IContextObject {
    description: []
}

interface IPatronRelationship {
    id: string,
    faction_id: string[]
}

class Patron extends StaticContextObject {
    public Skills : Skill[] = [];
    public Factions : Faction[] = [];
    public Description;

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IPatron, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
    }

    
    public async BuildFactionEquipment(id : string) {
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
            this.Skills.push(await SkillFactory.CreateSkill(LocationList[i], this))
        }

        this.Skills.sort(byPropertiesOf<Skill>(["Name"]))
    }

    public async BuildFactionList(id : string) {
        const FactionList = Requester.MakeRequest(
            {
                searchtype: "complex", 
                searchparam: {
                    type: "patronrelationship",
                    request: {
                        operator: 'and',
                        terms: [
                            {
                                item: "id",
                                value: id,
                                equals: true,
                                strict: true
                            }
                        ],
                        subparams: []
                    }
                }
            }
        ) as IPatronRelationship[]


        for (let i = 0; i < FactionList.length; i++) {
            for (let j = 0; j < FactionList[i].faction_id.length; j++) {
                this.Factions.push(await FactionFactory.CreateNewFaction(FactionList[i].faction_id[j], this))
            }
        }

        this.Factions.sort(byPropertiesOf<Faction>(["Name"]))
    }

}

export {IPatron, Patron, IPatronRelationship}

