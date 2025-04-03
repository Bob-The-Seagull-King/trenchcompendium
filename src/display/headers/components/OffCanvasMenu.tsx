import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronUp, faSun, faClose} from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../components/generics/GenericCollapsableBlockDisplay';
import PalleteSwap from './PalleteSwap';
import LanguageSwap from './LanguageSwap';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import CompendiumMenuItem from './CompendiumMenuItem';
import MenuBody from '../../components/subcomponents/MenuBody';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    closeFunc : any;
    showState : any;
    responseshow : string;
}

const OffcanvasMenu: React.FC<IControllerProp> = (prop) => {

    const handleClose = prop.closeFunc;
    const show = prop.showState

    // State
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
        <ErrorBoundary fallback={<div>Something went wrong with OffcanvasMenu.tsx</div>}>
            <Offcanvas className="offcanvas-main-menu" show={show} onHide={handleClose} responsive={prop.responseshow}>
                <Offcanvas.Header className="">
                    <Offcanvas.Title className="">
                        Trench Compendium v2.2
                        <div className="offcanvas-close" onClick={handleClose}>
                            <FontAwesomeIcon icon={faClose} className=""/>
                        </div>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body bsPrefix="empty" className="">
                    <MenuBody controller={prop.controller} closeFunc={prop.closeFunc} responseshow={prop.responseshow} showState={prop.showState}/>
                </Offcanvas.Body>
            </Offcanvas>
        </ErrorBoundary>
        
      );
}

export default OffcanvasMenu

