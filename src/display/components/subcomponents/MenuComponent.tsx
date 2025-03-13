import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import {capitalizeString, makestringpresentable} from '../../../utility/functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { parse } from '@fortawesome/fontawesome-svg-core'
import { useNavigate } from 'react-router-dom';

const MenuComponent = (props: any) => {
    const Title : string = props.title;
    const Route : string = props.route;
    const Icon : string = props.iconname;    

    // Navigation
    const navigate = useNavigate(); 

    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateHome() {
        navigate('/' + Route);
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <div className="hovermouse font-seriftext" onClick={()=>NavigateHome()}>
                <FontAwesomeIcon icon={parse.icon(Icon)} className=""/>
                <h1 className="">
                    {Title}
                </h1>
            </div>
        </ErrorBoundary>
    )
}

export default MenuComponent;