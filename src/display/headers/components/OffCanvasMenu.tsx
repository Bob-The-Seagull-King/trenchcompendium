import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'

const OffcanvasMenu = (prop: any) => {

    const handleClose = prop.closeFunc;
    const show = prop.showState

    
    // State
    const [theme, setTheme] = useGlobalState('theme');

    if ((theme == "" ) || (theme == null)) { // Default theme to light
        setTheme('dark');
    }
    

    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>  
            <Offcanvas  data-theme={theme} show={show} onHide={handleClose}>
                <Offcanvas.Header className="backgroundBgBase font-ornamental colordefault" closeButton>
                    <Offcanvas.Title className="size-subtitle">Trench Compendium v0.2.1</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="backgroundBgBase">
                    Some text as placeholder. In real life you can have the elements you
                    have chosen. Like, text, images, lists, etc.
                </Offcanvas.Body>
            </Offcanvas>
        </ErrorBoundary>
        
      );
}

export default OffcanvasMenu

