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
import GenericCollapsableBlockDisplay from '../../components/generics/GenericCollapsableBlockDisplay';
import PalleteSwap from './PalleteSwap';
import LanguageSwap from './LanguageSwap';

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
            <Offcanvas className="borderthin bordergrey" data-theme={theme} show={show} onHide={handleClose}>
                <Offcanvas.Header className="borderthin bordergrey backgroundBgBase font-default " closeButton>
                    <Offcanvas.Title className="size-subtitle ">
                        <div className="colorBasicText">
                            Trench Compendium v2.2
                        </div>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body bsPrefix="empty" className="fillspace backgroundBgBase">
                    <GenericCollapsableBlockDisplay 
                        d_name={"Pallete"} 
                        d_colour={"grey"} 
                        d_state={false}  
                        d_method={() => <PalleteSwap/>} />
                    <GenericCollapsableBlockDisplay 
                        d_name={"Language"} 
                        d_colour={"grey"} 
                        d_state={false}  
                        d_method={() => <LanguageSwap/>} />

                    <div className="borderthin bordergrey fillspace"/>
                </Offcanvas.Body>
            </Offcanvas>
        </ErrorBoundary>
        
      );
}

export default OffcanvasMenu

