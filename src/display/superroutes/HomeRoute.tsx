import '../../resources/styles/vendor/bootstrap.css'
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
import SynodImage from "../../utility/SynodImage";
import SynodGetWarband from "../../utility/SynodGetWarband";

const HomeRoute: React.FC = () => {

    /* TEST */

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with HomeRoute.tsx</div>}>



            <div className="home-screen">
                <div className={'container'}>

                    {/* @TODO: this is just a test*/}
                    <SynodGetWarband
                        WarbandId={15}
                    />


                    <div className={'row'}>
                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Rules Compendium"} Route={"compendium/"} bgImageID={17}/>
                        </div>

                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Warband Builder"} Route={"warband/"}  bgImageID={15}/>

                        </div>

                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Campaign Manager"} Route={"campaign/"} bgImageID={16}/>
                        </div>

                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Play Mode"} Route={"play/"}  bgImageID={19}/>
                        </div>
                    </div>
                    {/*<div className={'row'}>*/}
                    {/*    <div className={'col-12 col-md-6'}>*/}
                    {/*        <MenuOutLink title={"Official Website"} link={"https://www.trenchcrusade.com/"} />*/}
                    {/*    </div>*/}
                    {/*    <div className={'col-12 col-md-6'}>*/}
                    {/*        <MenuOutLink title={"Support The App"} link={"https://www.patreon.com/bobtheseagullking/"} />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>



            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default HomeRoute