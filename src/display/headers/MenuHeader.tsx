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
            <div className="totalmarginsml">
                <Button bsPrefix="empty" className="lonebutton totalmarginsml borderdefault backgroundBgCard borderstyler" onClick={handleShow}>
                    <FontAwesomeIcon icon={faBars} className="totalmarginsml size-section colordefault"/>
                </Button>
                <Button bsPrefix="empty" className="lonebutton totalmarginsml borderdefault backgroundBgCard borderstyler" onClick={handleShowSettings}>
                    <FontAwesomeIcon icon={faGear} className="totalmarginsml size-section colordefault"/>
                </Button>
            </div>
        </ErrorBoundary>
    );
    // -------------------------------------------
}

export default MenuHeader