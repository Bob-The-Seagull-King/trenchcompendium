import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'

// Classes
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController'
import { useGlobalState } from './../../utility/globalstate'
import CompendiumBasePage from '../pages/CompendiumBasePage';
import PagedCompendiumDisplay from '../pages/PagedCompendiumDisplay';
import FilterableCompendiumDisplay from '../pages/FilterableCompendiumDisplay';
import { ToolsController } from '../../classes/_high_level_controllers/ToolsController';
import WarbandItemDisplay from '../components/features/saveitem/WarbandItemDisplay';
import ToolsSavedItem from '../pages/ToolsSaveItem';

interface IControllerProp {
    controller : ToolsController; // The controller being passed through
}

const WarbandRoute: React.FC<IControllerProp> = (prop) => {

    // State
    const [theme, setTheme] = useGlobalState('theme');
    const [_keyval, setKeyVal] = useState(0);

    // Default to the light theme
    if ((theme == "" ) || (theme == null)) {
        setTheme('dark');
    }
    const { state } = useLocation();

    useEffect(() => {
        setKeyVal(_keyval+1)
    }, [state]);

    
        const [show, setShow] = useState(true);
    
        const handleClose = () => setShow(true);
        const handleShow = () => setShow(true);
        
    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with CompendiumRoute.tsx</div>}>
            <div className="backgroundBaseColour font-default" data-theme={theme}>
                <div key={_keyval} className="row justify-content-center m-0 p-0">
                    <Routes>                        
                        <Route path={ROUTES.HOME_ROUTE} element={<ToolsSavedItem manager={prop.controller.UserWarbandManager} />} />
                    </Routes>
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default WarbandRoute