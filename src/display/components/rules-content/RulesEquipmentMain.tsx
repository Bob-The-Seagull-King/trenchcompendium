import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import { returnDescription } from '../../../utility/util'
import GenericHover from '../generics/GenericHover';
import KeywordDisplay from '../features/glossary/KeywordDisplay';
import {Equipment, EquipmentStats} from '../../../classes/feature/equipment/Equipment';
import RulesEquipmentStats from "./RulesEquipmentStats";
import RulesModelDisplayAbility from './RulesModelDisplayAbility';




const RulesEquipmentMain = (props: any) => {
    const abilityObject: Equipment = props.data;

    return (
        <div className={'RulesEquipmentMain'}>
            {/* Keywords */}
            {abilityObject.KeyWord.length > 0 &&
                <>
                    <div className={'text-label'}>
                        {'Keywords'}
                    </div>
                    <p className={'keywords'}>
                        {abilityObject.KeyWord.map((item, index) => (
                            <span className='' key={"equipment_keyword_" + abilityObject.ID + "_keyword_id_" + item.ID}>
                                <GenericHover d_colour={'grey'} titlename={item.Name} d_name={item.Name}
                                              d_type={""} d_method={() => <KeywordDisplay data={item}/>}/>
                                {index < abilityObject.KeyWord.length - 1 && ", "}
                            </span>
                        )) /* Keywords */}
                    </p>
                </>
            }

            {/* Rules Text */}
            {(abilityObject.Description.length > 0|| abilityObject.Abilities.length > 0 ) &&
                <div className={'text-element text-rules'}>
                    <div className={'text-label'}>
                        {'Rules'}
                    </div>
                    {returnDescription(abilityObject, abilityObject.Description)}
                    {abilityObject.Abilities.map((item) => (
                            <React.Fragment
                                key={"equip_ability_" + abilityObject.ID + "_ability_id_" + item.ID}>
                                <RulesModelDisplayAbility data={item}/>
                            </React.Fragment>
                        ))}
                </div>
            }

            {/* Lore Text */}
            {abilityObject.Lore.length > 0 &&
                <div className={'text-element text-lore'}>
                    <div className={'text-label'}>
                        {'Lore'}
                    </div>

                    {returnDescription(abilityObject, abilityObject.Lore)}
                </div>
            }
        </div>
    )
};

export default RulesEquipmentMain;
