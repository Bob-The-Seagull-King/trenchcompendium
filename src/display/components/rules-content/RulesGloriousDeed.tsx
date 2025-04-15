import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../utility/util'
import { GloriousDeed } from '../../../classes/feature/scenario/GloriousDeed';

const RulesGloriousDeed = (props: any) => {
    const deedObject: GloriousDeed = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with GloriousDeedDisplay.tsx</div>}>
            <div className='RulesGloriousDeed rules-glorious-deed'>
                <h4 className={'glorious-deed-title'}>
                    {deedObject.Name}
                </h4>
                <div className={'glorious-deed-content'}>
                    {returnDescription(deedObject, deedObject.Description)}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default RulesGloriousDeed;