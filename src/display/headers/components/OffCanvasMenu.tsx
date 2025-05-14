import '../../../resources/styles/vendor/bootstrap.css'
import React, {useEffect, useState} from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faClose, faUser} from '@fortawesome/free-solid-svg-icons'
import {useLocation, useNavigate} from 'react-router-dom';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import RulesMenuBody from "../../components/rules-content/RulesMenuBody";
import logoDarkMode from '../../../resources/images/trench-companion-logo-white-v2.png'
import logoLightMode from '../../../resources/images/trench-companion-logo-black-v2.png'
import {useGlobalState} from "../../../utility/globalstate";
import WBBMenuBody from "../../components/warband-builder/WBBMenuBody";
import OffcanvasMenuSettings from "../../components/generics/OffcanvasMenuSettings";
import SynodImage from "../../../utility/SynodImage";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    closeFunc : any;
    showState : any;
    responseshow : string;
}

type MenuView = 'main' | 'compendium' | 'wbb';


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
    function NavigateHome() {
        navigate('/');
    }

    function NavigateLogin() {
        navigate('/login', {state: Date.now().toString()});
    }

    // get Theme

    const [theme] = useGlobalState('theme');

    /**
     * Set active view
     */
    const location = useLocation();
    const [activeView, setActiveView] = useState<MenuView>('main');
    // Update active view based on route
    useEffect(() => {
        const path = location.pathname;

        if (path.startsWith('/compendium')) {
            setActiveView('compendium');
        } else if (path.startsWith('/warband')) {
            setActiveView('wbb');
        } else {
            setActiveView('main');
        }
    }, [location]);


    return (
        <ErrorBoundary fallback={<div>Something went wrong with OffcanvasMenu.tsx</div>}>
            <Offcanvas className="OffcanvasMainMenu" show={show} onHide={handleClose} responsive={prop.responseshow}>
                <Offcanvas.Header className="">
                    <Offcanvas.Title className="">
                        <div className={'logo-wrap'}>
                            <img src={theme === 'dark' ? logoDarkMode : logoLightMode}
                                 alt="Trench Companion Logo" className={'logo'}
                                 onClick={() => {
                                     NavigateHome()
                                     handleClose();
                                 }}
                            />
                        </div>

                        <div className="offcanvas-close" onClick={handleClose}>
                        <FontAwesomeIcon icon={faClose} className=""/>
                        </div>
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="offcanvas-body">
                    {activeView === 'main' && (
                        <div className={'menu-lvl-1'}>
                            <div className={'menu-lvl-1-item-main'}
                                onClick={() => {
                                    setActiveView('compendium');
                                }}
                            >
                                <span className={'title'}>
                                    {'Compendium'}
                                </span>

                                <SynodImage
                                    imageId={17}
                                    className={''}
                                    size={'large'}
                                />
                            </div>

                            <div className={'menu-lvl-1-item-main'}
                                 onClick={() => setActiveView('wbb')}
                            >
                                <span className={'title'}>
                                    {'Warband Builder'}
                                </span>

                                <SynodImage
                                    imageId={15}
                                    className={''}
                                    size={'large'}
                                />
                            </div>

                            <CustomNavLink
                                link={"/login"}
                                runfunc={() => {
                                    NavigateLogin();
                                    handleClose();
                                }}
                                classes={'menu-lvl-1-item-secondary'}
                            >
                                <FontAwesomeIcon icon={faUser} className=""/>
                                {'Login'}
                            </CustomNavLink>
                        </div>
                    )}

                    {activeView === 'compendium' && (
                        <RulesMenuBody
                            controller={prop.controller}
                            onBack={() => setActiveView('main')}
                            onNavigate={() => handleClose()}
                        />
                    )}
                    {activeView === 'wbb' && (
                        <WBBMenuBody
                            controller={prop.controller}
                            onBack={() => setActiveView('main')}
                        />
                    )}

                    <OffcanvasMenuSettings/>

                </Offcanvas.Body>
            </Offcanvas>
        </ErrorBoundary>

    );
}

export default OffcanvasMenu

