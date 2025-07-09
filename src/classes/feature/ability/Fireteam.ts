/**
 * skill
 */
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { BaseAddon, IBaseAddon } from './BaseAddon';
import { EventRunner } from '../../contextevent/contexteventhandler';

class Fireteam extends BaseAddon {

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IAbility format
     */
    public constructor(data: IBaseAddon, parent : ContextObject | null)
    {
        super(data, parent)
    }

}

export {Fireteam}

