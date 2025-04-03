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
import { getColour, makestringpresentable } from '../../../../utility/functions';
import { ModelEquipmentRelationship } from '../../../../classes/relationship/model/ModelEquipmentRelationship';
import GenericDisplay from '../../../components/generics/GenericDisplay';
import AbilityDisplay from '../ability/AbilityDisplay';
import EquipmentDisplay from './EquipmentDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericSoloBlockDisplay';

const ModelEquipmentDisplay = (props: any) => {
    const abilityObject: ModelEquipmentRelationship = props.data
    const team_color : string = props.team_col;
    const collection_name : string = (props.col_name != undefined? props.col_name : "Pre-Equipped Items")

    function ReturnEquipment(item : Equipment, obj : ModelEquipmentRelationship) {
        return (
            <>
                <EquipmentDisplay data={item} />
                <div className="borderthin bordergrey">
                    <span className="colordefault totalmarginsml">
                        {
                            obj.Removable == true? "Removable" : "Cannot Be Removed"
                        }
                    </span>
                </div>
            </>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelEquipmentDisplay.tsx</div>}>
            
            {(collection_name != "Pre-Equipped Items") && 
            <div>
            <GenericCollapsableBlockDisplay 
                d_name={collection_name} 
                d_colour={"grey"} 
                d_state={false}  
                d_margin={"sml"}
                bordertype={0}
                d_method={() => <div className="">
                    {abilityObject.EquipmentItems.map((item) => ( 
                        <div key={"model_equipment_"+abilityObject.ID+"_equipment_id_"+item.ID}>
                            <GenericCollapsableBlockDisplay 
                                                d_name={item.Name} 
                                                d_colour={"grey"} 
                                                d_state={false}  
                                                d_col={"default"}
                                                d_margin={"sml"}
                                                d_border={false}
                                                bordertype={0}
                                                d_method={() => <div className="">
                                                {ReturnEquipment(item, abilityObject)}
                                                </div>} />
                            
                        </div>
                    )) /* Abilities */}
                </div>} />
                
            </div>
            }
            {(collection_name == "Pre-Equipped Items") && 
            <div>
                {abilityObject.EquipmentItems.map((item) => ( 
                            <div key={"model_equipment_"+abilityObject.ID+"_equipment_id_"+item.ID}>
                                <GenericCollapsableBlockDisplay 
                                                    d_name={item.Name} 
                                                    d_colour={"grey"} 
                                                    d_state={false}  
                                                    d_col={"default"}
                                                    d_margin={"sml"}
                                                    d_border={false}
                                                    bordertype={0}
                                                    d_method={() => <div className="">
                                                    {ReturnEquipment(item, abilityObject)}
                                                    </div>} />
                                
                            </div>
                        )) /* Abilities */}
                
            </div>
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
        </ErrorBoundary>
    )
}

export default ModelEquipmentDisplay;