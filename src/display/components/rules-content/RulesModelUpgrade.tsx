import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import UpgradeDisplay from "../features/ability/UpgradeDisplay";
import {ModelUpgradeRelationship} from "../../../classes/relationship/model/ModelUpgradeRelationship";
import {getCostType} from "../../../utility/functions";
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';


interface RulesModelUpgradeProps {
    item: any;
}

const RulesModelUpgrade: React.FC<RulesModelUpgradeProps> = ({ item }) => {

    const abilityObject: ModelUpgradeRelationship = item
    
    const [maximum, setmaximum] = useState("")
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

            setmaximum(result.join(", "));
            setkeyvar((prev) => prev + 1);
        }

        SetModelOptions();
    }, []);
    
    return (
        <>
            <span className={'upgrade-name'}>
               {abilityObject.UpgradeObject.Name + ": "}
            </span>

            <UpgradeDisplay data={abilityObject.UpgradeObject}/>

            {abilityObject.Cost != 0 &&
                <div className={'upgrade-cost'}>
                    <strong>{'Cost: '}</strong>
                    {abilityObject.Cost + " " + getCostType(abilityObject.CostType)}
                </div>
            }

            {abilityObject.WarbandLimit != 0 &&
                <div className={'upgrade-limit'}>
                    {(abilityObject.WarbandLimit != 0 ? (" " + "(Limit " + maximum + ")") : "")}
                </div>
            }
        </>
    )
};

export default RulesModelUpgrade;
