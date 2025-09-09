import { ModelUpgradeRelationship } from '../../relationship/model/ModelUpgradeRelationship';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject } from '../../contextevent/contextobject';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { IStaticOptionContextObject, StaticOptionContextObject } from '../../options/StaticOptionContextObject';


interface IRule extends IStaticOptionContextObject {
    description : []
}

class Rule extends StaticOptionContextObject {
    
    public Description;

    public BonusUpgrades!: ModelUpgradeRelationship[];

    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IRule format
     */
    public constructor(data: IRule, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
    }

    // Converts the options a location might have
    // from raw JSON data into the proper class
    public async RunOptionsParse() {
        
        const EventProc : EventRunner = new EventRunner();
        for (let i = 0; i < this.MyOptions.length; i++) {
            const ResultA = await EventProc.runEvent(
                "parseOptionFilterDown",
                this,
                [],
                this.MyOptions[i].Selections,
                i
            )
            this.MyOptions[i].Selections = ResultA;
            this.MyOptions[i].Selections = await EventProc.runEvent(
                    "parseOptionsIntoRelevantType",
                    this,
                    [],
                    this.MyOptions[i].Selections,
                    i
                )
        }
    }
    
    // Gets the collection of upgrade options provided
    // by a faction rule.
    public async RunUpgradeOptions() {
        const EventProc : EventRunner = new EventRunner();

        this.BonusUpgrades = await EventProc.runEvent(
            "getFactionRuleUpgrades",
            this,
            [],
            [],
            null
        )
    }


}

export {IRule, Rule}

