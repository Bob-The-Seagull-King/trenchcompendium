import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'
import { useLocation, useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../components/generics/GenericCollapsableBlockDisplay';
import PalleteSwap from '../../headers/components/PalleteSwap';
import LanguageSwap from '../../headers/components/LanguageSwap';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import CompendiumMenuItem from '../../headers/components/CompendiumMenuItem';
import GenericLinkedCollapsableBlockDisplay from '../generics/GenericLinkedCollapsableBlockDisplay';


const ScrollToTop = () => {
    const {pathname} = useLocation();
    
    useEffect(() => {
        window.scrollTo(0,0);
    }, [pathname])

    return (
        <div/>        
      );
}

export default ScrollToTop

