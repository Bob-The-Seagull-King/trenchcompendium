import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../../utility/util'
import { Model } from '../../../../classes/feature/model/Model';
import GenericDisplay from '../../generics/GenericDisplay';
import AbilityDisplay from '../ability/AbilityDisplay';
import GenericHover from '../../generics/GenericHover';
import KeywordDisplay from '../glossary/KeywordDisplay';
import ItemStat from '../../subcomponents/description/ItemStat';
import { ModelStatistics } from '../../../../classes/feature/model/ModelStats';
import { getBaseSize, getColour, getCostType, getMoveType, getPotential } from '../../../../utility/functions';
import ModelUpgradeDisplay from '../ability/ModelUpgradeDisplay';
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { IChoice } from '../../../../classes/options/StaticOption';
import ModelEquipmentDisplay from '../equipment/ModelEquipmentDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import { Form } from 'react-bootstrap';
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import ModelDisplay from './ModelDisplay';
import GenericPopup from '../../../components/generics/GenericPopup';

const FactionModelDisplay = (props: any) => {
    const factionmodelObject: FactionModelRelationship = props.data


    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionModelDisplay.tsx</div>}>
            <div className='textmaxwidth row'>
                <div className="col-3">
                    <GenericPopup  d_colour={factionmodelObject.Model.Team} titlename={factionmodelObject.Model.Name} d_name={factionmodelObject.Model.Name} d_type={""} d_method={() => 
                        <div className="abilityInternalStructure">
                            <ModelDisplay data={factionmodelObject.Model} />
                        </div>}/>
                </div>
                <div className="col-2">
                    <span className=" bodytext complextext">
                        {
                            factionmodelObject.Cost + " " + 
                            getCostType(factionmodelObject.CostType)
                        }
                    </span>
                </div>
                <div className="col-4">

                </div>
                <div className="col-3">

                </div>
            </div>
        </ErrorBoundary>
    )
}

export default FactionModelDisplay;