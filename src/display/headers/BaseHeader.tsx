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
}

const BaseHeader: React.FC<IControllerProp> = (prop: any) => {
        
    const handleShow = () => prop.showstate();

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with BaseHeader.tsx</div>}>
            <>
                <Button className="open-offcanvas-nav-btn" onClick={handleShow}>
                    <FontAwesomeIcon icon={faBars} className=""/>
                </Button>
                <div className="logo-wrap">
                    <img src={logo} alt="Trench Companion Logo" className={'logo'}/>
                </div>
                <Button className="search-button">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className=""/>
                </Button>
            </>
        </ErrorBoundary>

    )
    // -------------------------------------------
}

export default BaseHeader