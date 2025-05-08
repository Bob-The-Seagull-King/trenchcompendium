import React from 'react';
import {Equipment} from "../../../classes/feature/equipment/Equipment";
import RulesEquipmentStats from "./RulesEquipmentStats";
import RulesEquipmentMain from "./RulesEquipmentMain";
import GenericHover from "../generics/GenericHover";
import KeywordDisplay from "../features/glossary/KeywordDisplay";
import {returnDescription} from "../../../utility/util";
import {useGlobalState} from "../../../utility/globalstate";

interface RulesEquipmentEntryProps {
    equipment: Equipment;
}

const RulesEquipmentEntry: React.FC<RulesEquipmentEntryProps> = ({ equipment }) => {

    console.log('equipment.GetDescription()');
    console.log(equipment.GetDescription());

    return (
        <div className="RulesEquipmentEntry">
            <h4 className="equipment-name">
                {equipment.GetName()}
            </h4>

            <table className={'rules-equipment-stats-table'}>
                <tbody>
                {equipment.GetCategory() != '' &&
                    <tr>
                        <td className={'label-cell'}>
                            {'Category'}
                        </td>
                        <td>
                            {equipment.GetCategory()}
                        </td>
                    </tr>
                }

                {equipment.GetRange() != '' &&
                    <tr>
                        <td className={'label-cell'}>
                            {'Range'}
                        </td>
                        <td>
                            {equipment.GetRange()}
                        </td>
                    </tr>
                }

                {(equipment.GetHandsMelee() != '' || equipment.GetHandsRanged() != '') &&
                    <tr>
                        <td className={'label-cell'}>
                            {'Hands'}
                        </td>
                        <td>
                            <div>
                                {equipment.GetHandsRanged() != "" &&
                                    equipment.GetHandsRanged() + ' (Ranged)'
                                }
                            </div>
                            <div>
                                {equipment.GetHandsMelee() != "" &&
                                    equipment.GetHandsMelee() + ' (Melee)'
                                }
                            </div>

                        </td>
                    </tr>
                }

                {equipment.GetModifiers().length > 0 &&
                    <tr>
                        <td className={'label-cell'}>
                            {'Modifiers'}
                        </td>
                        <td>
                            {equipment.GetModifiers()}
                        </td>
                    </tr>
                }
                </tbody>
            </table>

            {/* Keywords */}
            {equipment.GetKeyWords().length > 0 &&
                <div className={'rules-text-element'}>
                    <div className={'text-label'}>
                        {'Keywords'}
                    </div>
                    <p className={'keywords'}>
                        {equipment.GetKeyWords().map((item, index) => (
                            <span className='' key={"equipment_keyword_" + equipment.GetID() + "_keyword_id"}>
                            <GenericHover
                                d_colour={'grey'}
                                titlename={item.Name}
                                d_name={item.Name}
                                d_type={""}
                                d_method={() => <KeywordDisplay data={item}/>}
                            />
                            {index < equipment.GetKeyWords().length - 1 && ", "}
                        </span>
                        )) /* Keywords */}
                    </p>
                </div>
            }

            {/* Rules Text */}
            {equipment.GetDescription() &&
                <div className={'rules-text-element'}>
                    <div className={'text-label'}>
                        {'Rules'}
                    </div>
                    <p>
                        {equipment.GetDescription()}
                    </p>
                </div>
            }

            {/* Lore Text */}
            {/* @TODO show lore only if globally set */}
            {(equipment.GetLore()) &&
                <div className={'rules-text-element'}>
                    <div className={'text-label'}>
                        {'Lore'}
                    </div>
                    <p>
                        {equipment.GetLore()}
                    </p>
                </div>
            }

        </div>
    );
};

export default RulesEquipmentEntry;
