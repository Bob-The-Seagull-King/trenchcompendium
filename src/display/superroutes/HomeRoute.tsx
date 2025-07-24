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
import PageMetaInformation from "../components/generics/PageMetaInformation";



const HomeRoute: React.FC = () => {



    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with HomeRoute.tsx</div>}>
            <div className="home-screen">
                <div className={'container'}>
                    <PageMetaInformation
                        title={'Trench Companion'}
                        description={'The official resource for Trench Crusade'}
                    />

                    <div className={'spacer-20'}></div>

                    <div className={'narrow-content'}>
                        <h1>{'Trench Companion'}</h1>
                        <div className={'sub-headline'}>
                            {'Your digital assistant for the world of Trench Crusade'}
                        </div>

                        <div className={'spacer-20'}></div>

                        <p className={'intro-text'}>
                            {'Build your warband, access the full rules, and stay up to date — all in one place.\n' +
                                'Trench Companion is a free, community-made tool designed to support players on and off the battlefield.'}
                        </p>

                        <div className={'row main-links'}>
                            <div className={'col-12 col-md-6'}>
                                <MenuComponent Title={"Rules Compendium"} Route={"compendium/"} bgImageID={17}/>
                            </div>

                            <div className={'col-12 col-md-6'}>
                                <MenuComponent Title={"Warband Builder"} Route={"warband/"} bgImageID={15}/>

                            </div>

                            <div className={'col-12 col-md-6'}>
                                <MenuComponent Title={"Campaign Manager"} Route={"campaign/"} bgImageID={16}
                                               comingSoon={true}
                                />
                            </div>

                            <div className={'col-12 col-md-6'}>
                                <MenuComponent Title={"Play Mode"} Route={"play/"} bgImageID={19}
                                               comingSoon={true}
                                />
                            </div>
                        </div>

                        <hr/>

                        <h2>{'What is Trench Companion?'}</h2>

                        <p>
                            {'Trench Companion is a community-driven, free-to-use web app created by and for fans of Trench Crusade.\n' +
                                'Version 1 will launch in August 2025, starting with the Warband Builder and Compendium.\n' +
                                'Campaign mode, Scenario Tracker, and more features are already in development.\n' +
                                '\n' +
                                'Want to support the project? Consider a small monthly contribution — it helps us keep going.'}
                        </p>
                    </div>

                    <div className={'spacer-20'}></div>
                    <div className={'spacer-20'}></div>

                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default HomeRoute