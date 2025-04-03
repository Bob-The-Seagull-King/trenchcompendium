import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import UpgradeDisplay from "../ability/UpgradeDisplay";
import {ModelUpgradeRelationship} from "../../../../classes/relationship/model/ModelUpgradeRelationship";
import {getCostType} from "../../../../utility/functions";


interface RulesModelUpgradeProps {
    item: any;
}

const RulesModelUpgrade: React.FC<RulesModelUpgradeProps> = ({ item }) => {

    const abilityObject: ModelUpgradeRelationship = item

    return (
        <>
            <UpgradeDisplay data={abilityObject.UpgradeObject}/>

            {abilityObject.Cost != 0 &&
                <div className={'upgrade-cost'}>
                    <strong>{'Cost: '}</strong>
                    {abilityObject.Cost + " " + getCostType(abilityObject.CostType)}
                </div>
            }

            {abilityObject.WarbandLimit != 0 &&
                <div className={'upgrade-limit'}>
                    {(abilityObject.WarbandLimit != 0 ? (" " + "(Limit " + abilityObject.WarbandLimit + ")") : "")}
                </div>
            }
        </>
    )
};

export default RulesModelUpgrade;
