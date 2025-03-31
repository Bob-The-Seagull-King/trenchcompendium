import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';

// Font Aesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faGear, faGripLines } from '@fortawesome/free-solid-svg-icons'

// Components
import PalleteSwap from './components/PalleteSwap';
import LanguageSwap from './components/LanguageSwap';
import { Button } from 'react-bootstrap';
import OffcanvasMenu from './components/OffCanvasMenu';
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';
import {getRouteName} from "../../utility/functions";
import {useLocation} from "react-router-dom";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    showstate : any;
    showsettings : any;
}

const MenuHeader: React.FC<IControllerProp> = (prop) => {

    const handleShow = () => prop.showstate();
    const handleShowSettings = () => prop.showsettings();
  
    return (
      
        <ErrorBoundary fallback={<div>Something went wrong with MenuHeader.tsx</div>}>
            <div className="align-left-right">
                <Button bsPrefix="empty" className="lonebutton" onClick={handleShow}>
                    <FontAwesomeIcon icon={faBars} className=""/>
                </Button>
                <div className="font-ornamental">
                    <div
                        className="size-section d-xl-flex d-lg-flex d-md-flex d-none">{getRouteName(useLocation().pathname)}</div>
                    <div
                        className="size-subtitle d-flex d-lg-none d-md-none d-xl-none">{getRouteName(useLocation().pathname)}</div>
                </div>
                <Button bsPrefix="empty" className="lonebutton" onClick={handleShowSettings}>
                    <FontAwesomeIcon icon={faGear} className=""/>
                </Button>
            </div>
        </ErrorBoundary>
    );
    // -------------------------------------------
}

export default MenuHeader