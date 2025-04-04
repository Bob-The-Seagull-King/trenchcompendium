import { IModelUpgradeRelationship, ModelUpgradeRelationship } from '../../relationship/model/ModelUpgradeRelationship';
import { AbilityFactory } from '../../../factories/features/AbilityFactory';
import { KeywordFactory } from '../../../factories/features/KeywordFactory';
import { DescriptionFactory } from '../../../utility/functions';
import { ContextObject, IContextObject } from '../../contextevent/contextobject';
import { StaticContextObject } from '../../contextevent/staticcontextobject';
import { Ability } from '../ability/Ability';
import { IKeyword, Keyword } from '../glossary/Keyword';
import { Requester } from '../../../factories/Requester';
import { UpgradeFactory } from '../../../factories/features/UpgradeFactory';
import { IModelEquipmentRelationship, ModelEquipmentRelationship } from '../../relationship/model/ModelEquipmentRelationship';
import { EquipmentFactory } from '../../../factories/features/EquipmentFactory';
import { ContextPackage } from '../../contextevent/contextpackage';
import { EventRunner } from '../../contextevent/contexteventhandler';
import { EquipmentLimit, EquipmentRestriction } from '../equipment/Equipment';
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
     * @param data Object data in IModel format
     */
    public constructor(data: IRule, parent : ContextObject | null)
    {
        super(data, parent)
        this.Description = DescriptionFactory(data.description, this);
        this.RunUpgradeOptions();
        this.RunOptionsParse();
    }

    public RunOptionsParse() {
        
        const EventProc : EventRunner = new EventRunner();
        for (let i = 0; i < this.MyOptions.length; i++) {
            EventProc.runEvent(
                "parseOptionFilterDown",
                this,
                [],
                this.MyOptions[i].Selections,
                i
            ).then(result => {
                this.MyOptions[i].Selections = result;
                EventProc.runEvent(
                    "parseOptionsIntoRelevantType",
                    this,
                    [],
                    this.MyOptions[i].Selections,
                    i
                ).then(result => {
                    this.MyOptions[i].Selections = result;
                });
            });
        }
    }
    

    public RunUpgradeOptions() {
        const EventProc : EventRunner = new EventRunner();

        EventProc.runEvent(
            "getFactionRuleUpgrades",
            this,
            [],
            [],
            null
        ).then(result => {
            this.BonusUpgrades = result;
        });
    }


}

export {IRule, Rule}

