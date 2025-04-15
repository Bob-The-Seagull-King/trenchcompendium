import '../../resources/styles/vendor/bootstrap.css'
import React, {useEffect, useState} from 'react'
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



    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with HomeRoute.tsx</div>}>
            <div className="home-screen">
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Rules Compendium"} Route={"compendium/"} bgImageID={17}/>
                        </div>

                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Warband Builder"} Route={"warband/"} bgImageID={15}/>

                        </div>

                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Campaign Manager"} Route={"campaign/"} bgImageID={16}/>
                        </div>

                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Play Mode"} Route={"play/"} bgImageID={19}/>
                        </div>
                    </div>



                    {/* Testing Links */}
                    <div className={'row'}>
                        <div className={'col-6 col-md-4 pt-3 pb-3'}>
                            <a href={"/login"} className={'btn btn-primary btn-block'}>
                                Login
                            </a>
                        </div>

                        <div className={'col-6 col-md-4 pt-3 pb-3'}>
                            <a href={"/warband-builder"} className={'btn btn-primary btn-block'}>
                                Warband Overview
                            </a>
                        </div>

                        <div className={'col-6 col-md-4 pt-3 pb-3'}>
                            <a href={"/warband-builder/new"} className={'btn btn-primary btn-block'}>
                                New Warband
                            </a>
                        </div>

                        <div className={'col-6 col-md-4 pt-3 pb-3'}>
                            <a href={"/warband-builder/edit"} className={'btn btn-primary btn-block'}>
                                Edit Warband
                            </a>
                        </div>
                    </div>
                    {/*<div className={'col-12 col-md-6'}>*/}
                    {/*    <MenuOutLink title={"Support The App"} link={"https://www.patreon.com/bobtheseagullking/"} />*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>


            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default HomeRoute