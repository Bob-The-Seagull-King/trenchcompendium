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
import { ContextPackage } from '../../contextevent/contextpackage';

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

    
    /**
     * Grabs any additional packages unique to
     * class implementation.
     */
    public async GrabSpecialPackages(event_id : string, source_obj : ContextObject, arrs_extra : any[]) : Promise<ContextPackage[]> { 
        const static_packages : ContextPackage[] = []
        /*for (let i = 0; i < this.Skills.length; i++) {
            const temp_packages : any[] = await this.Skills[i].GrabContextPackages(event_id, source_obj, arrs_extra);
            for (let j = 0; j < temp_packages.length; j++) {
                temp_packages[j].callpath.push("Patron")
                static_packages.push(temp_packages[j]);
            }
        }*/
        return static_packages;
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


    /**
     * Gets the Name of the Patron
     */
    public GetName () {
        return this.Name;
    }

    /**
     * Gets the description text
     */
    public GetDescription () {
        return this.Description;
    }


    /**
     * Return the description as string
     *
     */
    public GetMetaDescription () {
        if (this.Description.length > 0) {
            return this.Description[0].Content;
        }
        return '';
    }
}

export {IPatron, Patron, IPatronRelationship}

