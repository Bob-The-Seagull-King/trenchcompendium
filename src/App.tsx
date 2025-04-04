import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/reducers/store'
import { useContentPackStore } from './store/contentpacks'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ROUTES } from './resources/routes-constants'
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

const App: React.FC = () => {

    const InitializeContentState = useContentPackStore((state) => state.SetFromCookies)
    InitializeContentState();

    const compendiumcontroller = new ControllerController();
    const toolcontroller = new ToolsController();


    return (
        <div className="font-default">
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router >
                    <SuperHeader controller={compendiumcontroller}/>
                    <Routes>
                    <Route path={ROUTES.HOME_ROUTE} element={<HomeRoute />} />
                    <Route path={ROUTES.COMPENDIUM_ROUTE} element={<CompendiumRoute controller={compendiumcontroller} />} />
                    <Route path={ROUTES.WARBAND_ROUTE} element={<WarbandRoute controller={toolcontroller} />} />
                    </Routes>
                </Router>
            </PersistGate>
        </Provider>
        </div>
    )
}

export default App
