import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../utility/util'
import { Skill } from '../../../classes/feature/ability/Skill';

const RulesPatronDetails = (props: any) => {
    const skillObject: Skill = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with RulesPatronDetails.tsx</div>}>
            <div className='RulesPatronDetails'>
                {returnDescription(skillObject, skillObject.Description)}
            </div>
        </ErrorBoundary>
    )
}

export default RulesPatronDetails;