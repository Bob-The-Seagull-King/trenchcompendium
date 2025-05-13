import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../classes/feature/model/Model';
import { Ability } from '../../../../classes/feature/ability/Ability';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import { Skill } from '../../../../classes/feature/ability/Skill';

const SkillDisplay = (props: any) => {
    const skillObject: Skill = props.data
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with SkillDisplay.tsx</div>}>
            <div className='SkillDisplay'>
                {returnDescription(skillObject, skillObject.Description)}

                {skillObject.MyOptions.length > 0 &&
                    <div className='row'>
                        {
                            <OptionSetStaticDisplay data={skillObject.MyOptions}/>
                        }
                    </div>
                }
            </div>
        </ErrorBoundary>
    )
}

export default SkillDisplay;