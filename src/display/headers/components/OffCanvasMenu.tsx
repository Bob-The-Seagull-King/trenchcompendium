import '../../../resources/styles/vendor/bootstrap.css'
import React, {useEffect, useState} from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faClose, faRightFromBracket, faUser} from '@fortawesome/free-solid-svg-icons'
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
import {ROUTES} from "../../../resources/routes-constants";
import {useAuth} from "../../../utility/AuthContext";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    closeFunc : any;
    showState : any;
    responseshow : string;
}

type MenuView = 'main' | 'compendium' | 'wbb' | 'cm';


const OffcanvasMenu: React.FC<IControllerProp> = (prop) => {

    const handleClose = prop.closeFunc;
    const show = prop.showState

    const { isLoggedIn, userId, logout } = useAuth()


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
        navigate(ROUTES.LOGIN_ROUTE, {state: Date.now().toString()});
    }

    // get Theme
    const [theme] = useGlobalState('theme');

    // Set list of secondary nav links
    const secondary_links = [
        {
            title: 'Support us',
            link: ROUTES.PAGE_MEMBERSHIP
        },
        // { // disabled until we have created supporter packs
        //     title: 'Supporter Packs',
        //     link: ROUTES.PAGE_SUPPORTER_PACKS
        // },
        {
            title: 'Collaboration',
            link: ROUTES.PAGE_COLLABORATE
        },
        {
            title: 'Blog',
            link: ROUTES.PAGE_BLOG_BASE
        },
    ]

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
        } else if (path.startsWith('/campaigns')) {
            setActiveView('cm');
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
                            <CustomNavLink
                                classes={'menu-lvl-1-item-main'}
                                link={ROUTES.COMPENDIUM}
                                runfunc={() => {
                                    setActiveView('compendium');
                                }}>
                                <span className={'title'}>
                                    {'Compendium'}
                                </span>

                                <SynodImageWithCredit
                                    imageId={2844}
                                    className={''}
                                    size={'large'}
                                />
                            </CustomNavLink>

                            <CustomNavLink
                                classes={'menu-lvl-1-item-main'}
                                link={ROUTES.WARBAND}
                                runfunc={() => {
                                    setActiveView('wbb');
                            }}>
                                <span className={'title'}>
                                    {'Warband Builder'}
                                </span>

                                <SynodImageWithCredit
                                    imageId={2840}
                                    className={''}
                                    size={'large'}
                                />
                            </CustomNavLink>

                            <CustomNavLink
                                classes={'menu-lvl-1-item-main'}
                                link={ROUTES.CAMPAIGN}
                                runfunc={() => {
                                    setActiveView('cm');
                            }}>
                                <span className={'title'}>
                                    {'Campaign Manager'}
                                </span>

                                <SynodImageWithCredit
                                    imageId={2841}
                                    className={''}
                                    size={'large'}
                                />
                            </CustomNavLink>

                            <CustomNavLink
                                classes={'menu-lvl-1-item-main minor'}
                                link={ROUTES.PAGE_BLOG_BASE}
                                runfunc={() => {
                                    navigate(ROUTES.PAGE_BLOG_BASE);
                                    handleClose();
                            }}>
                                <span className={'title'}>
                                    {'Blog'}
                                </span>

                                <SynodImageWithCredit
                                    imageId={37014}
                                    className={''}
                                    size={'large'}
                                />
                            </CustomNavLink>

                            {/* Login Nav */}
                            {!isLoggedIn &&
                                <CustomNavLink
                                    link={ROUTES.LOGIN_ROUTE}
                                    runfunc={() => {
                                        NavigateLogin();
                                        handleClose();
                                    }}
                                    classes={'menu-lvl-1-item-secondary'}
                                >
                                    <FontAwesomeIcon icon={faUser} className="icon-inline-left-l"/>
                                    {'Login'}
                                </CustomNavLink>
                            }

                            {/* Logged in Nav */}
                            {isLoggedIn &&
                                <>
                                    <CustomNavLink
                                        link={'/profile/' + userId}
                                        runfunc={() => {
                                            navigate('/profile/' + userId)
                                            handleClose();

                                        }}
                                        classes={'menu-lvl-1-item-secondary'}
                                    >
                                        <FontAwesomeIcon icon={faUser} className="icon-inline-left-l"/>

                                        {'Profile'}
                                    </CustomNavLink>

                                    <a href={ROUTES.LOGIN_ROUTE}
                                       className={'menu-lvl-1-item-secondary'}
                                       onClick={() => {
                                           logout()
                                           NavigateLogin()
                                           handleClose()
                                       }}
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket} className="icon-inline-left-l"/>

                                        {'Log Out'}
                                    </a>
                                </>
                            }

                            {/* Secondary Links */}
                            {secondary_links.length > 0 &&
                                <>
                                    {secondary_links.map((linkItem, j) => (
                                        <CustomNavLink
                                            key={j}
                                            classes={'menu-lvl-1-item-secondary'}
                                            link={linkItem.link}
                                            runfunc={() => {
                                                navigate(linkItem.link)
                                                handleClose()
                                            }}>
                                            {linkItem.title}
                                        </CustomNavLink>
                                    ))}
                                </>
                            }


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
                            onNavigate={() => handleClose()}
                        />
                    )}
                    {activeView === 'cm' && (
                        <>
                            {'@TODO: show campaign links here'}
                        </>
                    )}

                    <OffcanvasMenuSettings/>

                </Offcanvas.Body>
            </Offcanvas>
        </ErrorBoundary>

    );
}

export default OffcanvasMenu

