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
import RulesBannerImage from "../components/rules-content/RulesBannerImage";



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

                    <div className={'narrow-content'}>
                        <div className={'row main-links'}>
                            <div className={'col-12 col-md-6'}>
                                <MenuComponent Title={"Rules Compendium"} Route={"compendium/"} bgImageID={2844}/>
                            </div>

                            <div className={'col-12 col-md-6'}>
                                <MenuComponent Title={"Warband Builder"} Route={"warband/"} bgImageID={2840}/>

                            </div>

                            <div className={'col-12 col-md-6'}>
                                <MenuComponent Title={"Campaign Manager"} Route={"campaign/"} bgImageID={2841}
                                               comingSoon={true}
                                />
                            </div>

                            <div className={'col-12 col-md-6'}>
                                <MenuComponent Title={"Play Mode"} Route={"play/"} bgImageID={2842}
                                               comingSoon={true}
                                />
                            </div>
                        </div>

                        <h1>{'Trench Companion'}</h1>
                        <div className={'sub-headline'}>
                            {'Your digital assistant for the world of Trench Crusade'}
                        </div>

                        <div className={'spacer-20'}></div>

                        <p className={'intro-text'}>
                            {'Build your warband, access the full rules, and stay up to date — all in one place.\n' +
                                'Trench Companion is the evolution of the  '}<a
                            href={'https://trenchcompendium.netlify.app/'} rel={"noreferrer noopener nofollow"}
                            target={'_blank'}>Trench
                            Compendium</a>{': a free, community-made tool crafted to support players both on and off the battlefield.\n' +
                            'It is a passion project created by a small team of developers with the goal to create a tool that keeps the Game alive and connected. \n' +
                            'If you enjoy what we’re building and want to see it grow, consider supporting us with a small monthly contribution — every bit helps.'
                        }
                        </p>

                        <div className={'spacer-20'}></div>

                        
                        <div className={'row '}>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={2848}
                                    linkUrl={'/blog'}
                                    linkText={'Blog'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={2900}
                                    linkUrl={'/page/premium-membership'}
                                    linkText={'How to support'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={2899}
                                    linkUrl={'/about'}
                                    linkText={'About'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={'spacer-20'}></div>

                    <div className={'narrow-content'}>
                        <h2>{'Trench Companion Alpha is live!'}</h2>

                        <p>
                            {'We’re proud to announce the alpha release of the Trench Companion app — a major milestone in our journey to support Trench Crusade players with powerful tools for the rules, warband management and more. This early version is just the beginning, and we’re excited to share it with you. For a full breakdown of features, known issues, and what’s next, check out our detailed blog post.'}
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