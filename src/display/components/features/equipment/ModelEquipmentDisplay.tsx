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
import RulesEquipmentMain from '../../../components/rules-content/RulesEquipmentMain';
import RulesEquipmentStats from '../../../components/rules-content/RulesEquipmentStats';
import RulesOverlay from '../../../components/rules-content/RulesOverlay';

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
                    {abilityObject.getUniqueEquipment().map((item) =>
                        <RulesEquipmentEntry
                            key={item.ID}
                            equipment={item}
                        />
                    )}
                </>
                }

                {(collection_name == "Pre-Equipped Items") &&
                <>
                    {abilityObject.getUniqueEquipment().map((item) =>
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
                            <table className={'table_headed table_headed-highlight'} style={{width:"100%"}}>
                                <thead>
                                    <tr>
                                        <th>Choose One of the Following</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {item.Selections.map((subitem) => (
                                        <tr key={subitem.value.ID}>
                                            <td className={'font-normal'}>
                                                {(subitem.value as ModelEquipmentRelationship).EquipmentItems.map((subsubitem) => 
                                                    <span 
                                                        key={subsubitem.ID} >
                                                        {(subitem.value as ModelEquipmentRelationship).EquipmentItems.indexOf(subsubitem) > 0 &&
                                                            <span>{" and "}</span>
                                                        }
                                                        <RulesOverlay
                                                        titlename={subsubitem.Name}
                                                        d_method={() =>
                                                            
                                                            <div className={'rules-equipment-main'}>                    
                                                                {/* Stats */}
                                                                <RulesEquipmentStats
                                                                    facrelObject={undefined}
                                                                    baseobject={subsubitem}
                                                                />
                                                                <RulesEquipmentMain data={subsubitem}/>
                                                            </div>
                                                            }/>
                                                    </span>
                                                
                                                )}
                                                </td>
                                        </tr>
                                    )) /* Abilities */}
                                </tbody>
                            </table>
                            
                        </div>
                    )) /* Abilities */}
                </>}
            </div>
        </ErrorBoundary>
    )
}

export default ModelEquipmentDisplay;