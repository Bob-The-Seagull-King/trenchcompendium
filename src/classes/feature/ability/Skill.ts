/**
 * skill
 */
import { ContextObject } from '../../contextevent/contextobject';
import { BaseAddon, IBaseAddon } from './BaseAddon';

interface ISkill extends IBaseAddon {
    table_val? : number,
    skill_group: string[]
}

class Skill extends BaseAddon {
    public TableVal : number;
    public SkillGroups : string[];

    /**
     * Assigns parameters and creates a series of
     * objects
     * @param data Object data in ISkill format
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

