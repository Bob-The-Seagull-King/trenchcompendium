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

    public BonusUpgrades: ModelUpgradeRelationship[] | null = null;

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

