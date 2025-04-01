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
import ItemRow from '../../../components/subcomponents/description/ItemRow';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';

const PatronDisplay = (props: any) => {
    const patronObject : Patron = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className=''>
                <div className=''>
                     <div>
                        {returnDescription(patronObject, patronObject.Description)}
                     </div>
                     <div className='verticalspacermed'/>
                     <div className="borderthin bordergrey">
                        <ItemRow title={"Available To"} value={() => <div>{patronObject.Factions.map((item) => ( 
                            <span key={item.Name} className="colorBasicText bodytext complextext small-side-margin">
                                {
                                   ((patronObject.Factions.indexOf(item) != 0)? "," : " ") +  item.Name + " "
                                }
                            </span>
                        ))} </div>}/>
                        
                     </div>
                </div>
                <div className='verticalspacermed'/>
                <div className="borderthin bordergrey">
                {patronObject.Skills.map((item) => (
                    <div key={item.ID}>
                        <GenericCollapsableBlockDisplay 
                            d_name={item.Name} 
                            d_colour={"grey"} 
                            d_state={false}  
                            bordertype={0}
                            d_border={true}
                            d_col={"BgCard"}
                            d_margin={"sml"}
                            d_method={() => <>
                                <div className="backgroundBgBasic borderthin bordergrey">
                                    <div className='totalmarginsml'>
                                    <SkillDisplay data={item} />
                                    </div>
                                </div>
                            </>} />
                    </div>
                ))}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default PatronDisplay;