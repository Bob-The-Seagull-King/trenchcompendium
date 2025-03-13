import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import {capitalizeString, makestringpresentable} from '../../../utility/functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { parse } from '@fortawesome/fontawesome-svg-core'
import { faBook } from '@fortawesome/free-solid-svg-icons'

const MenuOutLink = (props: any) => {
    const Title : string = props.title;
    const Link : string = props.link;
    const Icon : string = props.iconname;   

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <div className="hovermouse font-seriftext" onClick={()=>window.open(Link,'_blank', 'rel=noopener noreferrer')}>
                <FontAwesomeIcon icon={parse.icon(Icon)} className=""/>
                <h1 className="">
                    {Title}
                </h1>
            </div>
        </ErrorBoundary>
    )
}

export default MenuOutLink;