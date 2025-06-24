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

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
        
    const [showsettings, setShowsettings] = useState(false);

    const handleClosesettings = () => setShowsettings(false);
    const handleShowsettings = () => setShowsettings(true);


    /**
     * Handles the hiding and showing of the header when scrolling
     */
    const [isShy, setIsShy] = useState(false)
    const lastScrollY = useRef(window.scrollY)
    const upScrollTotal = useRef(0)
    const downScrollTotal = useRef(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            const delta = currentScroll - lastScrollY.current

            if (currentScroll === 0) { // is at top
                setIsShy(false)
                upScrollTotal.current = 0

                downScrollTotal.current = 0
                upScrollTotal.current = 0;
            } else {
                if (delta > 0) { // Scrolling down
                    downScrollTotal.current += Math.abs(delta)

                    if (downScrollTotal.current >= 55) {
                        setIsShy(true)
                        downScrollTotal.current = 0 // reset after hiding
                    }

                } else if (delta < 0) { // Scrolling up

                    upScrollTotal.current += Math.abs(delta)

                    if (upScrollTotal.current >= 55) {
                        setIsShy(false)
                        upScrollTotal.current = 0 // reset after reveal
                    }
                }
            }

            lastScrollY.current = currentScroll
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])



    // Return result -----------------------------
    return (    
        <ErrorBoundary fallback={<div>Something went wrong with SuperHeader.tsx</div>}>
            <>
                <div className={`header-main-spacer`}></div>

                <div ref={ref} className={`header-main ${isShy ? 'shy' : ''}`}>
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

                <div className={'debug-lorem'}>
                    {'downScrollTotal.current: '}{downScrollTotal.current}<br/>
                    {'upScrollTotal.current: '}{upScrollTotal.current}<br/>
                    {'lastScrollY.current: '}{lastScrollY.current}
                </div>
            </>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default SuperHeader