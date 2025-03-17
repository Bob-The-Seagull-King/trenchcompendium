import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom'
import { Route, Link, Routes, useLocation } from 'react-router-dom';

// Classes
import { useNavigate } from "react-router-dom";
import { getRouteName } from "../../utility/functions"

// Font Aesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faHouse, faSquare } from '@fortawesome/free-solid-svg-icons'

// Component
import PalleteSwap from './components/PalleteSwap';
import LanguageSwap from './components/LanguageSwap';
import OffcanvasMenu from './components/OffCanvasMenu';
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    showstate : any;
}

const BaseHeader: React.FC<IControllerProp> = (prop: any) => {
        
    const handleShow = () => prop.showstate();

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with BaseHeader.tsx</div>}>
            <div className='backgroundBgCard'>
                <div className="align-left-right horizontalspacermed">
                    <Button bsPrefix="empty" className="borderremove backgroundBgCard lonebutton" onClick={handleShow}>
                        <FontAwesomeIcon icon={faBars} className="size-section colordefault"/>
                    </Button>
                    <div className="font-ornamental colordefault">
                        <div className="size-section d-xl-flex d-lg-flex d-md-flex d-none">{"Trench Crusade"}</div>
                        <div className="size-subtitle d-flex d-lg-none d-md-none d-xl-none">{"Trench Crusade"}</div>
                    </div>
                    <div className="backgroundBgCard">
                        <FontAwesomeIcon icon={faSquare} className="size-section colorBgCard"/>
                    </div>
                </div>
            </div>
        </ErrorBoundary>

    )
    // -------------------------------------------
}

export default BaseHeader