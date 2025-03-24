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

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const CompendiumRoute: React.FC<IControllerProp> = (prop) => {

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
                        <Route path={ROUTES.COMP_RULES_GAMERULES} element={<PagedCompendiumDisplay controller={prop.controller.GameRulesCollectionController} />} />
                        <Route path={ROUTES.COMP_RULES_CAMPAIGNRULES} element={<PagedCompendiumDisplay controller={prop.controller.CampaignRulesCollectionController} />} />
                        <Route path={ROUTES.COMP_WARBAND_FACTIONS} element={<PagedCompendiumDisplay controller={prop.controller.FactionCollectionController} />} />
                        <Route path={ROUTES.COMP_SCENARIO_SCENARIO} element={<PagedCompendiumDisplay controller={prop.controller.ScenarioCollectionController} />} />
                        <Route path={ROUTES.COMP_CAMPAIGN_EXPLORATION} element={<PagedCompendiumDisplay controller={prop.controller.ExplorationTableCollectionController} />} />
                        <Route path={ROUTES.COMP_CAMPAIGN_PATRONS} element={<PagedCompendiumDisplay controller={prop.controller.PatronCollectionController} />} />
                        <Route path={ROUTES.COMP_RULES_KEYWORDS} element={<FilterableCompendiumDisplay controller={prop.controller.KeywordCollectionController} />} />
                        <Route path={ROUTES.COMP_RULES_GLOSSARY} element={<FilterableCompendiumDisplay controller={prop.controller.GlossaryCollectionController} />} />
                        <Route path={ROUTES.COMP_WARBAND_MODELS} element={<FilterableCompendiumDisplay controller={prop.controller.ModelCollectionController} />} />
                        <Route path={ROUTES.COMP_CAMPAIGN_INJURIES} element={<FilterableCompendiumDisplay controller={prop.controller.InjuryCollectionController} />} />
                        <Route path={ROUTES.COMP_CAMPAIGN_SKILLS} element={<FilterableCompendiumDisplay controller={prop.controller.SkillGroupCollectionController} />} />
                        <Route path={ROUTES.COMP_WARBAND_EQUIPMENT} element={<FilterableCompendiumDisplay controller={prop.controller.EquipmentCollectionController} />} />
                        <Route path={ROUTES.HOME_ROUTE} element={<CompendiumBasePage controller={prop.controller} />} />
                    </Routes>
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CompendiumRoute