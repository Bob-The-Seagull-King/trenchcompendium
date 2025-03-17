import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'

// Components
import BaseDisplayCompendium from '../pages/BaseDisplayCompendium'

// Classes
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController'
import { useGlobalState } from './../../utility/globalstate'
import ContentsComponentLink from '../components/subcomponents/informationpanel/ContentsComponentLink';
import { ContentsLink } from '../components/subcomponents/informationpanel/ContentsComponentLink';
import OncanvasMenu from '../components/subcomponents/informationpanel/OnCanvasMenu';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const CompendiumRoute: React.FC<IControllerProp> = (prop) => {

    // State
    const [theme, setTheme] = useGlobalState('theme');

    // Default to the light theme
    if ((theme == "" ) || (theme == null)) {
        setTheme('dark');
    }

    function GetContentsTable() {
        const ContentsList : ContentsLink[] = [];

        ContentsList.push({ name: "Game Rules", route: "rules"})
        ContentsList.push({ name: "Keywords", route: "keywords"})
        ContentsList.push({ name: "Campaigns", route: "campaign"})

        return ( <ContentsComponentLink listofcontents={ContentsList}/> )
    }

    
        const [show, setShow] = useState(true);
    
        const handleClose = () => setShow(true);
        const handleShow = () => setShow(true);
        
    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with CompendiumRoute.tsx</div>}>
            <div className="backgroundBaseColour font-default" data-theme={theme}>
                <div className="row justify-content-center m-0 p-0">
                    
                    <div className="col-lg-6 col-md-12">
                        {GetContentsTable()}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CompendiumRoute