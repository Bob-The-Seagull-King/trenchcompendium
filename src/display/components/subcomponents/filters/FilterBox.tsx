import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'

// Classes
import { makestringpresentable } from '../../../../utility/functions'
import { ErrorBoundary } from "react-error-boundary";

const FilterBox = (prop: any) => {
    const title = prop.title
    const value = prop.value    
    const exists = prop.state

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterBox.tsx</div>}>
            <div className="">
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default FilterBox