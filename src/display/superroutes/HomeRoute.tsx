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
                            <MenuComponent Title={"Campaign Manager"} Route={"campaign/"} bgImageID={16} comingSoon={true}/>
                        </div>

                        <div className={'col-12 col-md-6'}>
                            <MenuComponent Title={"Play Mode"} Route={"play/"} bgImageID={19} comingSoon={true}/>
                        </div>
                    </div>


                    
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default HomeRoute