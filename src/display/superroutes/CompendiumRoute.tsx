import '../../resources/styles/vendor/bootstrap.css'
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
import RulesMenuBody from "../components/rules-content/RulesMenuBody";
import MenuBody from "../components/subcomponents/MenuBody";
import CollectionCompendiumDisplay from '../pages/CollectionCompendiumDisplay';
import { ToolsController } from '../../classes/_high_level_controllers/ToolsController';
import ToolsRandomScenario from '../pages/ToolsRandomScenario';
import SynodImage from "../../utility/SynodImage";
import {useSynodFactionImageData} from "../../utility/useSynodFactionImageData";
import DefaultGame from '../components/mainpages/DefaultGame';
import DefaultCampaign from '../components/mainpages/DefaultCampaign';
import RulesBreadCrumbs from "../components/rules-content/RulesBreadCrumbs";
import ToolsRandomScenarioRules from '../pages/ToolsRandomScenarioRules';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const CompendiumRoute: React.FC<IControllerProp> = (prop) => {

    // State
    const [_keyval, setKeyVal] = useState(0);

    const { state } = useLocation();

    const ToolsManagerScenario = ToolsController.getInstance();

    useEffect(() => {
        setKeyVal(_keyval+1)
    }, [state]);


    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with CompendiumRoute.tsx</div>}>
            <div className={'CompendiumRoute'}>
                <RulesBreadCrumbs />

                <div className="container main-content">
                    <div key={_keyval} className="row">
                        <div className="col-lg-3 col-sm-12">
                            <RulesMenuBody controller={prop.controller}/>

                        </div>

                        <div className="col-lg-9 col-sm-12">
                            <Routes>
                                <Route path={ROUTES.COMP_PARENT_GAME}
                                       element={<DefaultGame/>}/>
                                <Route path={ROUTES.COMP_PARENT_CAMPAIGN}
                                       element={<DefaultCampaign/>}/>
                                <Route path={ROUTES.COMP_SCENARIO_GENERATOR}
                                       element={<ToolsRandomScenario controller={ToolsManagerScenario.RandomScenarioManager}/>}/>
                                <Route path={ROUTES.COMP_SCENARIO_GENRULES}
                                       element={<ToolsRandomScenarioRules controller={ToolsManagerScenario.RandomScenarioManager}/>}/>
                                <Route path={'/game'+ROUTES.COMP_RULES_GAMERULES} element={<PagedCompendiumDisplay
                                    controller={prop.controller.GameRulesCollectionController}/>}/>
                                <Route path={'/campaign'+ROUTES.COMP_RULES_CAMPAIGNRULES} element={<PagedCompendiumDisplay
                                    controller={prop.controller.CampaignRulesCollectionController}/>}/>
                                <Route path={ROUTES.COMP_RULES_ERRATARULES} element={<PagedCompendiumDisplay
                                    controller={prop.controller.ErrataRulesCollectionController}/>}/>
                                <Route path={ROUTES.COMP_WARBAND_FACTIONS} element={<PagedCompendiumDisplay
                                    controller={prop.controller.FactionCollectionController}/>}/>
                                <Route path={ROUTES.COMP_SCENARIO_SCENARIO} element={<PagedCompendiumDisplay
                                    controller={prop.controller.ScenarioCollectionController}/>}/>
                                <Route path={'/campaign'+ROUTES.COMP_CAMPAIGN_EXPLORATION} element={<PagedCompendiumDisplay
                                    controller={prop.controller.ExplorationTableCollectionController}/>}/>
                                <Route path={'/campaign'+ROUTES.COMP_CAMPAIGN_PATRONS} element={<PagedCompendiumDisplay
                                    controller={prop.controller.PatronCollectionController}/>}/>
                                <Route path={'/game'+ROUTES.COMP_RULES_KEYWORDS} element={<CollectionCompendiumDisplay
                                    controller={prop.controller.KeywordCollectionController}/>}/>
                                <Route path={'/game'+ROUTES.COMP_WARBAND_MODELS} element={<FilterableCompendiumDisplay
                                    controller={prop.controller.ModelCollectionController}/>}/>
                                <Route path={'/campaign'+ROUTES.COMP_CAMPAIGN_INJURIES} element={<CollectionCompendiumDisplay
                                    controller={prop.controller.InjuryCollectionController}/>}/>
                                <Route path={'/campaign'+ROUTES.COMP_CAMPAIGN_SKILLS} element={<FilterableCompendiumDisplay
                                    controller={prop.controller.SkillGroupCollectionController}/>}/>
                                <Route path={ROUTES.COMP_WARBAND_EQUIPMENT} element={<FilterableCompendiumDisplay
                                    controller={prop.controller.EquipmentCollectionController}/>}/>
                                <Route path={ROUTES.HOME_ROUTE}
                                       element={<CompendiumBasePage controller={prop.controller}/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>

        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CompendiumRoute