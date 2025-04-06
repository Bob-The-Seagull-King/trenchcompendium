import '../../resources/styles/vendor/bootstrap.css'
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
import SettingsMenu from './components/SettingsMenu';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const SuperHeader: React.FC<IControllerProp> = (prop) => {

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
            <>
                <div className="header-main-spacer"></div>

                <div ref={ref} className="header-main">
                    <Routes>
                        <Route element={
                            <BaseHeader  showstate={handleShow} controller={prop.controller} showsettings={handleShowsettings}/>
                        }>
                            <Route path={ROUTES.COMPENDIUM_ROUTE} />
                            <Route path={ROUTES.WARBAND_ROUTE} />
                            <Route path={ROUTES.HOME_ROUTE} />
                        </Route>
                    </Routes>
                </div>



                <OffcanvasMenu controller={prop.controller} closeFunc={handleClose} responseshow="" showState={show}/>
                <SettingsMenu controller={prop.controller} closeFunc={handleClosesettings} responseshow=""
                              showState={showsettings}/>
            </>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default SuperHeader