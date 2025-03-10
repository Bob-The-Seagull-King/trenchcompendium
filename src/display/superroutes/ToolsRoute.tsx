import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Data and Classes
import { ROUTES } from '../../resources/routes-constants'
import ToolsContentManager from '../../display/pages/ToolsContentManager'
import ToolsSavedItem from '../../display/pages/ToolsSaveItem'

import { useGlobalState } from './../../utility/globalstate'
import { ToolsController } from '../../classes/_high_level_controllers/ToolsController'
import ToolsRandomScenario from '../pages/ToolsRandomScenario';

interface IControllerProp {
    controller : ToolsController; // The controller being inserted
}

const ToolsRoute: React.FC<IControllerProp> = (prop) => {

    // Set themes
    const [theme, setTheme] = useGlobalState('theme');

    // If no theme provided, default to light
    if ((theme == "" ) || (theme == null)) {
        setTheme('light');
    }

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with ToolsRoute.tsx</div>}>
            <div className="backgroundBaseColour font-default" data-theme={theme}>
                <Routes>
                    <Route path={ROUTES.TOOLS_CONTENT_UPLOAD_ROUTE} element={<ToolsContentManager manager={prop.controller.ContentManager}/>} />
                    <Route path={ROUTES.TOOLS_CONTENT_SAVE_ITEM} element={<ToolsSavedItem manager={prop.controller.SaveItemManager}/>} />
                    <Route path={ROUTES.TOOLS_SCENARIO_GENERATOR} element={<ToolsRandomScenario manager={prop.controller.RandomScenarioManager}/>} />
                </Routes>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsRoute