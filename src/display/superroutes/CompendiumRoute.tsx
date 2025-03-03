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
import NoFilterDisplayCompendium from '../pages/NoFilterDisplayCompendium';
import AllDisplayNoFilterCompendium from '../pages/AllDisplayNoFilterCompendium';

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
            <Route path={ROUTES.COMPENDIUM_GAMERULE_ROUTE} element={<NoFilterDisplayCompendium controller={prop.controller.GameRulesCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_CAMPAIGNRULE_ROUTE} element={<NoFilterDisplayCompendium controller={prop.controller.CampaignRulesCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_EXPLORATION_ROUTE} element={<NoFilterDisplayCompendium controller={prop.controller.ExplorationTableCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_INJURY_ROUTE} element={<AllDisplayNoFilterCompendium controller={prop.controller.InjuryCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_SKILL_ROUTE} element={<BaseDisplayCompendium controller={prop.controller.SkillGroupCollectionController}/>} />
            <Route path={ROUTES.COMPENDIUM_PATRON_ROUTE} element={<BaseDisplayCompendium controller={prop.controller.PatronCollectionController}/>} />
            </Routes>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CompendiumRoute