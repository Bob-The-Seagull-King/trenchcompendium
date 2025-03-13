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
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsRoute