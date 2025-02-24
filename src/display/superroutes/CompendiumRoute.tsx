import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'

// Components
import BaseDisplayCompendium from '../pages/BaseDisplayCompendium'

// Classes
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController'
import { useGlobalState } from './../../utility/globalstate'

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const CompendiumRoute: React.FC<IControllerProp> = (prop) => {

    // State
    const [theme, setTheme] = useGlobalState('theme');

    // Default to the light theme
    if ((theme == "" ) || (theme == null)) {
        setTheme('light');
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with CompendiumRoute.tsx</div>}>
            <div className="backgroundBaseColour font-default" data-theme={theme}>
            <Routes>
            <Route path={ROUTES.COMPENDIUM_GLOSSARY_ROUTE} element={<BaseDisplayCompendium controller={prop.controller.GlossaryCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_KEYWORD_ROUTE} element={<BaseDisplayCompendium controller={prop.controller.KeywordCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_MODEL_ROUTE} element={<BaseDisplayCompendium controller={prop.controller.ModelCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_EQUIPMENT_ROUTE} element={<BaseDisplayCompendium controller={prop.controller.EquipmentCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_FACTION_ROUTE} element={<BaseDisplayCompendium controller={prop.controller.FactionCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_SCENARIO_ROUTE} element={<BaseDisplayCompendium controller={prop.controller.ScenarioCollectionController}/>} />
            </Routes>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CompendiumRoute