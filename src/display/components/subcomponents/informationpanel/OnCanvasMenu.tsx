import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../../utility/globalstate'
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import PalleteSwap from '../../../headers/components/PalleteSwap';
import LanguageSwap from '../../../headers/components/LanguageSwap';
import { ControllerController } from '../../../../classes/_high_level_controllers/ControllerController';
import CompendiumMenuItem from '../../../headers/components/CompendiumMenuItem';
import MenuBody from '../MenuBody';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    closeFunc : any;
    showState : any;
    responseshow : string;
}

const OncanvasMenu: React.FC<IControllerProp> = (prop) => {

    // Navigation
    const navigate = useNavigate(); 
    
    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateOut() {
        navigate('/');
    }
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>  
            <div className="borderthin bordergrey">
                <MenuBody controller={prop.controller} />
            </div>
        </ErrorBoundary>
        
      );
}

export default OncanvasMenu

