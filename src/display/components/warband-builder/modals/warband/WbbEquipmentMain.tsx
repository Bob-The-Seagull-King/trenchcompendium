import '../../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import { returnDescription } from '../../../../../utility/util'
import GenericHover from '../../../generics/GenericHover';
import KeywordDisplay from '../../../features/glossary/KeywordDisplay';
import {Equipment, EquipmentStats} from '../../../../../classes/feature/equipment/Equipment';
import { Keyword } from '../../../../../classes/feature/glossary/Keyword';
import { WarbandPurchase, RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { WarbandEquipment } from '../../../../../classes/saveitems/Warband/Purchases/WarbandEquipment';

interface EquipmentItemProps {
    item: WarbandPurchase
    keywords : Keyword[]
}

const WbbEquipmentMain: React.FC<EquipmentItemProps> = (props : EquipmentItemProps) => {

    const abilityObject = (((props.item.HeldObject as WarbandEquipment).MyEquipment.SelfDynamicProperty.OptionChoice as Equipment))
    
    return (
        <div className={'WbbEquipmentMain'}>
            {/* Keywords */}
            {abilityObject.KeyWord.length > 0 &&
                <>
                    <div className={'text-label'}>
                        {'Keywords'}
                    </div>
                    <p className={'keywords'}>
                        {props.keywords.map((item, index) => (
                            <span className='' key={"equipment_keyword_" + abilityObject.ID + "_keyword_id_" + item.ID}>
                                <GenericHover d_colour={'grey'} titlename={item.Name} d_name={item.Name}
                                              d_type={""} d_method={() => <KeywordDisplay data={item}/>}/>
                                {index < props.keywords.length - 1 && ", "}
                            </span>
                        )) /* Keywords */}
                    </p>
                </>
            }

            {/* Rules Text */}
            {abilityObject.Description.length > 0 &&
                <div className={'text-element text-rules'}>
                    <div className={'text-label'}>
                        {'Rules'}
                    </div>
                    {returnDescription(abilityObject, abilityObject.Description)}
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

export default WbbEquipmentMain;
