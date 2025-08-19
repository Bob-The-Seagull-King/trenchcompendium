
import '../../resources/styles/vendor/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'

// Classes
import { ToolsController } from '../../classes/_high_level_controllers/ToolsController';
import WbbOverviewPage from '../pages/WbbOverviewPage';
import WbbCreateNewPage from '../pages/WbbCreateNewPage';
import WbbEditPage from '../pages/WbbEditPage';

interface IControllerProp {
    controller : ToolsController; // The controller being passed through
}

const WarbandRoute: React.FC<IControllerProp> = (prop) => {

    // State
    const [_keyval, setKeyVal] = useState(0);
    const { state } = useLocation();

    useEffect(() => {
        setKeyVal(_keyval+1)
    }, [state]);


        
    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with CompendiumRoute.tsx</div>}>
            <div key={_keyval} className="WarbandRoute">
                <Routes>
                    <Route path={ROUTES.HOME_ROUTE} element={<WbbOverviewPage manager={prop.controller.UserWarbandManager} />} />
                    <Route path={ROUTES.WBB_VIEW} element={<WbbEditPage manager={prop.controller.UserWarbandManager} />} />
                    <Route path={ROUTES.WBB_NEW} element={<WbbCreateNewPage manager={prop.controller.UserWarbandManager} />} />
                </Routes>
                {/*<WarbandTestBlock />*/}
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default WarbandRoute