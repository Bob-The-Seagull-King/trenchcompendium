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
import { faList } from '@fortawesome/free-solid-svg-icons'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'

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

    async function testcontextobjects() {
        const DynamicTest : TestDynamicFeature = await TestDynamicFeatureFactory.CreateNewTestDynamicFeature("td_testitem", null);
        
        console.log(DynamicTest);
        const Event = new EventRunner();

        const testa = await Event.runEvent('genericReturnEvent', DynamicTest.teststaticlist[0], [], 1, 0);
        console.log("TESTA: " + testa)
        DynamicTest.teststaticlist[0].Selections[1].SelectOption(0);
        const testb = await Event.runEvent('genericReturnEvent', DynamicTest.teststaticlist[0], [], 1, 0);
        console.log("TESTB: " + testb)
        DynamicTest.teststaticlist[0].Selections[1].SelectOption(1);
        const testc = await Event.runEvent('genericReturnEvent', DynamicTest.teststaticlist[0], [], 1, 0);
        console.log("TESTc: " + testc)
    }

    testcontextobjects();

    /* TEST */

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with HomeRoute.tsx</div>}>
        <div className="backgroundBaseColour" data-theme={theme}>
        <div>
            <div className="row justify-content-center m-0 p-0">
                <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12 col-12">
                    <div className="row">
                        <img src={logo} />
                    </div>
                    <div className='row'><div className='col'><br/></div></div>
                    <div className="row">
                        <div className="separator"><h3 className="complextext">Content</h3></div>
                    </div>
                    <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sx-1 row-cols-xs-1 row-cols-1">
                        <div className="col softpad">
                            <div className="basestructure pageaccessbox borderstyler subborderdefault hovermouse" onClick={() => NavigateHome("compendium/glossary/")}>
                                <FontAwesomeIcon icon={faList} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    GLOSSARY
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