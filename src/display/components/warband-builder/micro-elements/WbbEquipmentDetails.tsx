import React from 'react';
import {FactionEquipmentRelationship} from "../../../../classes/relationship/faction/FactionEquipmentRelationship";
import {makestringpresentable} from "../../../../utility/functions";
import {Equipment} from "../../../../classes/feature/equipment/Equipment";
import GenericHover from "../../generics/GenericHover";
import KeywordDisplay from "../../features/glossary/KeywordDisplay";
import {returnDescription} from "../../../../utility/util";

interface WbbEquipmentDetailsProps {
    equipment: Equipment;
    showType?: boolean;
}

const WbbEquipmentDetails: React.FC<WbbEquipmentDetailsProps> = ({ equipment, showType }) => {

    return (
        <div className={'WbbEquipmentDetails equipment-details'}>
            <table>
                <tr>
                    <td>
                        Range
                    </td>
                    <td>
                        {equipment.GetRange()}
                    </td>
                </tr>

                {(equipment.Category && showType) &&
                    <tr>
                        <td>
                            Type
                        </td>
                        <td>
                            {makestringpresentable(equipment.Category)}
                        </td>
                    </tr>
                }
                {equipment.GetModifiers() &&
                    <tr>
                        <td>
                            Modifiers
                        </td>
                        <td>
                            {equipment.GetModifiers()}
                        </td>
                    </tr>
                }
            </table>

            { equipment.GetKeyWords().length > 0 &&
                <div className={'keywords-wrap'}>
                    <div className={'text-label'}>
                        {'Keywords'}
                    </div>
                    <div className={'keywords'}>
                        <p className={'keywords'}>
                            {equipment.GetKeyWords().map((item, index) => (
                                <span className='' key={"equipment_keyword_" + item.GetID() + "_keyword_id"}>
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
                </div>
            }

            { equipment.GetDescription() &&
                <div className={'rules-wrap'}>
                    <div className={'text-label'}>
                        {'Rules'}
                    </div>
                    <div className={'rules'}>
                        {equipment.GetDescription()}
                    </div>
                </div>
            }
        </div>
    );
};

export default WbbEquipmentDetails;