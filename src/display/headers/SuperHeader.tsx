import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'

// Classes
import { useGlobalState } from './../../utility/globalstate'

// Components
import BaseHeader from './BaseHeader'
import MenuHeader from './MenuHeader'

import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';

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

    // Return result -----------------------------
    return (    
        <ErrorBoundary fallback={<div>Something went wrong with SuperHeader.tsx</div>}>
            <div data-theme={theme}>
            <div id="topbarbody" ref={ref} className="topbarStructure">
                <Routes>
                    <Route path={ROUTES.HOME_ROUTE} element={<MenuHeader controller={prop.controller} />} />
                </Routes>
            </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default SuperHeader