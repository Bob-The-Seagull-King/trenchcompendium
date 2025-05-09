import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../classes/feature/model/Model';
import { Ability } from '../../../../classes/feature/ability/Ability';
import { Equipment, EquipmentStats } from '../../../../classes/feature/equipment/Equipment';
import GenericHover from '../../../components/generics/GenericHover';
import KeywordDisplay from '../glossary/KeywordDisplay';
import ItemStat from '../../../components/subcomponents/description/ItemStat';
import { getColour, getCostType, makestringpresentable } from '../../../../utility/functions';
import { ModelEquipmentRelationship } from '../../../../classes/relationship/model/ModelEquipmentRelationship';
import GenericDisplay from '../../../components/generics/GenericDisplay';
import AbilityDisplay from '../ability/AbilityDisplay';
import EquipmentDisplay from './EquipmentDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericSoloBlockDisplay';
import RulesEquipmentEntry from "../../rules-content/RulesEquipmentEntry";

const ModelEquipmentDisplay = (props: any) => {
    const abilityObject: ModelEquipmentRelationship = props.data
    const team_color : string = props.team_col;
    const collection_name : string = (props.col_name != undefined? props.col_name : "Pre-Equipped Items")

    function ReturnEquipment(item : Equipment, obj : ModelEquipmentRelationship) {
        return (
            <>
                <EquipmentDisplay data={item} />
                <div className="borderthin bordergrey">
                    <>
                        {
                            obj.Removable == true? "Removable" : "Cannot Be Removed"
                        }
                    </>
                    {obj.SaleValue != 0 &&
                    
                    <>
                        {
                           "Can be sold for " + obj.SaleValue + " " + getCostType(obj.SaleType)
                        }
                    </>
                    }
                </div>
            </>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelEquipmentDisplay.tsx</div>}>
            <div className={'ModelEquipmentDisplay'}>

                {(collection_name != "Pre-Equipped Items") &&
                <>
                    {abilityObject.EquipmentItems.map((item) =>
                        <RulesEquipmentEntry
                            key={item.ID}
                            equipment={item}
                        />
                    )}
                </>
                }

                {(collection_name == "Pre-Equipped Items") &&
                <>
                    {abilityObject.EquipmentItems.map((item) =>
                        <RulesEquipmentEntry
                            key={item.ID}
                            equipment={item}
                        />
                    )}

                </>
                }

                {abilityObject.MyOptions.length > 0 &&
                <>
                    {abilityObject.MyOptions.map((item) => (
                        <div key={item.RefID} >
                            <GenericCollapsableBlockDisplay
                                d_name={"Choose One Of The Following"}
                                d_colour={"grey"}
                                d_state={false}
                                d_margin={"sml"}
                                bordertype={0}
                                d_method={() => <div className="">
                                    {item.Selections.map((subitem) => (
                                        <div key={"model_equipment_"+abilityObject.ID+"_equipment_id_"+subitem.value.ID}>

                                            <div className={""}>
                                                    <ModelEquipmentDisplay col_name={"Option " + (1+ item.Selections.indexOf(subitem))} data={subitem.value} team_col={team_color}/>
                                            </div>
                                        </div>
                                    )) /* Abilities */}
                                </div>} />
                        </div>
                    )) /* Abilities */}
                </>}
            </div>
        </ErrorBoundary>
    )
}

export default ModelEquipmentDisplay;