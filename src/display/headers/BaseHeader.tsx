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
import {faBars, faGear, faHouse, faMagnifyingGlass, faSquare} from '@fortawesome/free-solid-svg-icons'
import logo from '../../resources/images/trench-companion-logo-white-v2.png'



// Component
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    showstate : any;
    showsettings : any;
}

const BaseHeader: React.FC<IControllerProp> = (prop: any) => {
        
    const handleShow = () => prop.showstate();
    const handleShowSettings = () => prop.showsettings();

    const navigate = useNavigate();

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
                    <img src={logo} alt="Trench Companion Logo" className={'logo'}
                         onClick={() => NavigateHome()}
                    />
                </div>
                <Button className="search-button" onClick={handleShowSettings}>
                    <FontAwesomeIcon icon={faGear} className=""/>
                </Button>
            </>
        </ErrorBoundary>

    )
    // -------------------------------------------
}

export default BaseHeader