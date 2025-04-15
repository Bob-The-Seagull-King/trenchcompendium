import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../utility/util'
import {Injury} from "../../../classes/feature/ability/Injury";

const RulesInjury = (props: any) => {
    const injuryObject: Injury = props.injury

    return (
        <ErrorBoundary fallback={<div>Something went wrong with RulesInjury.tsx</div>}>
            <div className={'RulesInjury injury'}>
                <div className={'injury-name'}>
                    <strong>
                        {injuryObject.Name}
                    </strong>
                </div>

                <p  className={'injury-description'}>
                    {returnDescription(injuryObject, injuryObject.Description)}
                </p>
            </div>
        </ErrorBoundary>
    )
}

export default RulesInjury;