import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
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

const ModelEquipmentDisplay = (props: any) => {
    const abilityObject: ModelEquipmentRelationship = props.data
    const team_color : string = props.team_col;

    function ReturnEquipment(item : Equipment, obj : ModelEquipmentRelationship) {
        return (
            <>
                <EquipmentDisplay data={item} />
                <div className="row abilityInternalStructure">
                    <span className="colordefault bodytext complextext">
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
           
            <div>
                {abilityObject.EquipmentItems.map((item) => ( 
                    <div key={"model_equipment_"+abilityObject.ID+"_equipment_id_"+item.ID}>
                        <GenericDisplay  d_colour={'default'} d_state={false}  d_name={item.Name} d_type={"sub"} d_method={() => ReturnEquipment(item, abilityObject) }/>
                        <div className="verticalspacerbig"/>
                    </div>
                )) /* Abilities */}
            </div>
            <div className="verticalspacerbig"/>
            <div>
                {abilityObject.MyOptions.map((item) => ( 
                    <div key={"model_equipment_"+abilityObject.ID+"_equipment_id_option_"+item.RefID}>
                        <div className={"borderstyler subborder"+getColour(team_color)}>
                        <div className={'titleShape hovermouse titlebody subbackground'+getColour(team_color)}>Choose One Of The Following</div>
                        <div className="row abilityInternalStructure">
                                {item.Selections.map((subitem) => ( 
                                    <div key={"model_equipment_"+abilityObject.ID+"_equipment_id_"+subitem.value.ID}>
                                        <ModelEquipmentDisplay data={subitem.value} team_col={team_color}/>
                                        <div className="verticalspacerbig"/>
                                    </div>
                                )) /* Abilities */}
                                {item.Selections.length > 1 &&                                     
                                    <div className={'separator bodytext tagboxpad color'+getColour(team_color)}></div>
                                }
                            </div>
                        </div>
                    </div>
                )) /* Abilities */}
            </div>
        </ErrorBoundary>
    )
}

export default ModelEquipmentDisplay;