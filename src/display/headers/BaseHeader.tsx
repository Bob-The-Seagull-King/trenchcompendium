import '../../resources/styles/vendor/bootstrap.css'
import React, {useEffect, useState} from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom'
import { Route, Link, Routes, useLocation } from 'react-router-dom';

// Classes
import { useNavigate } from "react-router-dom";
import { getRouteName } from "../../utility/functions"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars, faClipboardList, faCog,
    faGear,
    faHouse,
    faInfoCircle,
    faMagnifyingGlass, faRightFromBracket,
    faSquare,
    faUser
} from '@fortawesome/free-solid-svg-icons'
import logoDarkMode from '../../resources/images/trench-companion-logo-white-v2.png'
import logoLightMode from '../../resources/images/trench-companion-logo-black-v2.png'



// Component
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';
import {useGlobalState} from "../../utility/globalstate";
import CustomNavLink from '../components/subcomponents/interactables/CustomNavLink';
import {ROUTES} from "../../resources/routes-constants";
import {useAuth} from "../../utility/AuthContext";
import {Popover} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import SynodFactionImage from "../../utility/SynodFactionImage";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    showstate : any;
    showsettings : any;
}

const BaseHeader: React.FC<IControllerProp> = (prop: any) => {
        
    const handleShow = () => prop.showstate();
    const handleShowSettings = () => prop.showsettings();

    const navigate = useNavigate();

    // get Theme
    const [theme] = useGlobalState('theme');

    function NavigateHome() {
        navigate('/', {state: Date.now().toString()});
    }
    function NavigateLogin() {
        navigate(ROUTES.LOGIN_ROUTE, {state: Date.now().toString()});
    }

    const { isLoggedIn, userId, authToken,  loadingUser, SiteUser, logout } = useAuth();

    const handleLogout = async () => {
        logout();
        NavigateLogin();
        return;
    }

    // close popover on scroll
    const [show, setShow] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (show) {
                setShow(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [show]);

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with BaseHeader.tsx</div>}>
            <>
                <button className="open-offcanvas-nav-btn" onClick={handleShow}>
                    <FontAwesomeIcon icon={faBars} className=""/>
                </button>

                <CustomNavLink
                    link={'/'}
                    runfunc={() => NavigateHome()}
                    classes={'logo-wrap'}
                >
                    <img src={theme === 'dark' ? logoDarkMode : logoLightMode}
                         alt="Trench Companion Logo"
                         className={'logo'}
                         onClick={() => NavigateHome()}
                    />
                </CustomNavLink>


                { isLoggedIn ? (
                    <OverlayTrigger
                        placement={'bottom-end'}
                        trigger={['click', 'focus']}
                        rootClose
                        show={show}
                        onToggle={(nextShow) => setShow(nextShow)}
                        overlay={
                        <Popover>
                            <Popover.Body bsPrefix="profile"
                                          className="popover header-user-popover"
                                          id="header-user-popover"
                            >
                                <div className={'user-name'}>
                                    {SiteUser?.GetNickname()}
                                </div>

                                <CustomNavLink
                                    classes={'element'}
                                    link={`/profile/${userId}`}
                                    runfunc={() => {
                                        const targetPath = `/profile/${userId}`;
                                        setShow(false);
                                        navigate(targetPath);
                                    }}
                                >

                                    <FontAwesomeIcon icon={faUser} className={'me-2'}/>
                                    {'Your Profile'}
                                    { (SiteUser && SiteUser?.numNotificationsProfile() > 0) &&
                                        <span className={'notification-num-inline'}>{SiteUser?.numNotificationsProfile()}</span>
                                    }
                                </CustomNavLink>

                                <CustomNavLink
                                    classes={'element'}
                                    link={`/warband/`}
                                    runfunc={() => {
                                        const targetPath = `/warband/`;
                                        setShow(false);
                                        navigate(targetPath);
                                    }}
                                >

                                    <FontAwesomeIcon icon={faClipboardList} className={'me-2'}/>
                                    {'Your Warbands'}
                                    { (SiteUser && SiteUser?.numNotificationsWarbands() > 0) &&
                                        <span className={'notification-num-inline'}>{SiteUser?.numNotificationsWarbands()}</span>
                                    }
                                </CustomNavLink>

                                <CustomNavLink
                                    classes={'element'}
                                    link={`/profile/${userId}/settings`}
                                    runfunc={() => {
                                        const targetPath = `/profile/${userId}/settings`;
                                        setShow(false);
                                        navigate(targetPath);
                                    }}
                                >

                                    <FontAwesomeIcon icon={faCog} className={'me-2'}/>
                                    {'Settings'}
                                </CustomNavLink>



                                <div className={'element'}
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} className={'me-2'}/>
                                    {'Log out'}
                                </div>
                            </Popover.Body>
                        </Popover>
                        }
                    >
                        <div className={'header-login-btn'}>
                            { (SiteUser && SiteUser?.numNotificationsGlobal() > 0) &&
                                <span className={'notification-num'}>{SiteUser?.numNotificationsGlobal()}</span>
                            }
                            <FontAwesomeIcon icon={faUser} className=""/>
                        </div>
                    </OverlayTrigger>
                ):(
                    <CustomNavLink
                        link={ROUTES.LOGIN_ROUTE}
                        runfunc={() => NavigateLogin()}
                        classes={'header-login-btn'}
                    >
                        <FontAwesomeIcon icon={faUser} className=""/>
                    </CustomNavLink>
                )}

            </>
        </ErrorBoundary>

    )
    // -------------------------------------------
}

export default BaseHeader