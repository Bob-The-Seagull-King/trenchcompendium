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
                    <div className="col-md-8 col-sm-12">
                        <div className="row">
                            <Image src={logo}/>
                        </div>
                        <div className="row row-cols-md-2 row-cols-sm-1">
                            <MenuComponent title={"Rules Compendium"} route={"compendium/"} icon={"faBook"}/>
                        </div>
                        <div className="row row-cols-md-2 row-cols-sm-1">
                            <MenuOutLink title={"Official Website"} link={"https://www.trenchcrusade.com/"} icon={"faCross"}/>
                        </div>
                    </div>
                </div>                
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default HomeRoute