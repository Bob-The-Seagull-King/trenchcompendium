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

const SkillGroupDisplay = (props: any) => {
    const skillgroupObject : SkillGroup = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className=''>
                {skillgroupObject.Skills.map((item) => (
                    <div key={item.ID}>
                        <GenericTableItemDisplay d_value={item.TableVal >= 0 ? item.TableVal : "Choose"} d_colour={'default'} d_valuetitle={"Result: "} d_name={item.Name} d_type={""} d_method={() => <SkillDisplay data={item} />}/>
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default SkillGroupDisplay;