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
import {AuthProvider} from "./utility/AuthContext";
import WbbOverviewPage from "./display/pages/WbbOverviewPage";
import WbbCreateNewPage from "./display/pages/WbbCreateNewPage";
import WbbEditPage from "./display/pages/WbbEditPage";
import PrivacyPopup from "./display/components/generics/PrivacyPopup";
import {TrackingManager} from "./display/components/generics/TrackingManager";
import PrivacyPage from "./display/superroutes/PrivacyPage";
import ProfileEditPage from "./display/superroutes/ProfileEditPage";
import ProfileViewPage from "./display/superroutes/ProfileViewPage";


const App: React.FC = () => {

    const InitializeContentState = useContentPackStore((state) => state.SetFromCookies)
    InitializeContentState();

    const compendiumcontroller = ControllerController.getInstance();
    const toolcontroller = ToolsController.getInstance();

    /** Theme Settings */
    const [theme, setTheme] = useGlobalState('theme');

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]); // Runs whenever theme changes

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
                                <Route path={ROUTES.PRIVACY_ROUTE} element={<PrivacyPage />} /> {/* Privacy Page */}
                                <Route path={ROUTES.PROFILE_EDIT_ROUTE} element={<ProfileEditPage />} /> {/* Edit Profile Page */}
                                <Route path={ROUTES.PROFILE_VIEW_ROUTE} element={<ProfileViewPage />} />
                            </Routes>
                        </Router>
                    </PersistGate>
                </Provider>

                <PrivacyPopup />

                {/* @TODO: add tracking data in component*/}
                {/*<TrackingManager />*/}
            </AuthProvider>
        </>
    )
}

export default App
