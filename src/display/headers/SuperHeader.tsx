import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'

// Classes
import { useGlobalState } from './../../utility/globalstate'
import { useNavigate } from "react-router-dom";

// Components
import BaseHeader from './BaseHeader'
import MenuHeader from './MenuHeader'

import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';
import OffcanvasMenu from './components/OffCanvasMenu';
import OncanvasMenu from '../components/subcomponents/informationpanel/OnCanvasMenu';
import SettingsMenu from './components/SettingsMenu';
import RulesMenuBody from "../components/features/rules-content/RulesMenuBody";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const SuperHeader: React.FC<IControllerProp> = (prop) => {

    // State
    const [theme, setTheme] = useGlobalState('theme');

    if ((theme == "" ) || (theme == null)) { // Default theme to light
        setTheme('dark');
    }

    const [stateheight, setHeight] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const location = useLocation();
    
    /**
     * Update when the screen size changes to ensure the
     * header always has a 'buffer' of the appropriate size
     * between itself and the top of the page.
     */
    useEffect(() => {
        const setNavHeight = () => {
            if(ref.current) {
                setHeight(ref.current.clientHeight+10);
            }
        }
        window.addEventListener("load", setNavHeight, false);
        window.addEventListener("resize", setNavHeight, false);
        setNavHeight();
    }, [location])

    
        // Navigation
        const navigate = useNavigate();

    function NavigateHome() {
        navigate("/");
    }
        
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
        
    const [showsettings, setShowsettings] = useState(false);

    const handleClosesettings = () => setShowsettings(false);
    const handleShowsettings = () => setShowsettings(true);

    // Return result -----------------------------
    return (    
        <ErrorBoundary fallback={<div>Something went wrong with SuperHeader.tsx</div>}>
            <div data-theme={theme}>
                <div className="header-main-spacer"></div>

                <div id="topbarbody" ref={ref} className="overlaystructure topbarStructure header-main">
                    <Routes>
                        <Route path={ROUTES.COMPENDIUM_ROUTE}
                               element={<BaseHeader showsettings={handleShowsettings} showstate={handleShow}
                                                    controller={prop.controller}/>}/>
                        <Route path={ROUTES.WARBAND_ROUTE}
                               element={<BaseHeader showsettings={handleShowsettings} showstate={handleShow}
                                                    controller={prop.controller}/>}/>
                        <Route path={ROUTES.HOME_ROUTE}
                               element={<MenuHeader showsettings={handleShowsettings} showstate={handleShow}
                                                    controller={prop.controller}/>}/>
                    </Routes>
                </div>
                <Routes>
                    <Route path={ROUTES.COMPENDIUM_ROUTE} element={
                        <div className="overlaystructure menustructure d-none d-lg-block "
                             style={{height: window.innerHeight - stateheight}}>
                            <div style={{height: stateheight - 10}}/>

                            <RulesMenuBody controller={prop.controller}/>

                        </div>
                    }/>
                </Routes>
                <OffcanvasMenu controller={prop.controller} closeFunc={handleClose} responseshow="" showState={show}/>
                <SettingsMenu controller={prop.controller} closeFunc={handleClosesettings} responseshow=""
                              showState={showsettings}/>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default SuperHeader