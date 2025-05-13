import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import UpgradeDisplay from "../features/ability/UpgradeDisplay";
import {ModelUpgradeRelationship} from "../../../classes/relationship/model/ModelUpgradeRelationship";
import {getCostType} from "../../../utility/functions";
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import ModelUpgradeDisplay from "../features/ability/ModelUpgradeDisplay";


interface RulesModelUpgradeProps {
    item: any;
}

const RulesModelUpgrade: React.FC<RulesModelUpgradeProps> = ({ item }) => {

    const abilityObject: ModelUpgradeRelationship = item
    
    const [maximum, setmaximum] = useState("")
    const [restrict, setrestrict] = useState("")
    const [_keyvar, setkeyvar] = useState(0);

    useEffect(() => {
        async function SetModelOptions() {
            const EventProc: EventRunner = new EventRunner();

            const result = await EventProc.runEvent(
                "getUpgradeLimitPresentation",
                abilityObject,
                [],
                [abilityObject.WarbandLimit.toString()],
                true
            );

            const restrictions = await abilityObject.GetRestrictions();
            setrestrict(restrictions)
            setmaximum(result.join(", "));
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);
    
    return (
        <div className={'RulesModelUpgrade'}>
            <div className={'RulesModelUpgrade-title'}>
                {abilityObject.UpgradeObject.GetName()}

                {abilityObject.GetCostString() != '' &&
                    <span className={'cost'}>
                        {' - ' + abilityObject.GetCostString()}
                    </span>
                }
            </div>

            <div className={'RulesModelUpgrade-description'}>
                <ModelUpgradeDisplay data={item}/>
            </div>

            {/*{restrict != "" &&*/}
            {/*    <div className={'upgrade-limit'}>*/}
            {/*        {(restrict != "" ? (" " + "(Requirements: " + restrict + ")") : "")}*/}
            {/*    </div>*/}
            {/*}*/}
        </div>
    )
};

export default RulesModelUpgrade;
