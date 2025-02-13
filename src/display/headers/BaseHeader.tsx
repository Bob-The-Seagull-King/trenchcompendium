import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom'
import { Route, Link, Routes, useLocation } from 'react-router-dom';

// Classes
import { useNavigate } from "react-router-dom";
import { getRouteName } from "../../utility/functions"

// Font Aesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

// Component
import PalleteSwap from './components/PalleteSwap';
import LanguageSwap from './components/LanguageSwap';

const BaseHeader = (prop: any) => {

    // Navigation
    const navigate = useNavigate();
    function NavigateHome() {
        navigate("/");
    }

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with BaseHeader.tsx</div>}>
            <div className='topbarCompendiumBase topbarCompendiumStructure hstack softpad gap-3 justify-center'>
                <span className="droppaddingleft"/>
                <h1 className='colorWhite headertext d-none d-md-flex'>COMPENDIUM</h1>
                <p className='colorWhite headersubtext d-none d-md-flex'>v0.0.1</p>
                <div className="vr colorWhite headertext d-none d-md-flex"></div>
                <Button className="no-padding" variant="" onClick={() => NavigateHome()}>
                    <FontAwesomeIcon icon={faHouse} className="contentpacklabel colorWhite no-margin"/>
                </Button>
                <div className="vr colorWhite headertext"></div>
                <PalleteSwap/>
                <div className="vr colorWhite headertext"></div>
                <LanguageSwap/>
                <div className="vr colorWhite headertext  d-none d-md-flex"></div>
                <div className="ms-lg-auto ms-md-auto  d-none d-md-flex">
                    <h1 className="colorWhite headertext">
                        {getRouteName(useLocation().pathname).toUpperCase()}
                    </h1>
                </div>
                <span className="droppaddingleft"/>
            </div>
        </ErrorBoundary>

    )
    // -------------------------------------------
}

export default BaseHeader