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
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import { ExplorationTable } from '../../../../classes/feature/exploration/ExplorationTable';
import GenericTableItemDisplay from '../../../components/generics/GenericTableItemDisplay';
import { SkillGroup } from '../../../../classes/feature/skillgroup/SkillGroup';
import SkillDisplay from './SkillDisplay';
import { Patron } from '../../../../classes/feature/skillgroup/Patron';

const PatronDisplay = (props: any) => {
    const patronObject : Patron = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className='abilityInternalStructure'>
                <div className='row'>
                     {returnDescription(patronObject, patronObject.Description)}
                     <div className='verticalspacerbig'/>
                     <div className="filterbox">
                        {patronObject.Factions.map((item) => ( 
                            <span key={item.Name} className="colordefault bodytext complextext small-side-margin">
                                {
                                   " " +  item.Name + " "
                                }
                            </span>
                        ))} 
                     </div>
                     <div className='verticalspacerbig'/>
                </div>
                {patronObject.Skills.map((item) => (
                    <div key={item.ID}>
                        <GenericTableItemDisplay d_value={null} d_colour={'default'} d_valuetitle={""} d_name={item.Name} d_type={""} d_method={() => <SkillDisplay data={item} />}/>
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default PatronDisplay;