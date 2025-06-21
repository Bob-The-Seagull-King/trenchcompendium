/**
 * skill
 */
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { BaseAddon, IBaseAddon } from './BaseAddon';
import { EventRunner } from '../../contextevent/contexteventhandler';

interface ISkill extends IBaseAddon {
    table_val? : number,
    skill_group: string[]
}

class Skill extends BaseAddon {
    public TableVal : number;
    public SkillGroups : string[];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: ISkill, parent : ContextObject | null)
    {
        super(data, parent)

        this.SkillGroups = data.skill_group;

        if (data.table_val) {
            this.TableVal = data.table_val
        } else {
            this.TableVal = -1;
        }

    }


}

export {ISkill, Skill}

