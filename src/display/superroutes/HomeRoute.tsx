import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { useGlobalState } from './../../utility/globalstate'

// Resource
import logo from '../../resources/images/compendium.png'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGun, faKey, faList, faPeopleGroup, faPersonMilitaryRifle } from '@fortawesome/free-solid-svg-icons'
import { faFileLines, faCoins, faCross } from '@fortawesome/free-solid-svg-icons'

// TEST
import { TestStaticFeature } from '../../classes/feature/teststatic/TestStaticFeature';
import { TestStaticFeatureFactory } from '../../factories/features/TestStaticFeatureFactory';
import { TestDynamicFeature } from '../../classes/feature/teststatic/TestDynamicFeature';
import { TestDynamicFeatureFactory } from '../../factories/features/TestDynamicFeatureFactory';
import { EventRunner } from '../../classes/contextevent/contexteventhandler';

const HomeRoute: React.FC = () => {

    // States
    const [theme, setTheme] = useGlobalState('theme');

    // Default to the light theme
    if ((theme == "" ) || (theme == null)) {
        setTheme('light');
    }

    // Navigation
    const navigate = useNavigate(); 

    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateHome(dir: string) {
        navigate('/' + dir);
    }

    /* TEST */
    async function sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /* TEST */

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with HomeRoute.tsx</div>}>
        <div className="backgroundBaseColour font-default" data-theme={theme}>
        <div>
            <div className="row justify-content-center m-0 p-0">
                <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 col-12">
                    <div className="row">
                    <div className="verticalspacerbig"/>
                        <img src={logo} />
                    </div>
                    <div className='row'><div className='col'><br/></div></div>
                    <div className="row">
                        <div className="separator"><h3 className="complextext">Content</h3></div>
                    </div>
                    <div className="row row-cols-lg-3 row-cols-md-3 row-cols-sx-1 row-cols-xs-1 row-cols-1">
                        <div className="col softpad">
                        <div className="basestructure pageaccessbox borderstyler subborderdefault hovermouse" onClick={() => NavigateHome("compendium/glossary/")}>
                                <FontAwesomeIcon icon={faList} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    GLOSSARY
                                </h1>
                            </div>
                        </div>
                        <div className="col softpad">
                            <div className="basestructure pageaccessbox borderstyler subborderdefault hovermouse" onClick={() => NavigateHome("compendium/keyword/")}>
                                <FontAwesomeIcon icon={faKey} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    KEYWORDS
                                </h1>
                            </div>
                        </div>
                        <div className="col softpad">
                            <div className="basestructure pageaccessbox borderstyler subborderdefault hovermouse" onClick={() => NavigateHome("compendium/model/")}>
                                <FontAwesomeIcon icon={faPersonMilitaryRifle} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    MODELS
                                </h1>
                            </div>
                        </div>
                        <div className="col softpad">
                            <div className="basestructure pageaccessbox borderstyler subborderdefault hovermouse" onClick={() => NavigateHome("compendium/equipment/")}>
                                <FontAwesomeIcon icon={faGun} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    EQUIPMENT
                                </h1>
                            </div>
                        </div>
                        <div className="col softpad">
                            <div className="basestructure pageaccessbox borderstyler subborderdefault hovermouse" onClick={() => NavigateHome("compendium/faction/")}>
                                <FontAwesomeIcon icon={faPeopleGroup} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    FACTION
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="separator"><h3 className="complextext">Tools</h3></div>
                    </div>
                    <div className="row row-cols-lg-1 row-cols-md-1 row-cols-sx-1 row-cols-xs-1 row-cols-1">
                        <div className="col softpad">
                            <div className=" basestructure pageaccessbox borderstyler subborderdefault hovermouse" onClick={() => NavigateHome("tools/content/")}>
                                <FontAwesomeIcon icon={faFileLines} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    CONTENT MANAGER
                                </h1>
                            </div>
                        </div>
                        <div className="col softpad" >
                            <div className="basestructure pageaccessbox borderstyler subborderdefault hovermouse" onClick={() => NavigateHome("tools/saveitem/")}>
                                <FontAwesomeIcon icon={faFileLines} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    SAVE ITEM
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="separator"><h3 className="complextext">Content</h3></div>
                    </div>
                    <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sx-1 row-cols-xs-1 row-cols-1">
                    <div className="col mb-2">
                                <div className="pageaccessbox borderstyler subborderdefault hovermouse" onClick={()=>window.open('https://www.trenchcrusade.com/','_blank', 'rel=noopener noreferrer')}>
                                    <FontAwesomeIcon icon={faCross} className="pageaccestext"/>
                                    <h1 className="pageaccestext">
                                        OFFICIAL WEBSITE
                                    </h1>
                                </div>
                            </div>
                            <div className="col mb-2">
                                <div className="pageaccessbox borderstyler subborderdefault hovermouse" onClick={()=>window.open('https://www.patreon.com/bobtheseagullking/','_blank', 'rel=noopener noreferrer')}>
                                    <FontAwesomeIcon icon={faCoins} className="pageaccestext"/>
                                    <h1 className="pageaccestext">
                                        SUPPORT THE APP
                                    </h1>
                                </div>
                            </div>
                    </div>
                    <div className="row">
                        <div className="separator"></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default HomeRoute