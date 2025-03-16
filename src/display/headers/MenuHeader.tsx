import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';

// Font Aesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faGripLines } from '@fortawesome/free-solid-svg-icons'

// Components
import PalleteSwap from './components/PalleteSwap';
import LanguageSwap from './components/LanguageSwap';
import { Button } from 'react-bootstrap';
import OffcanvasMenu from './components/OffCanvasMenu';
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const MenuHeader: React.FC<IControllerProp> = (prop) => {
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      
        <ErrorBoundary fallback={<div>Something went wrong with MenuHeader.tsx</div>}>
            <Button bsPrefix="empty" className="lonebutton totalmarginmed borderdefault backgroundBgCard borderstyler" onClick={handleShow}>
                <FontAwesomeIcon icon={faBars} className="totalmarginsml size-section colordefault"/>
            </Button>

            <OffcanvasMenu controller={prop.controller} closeFunc={handleClose} showState={show}/>
        </ErrorBoundary>
    );
    // -------------------------------------------
}

export default MenuHeader