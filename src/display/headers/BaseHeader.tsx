import '../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom'
import { Route, Link, Routes, useLocation } from 'react-router-dom';

// Classes
import { useNavigate } from "react-router-dom";
import { getRouteName } from "../../utility/functions"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBars, faGear, faHouse, faMagnifyingGlass, faSquare, faUser} from '@fortawesome/free-solid-svg-icons'
import logoDarkMode from '../../resources/images/trench-companion-logo-white-v2.png'
import logoLightMode from '../../resources/images/trench-companion-logo-black-v2.png'



// Component
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';
import {useGlobalState} from "../../utility/globalstate";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    showstate : any;
    showsettings : any;
}

const BaseHeader: React.FC<IControllerProp> = (prop: any) => {
        
    const handleShow = () => prop.showstate();
    const handleShowSettings = () => prop.showsettings();

    const navigate = useNavigate();

    // get Theme
    const [theme] = useGlobalState('theme');

    function NavigateHome() {
        navigate('/', {state: Date.now().toString()});
    }

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with BaseHeader.tsx</div>}>
            <>
                <button className="open-offcanvas-nav-btn" onClick={handleShow}>
                    <FontAwesomeIcon icon={faBars} className=""/>
                </button>
                <div className="logo-wrap">
                    <img src={theme === 'dark' ? logoDarkMode : logoLightMode}
                         alt="Trench Companion Logo"
                         className={'logo'}
                         onClick={() => NavigateHome()}
                    />
                </div>

                <a href={"/login"} className={'header-login-btn'}>
                    <FontAwesomeIcon icon={faUser} className=""/>
                </a>
            </>
        </ErrorBoundary>

    )
    // -------------------------------------------
}

export default BaseHeader