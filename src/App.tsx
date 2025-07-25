import React, {useEffect} from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/reducers/store'
import { useContentPackStore } from './store/contentpacks'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ROUTES } from './resources/routes-constants'
import './resources/styles/vendor/bootstrap.css'
import './resources/styles/_main.sass'
import './resources/styles/_mainstylesource.scss'

import { ControllerController } from './classes/_high_level_controllers/ControllerController'
import { ToolsController } from './classes/_high_level_controllers/ToolsController'
import { SynodImageCache } from './classes/_high_level_controllers/SynodImageCache'

/* 
    Major routes are placed here.
    These routes have NO states, and are where the controllers/manager
    objects are created for Main routes.
*/
import HomeRoute from './display/superroutes/HomeRoute'
import CompendiumRoute from './display/superroutes/CompendiumRoute'
import SuperHeader from './display/headers/SuperHeader'
import WarbandRoute from './display/superroutes/WarbandRoute'
import {useGlobalState} from "./utility/globalstate";
import ScrollToTop from './display/components/subcomponents/ScrollToTop'
import SynodLogin from "./utility/SynodLogin";
import SynodLoginPage from './display/superroutes/SynodLoginPage'
import {AuthProvider} from "./utility/AuthProvider";
import WbbOverviewPage from "./display/pages/WbbOverviewPage";
import WbbCreateNewPage from "./display/pages/WbbCreateNewPage";
import WbbEditPage from "./display/pages/WbbEditPage";
import PrivacyPopup from "./display/components/generics/PrivacyPopup";
import {TrackingManager} from "./display/components/generics/TrackingManager";
import ProfileSettingsPage from "./display/superroutes/ProfileSettingsPage";
import ProfilePage from "./display/superroutes/ProfilePage";
import FooterMain from "./display/footers/FooterMain";
import StaticPrivacy from "./display/pages/StaticPrivacy";
import StaticLegalNotice from "./display/pages/StaticLegalNotice";
import StaticTermsAndConditions from "./display/pages/StaticTermsAndConditions";
import StaticContact from "./display/pages/StaticContact";
import StaticWithdrawal from "./display/pages/StaticWithdrawal";
import StaticPremiumMembership from "./display/pages/StaticPremiumMembership";
import StaticSupporterPacks from "./display/pages/StaticSupporterPacks";
import StaticCollaborate from "./display/pages/StaticCollaborate";
import StaticAbout from './display/pages/StaticAbout'
import StaticPlanSelection from "./display/pages/StaticPlanSelection";


const App: React.FC = () => {

    const InitializeContentState = useContentPackStore((state) => state.SetFromCookies)
    InitializeContentState();

    const compendiumcontroller = ControllerController.getInstance();
    const toolcontroller = ToolsController.getInstance();
    const imagecache = SynodImageCache.getInstance();

    /** Theme Settings */
    const [theme, setTheme] = useGlobalState('theme');

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]); // Runs whenever theme changes

    /** Remove global loader */
    useEffect(() => {
        const loader = document.getElementById('global-loader');
        if (loader) loader.remove();
    }, []);

    return (
        <>
            <AuthProvider>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <Router >
                            <SuperHeader controller={compendiumcontroller}/>

                            <ScrollToTop/>

                            <Routes>
                                <Route path={ROUTES.HOME_ROUTE} element={<HomeRoute />} />
                                <Route path={ROUTES.COMPENDIUM_ROUTE} element={<CompendiumRoute controller={compendiumcontroller} />} />
                                <Route path={ROUTES.WARBAND_ROUTE} element={<WarbandRoute controller={toolcontroller} />} />
                                <Route path={ROUTES.LOGIN_ROUTE} element={<SynodLoginPage />} /> {/* Login Page */}
                                <Route path={ROUTES.PROFILE_SETTINGS_ROUTE} element={<ProfileSettingsPage />} /> {/* Edit Profile Page */}
                                <Route path={ROUTES.PROFILE_VIEW_ROUTE} element={<ProfilePage />} />

                                {/* Static Pages - Legal */}
                                <Route path={ROUTES.PAGE_LEGAL} element={<StaticLegalNotice />} /> {/* Legal Notice Page */}
                                <Route path={ROUTES.PAGE_PRIVCACY} element={<StaticPrivacy />} /> {/* Privacy Page */}
                                <Route path={ROUTES.PAGE_TERMS} element={<StaticTermsAndConditions />} /> {/* Terms and Conditions */}
                                <Route path={ROUTES.PAGE_WITHDRAWAL} element={<StaticWithdrawal />} /> {/* Withdrawal Page */}

                                {/* Static Pages - Trench Companion */}
                                <Route path={ROUTES.PAGE_CONTACT} element={<StaticContact />} /> {/* Contact Page */}
                                <Route path={ROUTES.COMPANION_ABOUT} element={<StaticAbout />} /> {/* About Page */}


                                {/* Static Pages - Content */}
                                <Route path={ROUTES.PAGE_MEMBERSHIP} element={<StaticPremiumMembership />} /> {/* Withdrawal Page */}
                                <Route path={ROUTES.PAGE_SUPPORTER_PACKS} element={<StaticSupporterPacks />} /> {/* Withdrawal Page */}
                                <Route path={ROUTES.PAGE_COLLABORATE} element={<StaticCollaborate />} /> {/* Withdrawal Page */}

                                {/* Static Pages - Membership & Purchases */}
                                <Route path={ROUTES.PAGE_PLAN_SELECTION} element={<StaticPlanSelection />} /> {/* Membership Plan Selection Page */}


                            </Routes>

                            <FooterMain />

                            <TrackingManager />
                        </Router>
                    </PersistGate>
                </Provider>

                <PrivacyPopup />
            </AuthProvider>
        </>
    )
}

export default App
