import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { useGlobalState } from './../../utility/globalstate'

// Resource
import logo from '../../resources/images/compendium.png'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faChess, faDumbbell, faGun, faHeart, faHeartPulse, faKey, faList, faMap, faPeopleGroup, faPersonMilitaryRifle, faPray, faQuestion, faRuler, faSquare } from '@fortawesome/free-solid-svg-icons'
import { faFileLines, faCoins, faCross } from '@fortawesome/free-solid-svg-icons'

// TEST
import { TestStaticFeature } from '../../classes/feature/teststatic/TestStaticFeature';
import { TestStaticFeatureFactory } from '../../factories/features/TestStaticFeatureFactory';
import { TestDynamicFeature } from '../../classes/feature/teststatic/TestDynamicFeature';
import { TestDynamicFeatureFactory } from '../../factories/features/TestDynamicFeatureFactory';
import { EventRunner } from '../../classes/contextevent/contexteventhandler';

const HomeRoute: React.FC = () => {

    // States
    const [theme, setTheme] = useGlobalState('theme');

    // Default to the light theme
    if ((theme == "" ) || (theme == null)) {
        setTheme('light');
    }

    // Navigation
    const navigate = useNavigate(); 

    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateHome(dir: string) {
        navigate('/' + dir);
    }

    /* TEST */
    async function sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /* TEST */

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with HomeRoute.tsx</div>}>
        <div className="backgroundBaseColour font-default" data-theme={theme}>
            
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default HomeRoute