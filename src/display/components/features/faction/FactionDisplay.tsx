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
import { getBaseSize, getColour, getMoveType, getPotential } from '../../../../utility/functions';
import ModelUpgradeDisplay from '../ability/ModelUpgradeDisplay';
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { IChoice } from '../../../../classes/options/StaticOption';
import ModelEquipmentDisplay from '../equipment/ModelEquipmentDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import { Form } from 'react-bootstrap';
import { Faction } from '../../../../classes/feature/faction/Faction';
import RuleDisplay from './RuleDisplay';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';

const FactionDisplay = (props: any) => {
    const factionObject: Faction = props.data


    return (
        <ErrorBoundary fallback={<div>Something went wrong with FactionDisplay.tsx</div>}>
            <div className=''>
                <div className="row">
                    <span className="colordefault contentpacklabel complextext">
                        {factionObject.Name  /* Name */}
                    </span>
                </div>
                <div className="row">
                    {returnDescription(factionObject, factionObject.Description) /* Description */}
                </div>
                {factionObject.Rules.length > 0 &&
                    <>
                        <div className='separator bodytext tagboxpad colordefault'>Rules</div>
                        <div className="verticalspacerbig"/>
                        <div className="row">
                            {factionObject.Rules.map((item) => ( 
                                <div key={"faction_rule_"+factionObject.ID+"_rule_id_"+item.ID}>
                                    <GenericDisplay  d_colour={factionObject.Team} d_name={item.Name} d_type={"sub"} d_method={() => <RuleDisplay data={item} />}/>
                                    <div className="verticalspacerbig"/>
                                </div>
                            )) /* Abilities */}
                        </div>
                    </>
                }
                <div className='row'>
                    {
                        <OptionSetStaticDisplay data={factionObject.MyOptions} />
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default FactionDisplay;