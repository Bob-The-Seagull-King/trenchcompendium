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

const MenuHeader = (prop: any) => {const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      
        <ErrorBoundary fallback={<div>Something went wrong with MenuHeader.tsx</div>}>
            <Button bsPrefix="empty" className="lonebutton totalmarginmed borderdefault backgroundBgCard borderstyler" onClick={handleShow}>
                <FontAwesomeIcon icon={faBars} className="totalmarginsml size-section colordefault"/>
            </Button>
    
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Main Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    Some text as placeholder. In real life you can have the elements you
                    have chosen. Like, text, images, lists, etc.
                </Offcanvas.Body>
            </Offcanvas>
        </ErrorBoundary>
    );
    // -------------------------------------------
}

export default MenuHeader