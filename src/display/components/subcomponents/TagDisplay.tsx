import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import {capitalizeString, makestringpresentable} from '../../../utility/functions'

const TagDisplay = (props: any) => {
    const key : string = props.itemkey;
    const val : string | boolean | number | null = props.itemval

    return (
        <ErrorBoundary fallback={<div>Something went wrong with TagDisplay.tsx</div>}>
            <div className="tagItem colorgrey tagText">
                &#x2b9e; {(key.toString() || "")} {makestringpresentable(((val)? val : '').toString() || "")}
            </div>
        </ErrorBoundary>
    )
}

export default TagDisplay;