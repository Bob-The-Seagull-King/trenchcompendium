import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import Image from 'react-bootstrap/Image';
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { useGlobalState } from './../../utility/globalstate'

// Resource
import logo from '../../resources/images/compendium.png'

import MenuComponent from '../components/subcomponents/MenuComponent';
import MenuOutLink from '../components/subcomponents/MenuOutLink';
import { faBook, faCross } from '@fortawesome/free-solid-svg-icons';

const HomeRoute: React.FC = () => {

    // States
    const [theme, setTheme] = useGlobalState('theme');

    // Default to the light theme
    if ((theme == "" ) || (theme == null)) {
        setTheme('light');
    }

    /* TEST */

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with HomeRoute.tsx</div>}>
            <div className="backgroundBaseColour font-default" data-theme={theme}>
                <div className="row justify-content-center m-0 p-0">
                    <div className="col-lg-8 col-md-12">
                        <div className="row justify-content-center">
                            <div className="col inner-content-middle align-center">
                                <div className="colordefault font-ornamental size-title">Trench Crusade</div>
                            </div>
                        </div>
                        <div className="row row-cols-md-2 row-cols-1 gy-3 gx-3">
                            <div className="col">
                                <MenuComponent title={"Rules Compendium"} route={"compendium/"} />
                            </div>
                            <div className="col">
                                <MenuComponent title={"Warband Builder"} route={"warband/"} />
                            </div>
                            <div className="col">
                                <MenuComponent title={"Campaign Manager"} route={"campaign/"} />
                            </div>
                            <div className="col">
                                <MenuComponent title={"Play Mode"} route={"play/"} />
                            </div>
                        </div>
                        <div className="row "> 
                            <div className="verticalspacermed"></div>
                        </div>
                        <div className="row row-cols-md-2 row-cols-1 gy-3 gx-3">
                            <div className="col">
                                <MenuOutLink title={"Official Website"} link={"https://www.trenchcrusade.com/"} />
                            </div>
                            <div className="col">
                                <MenuOutLink title={"Support The App"} link={"https://www.patreon.com/bobtheseagullking/"} />
                            </div>
                        </div>
                        <br/>
                    </div>
                </div>                
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default HomeRoute