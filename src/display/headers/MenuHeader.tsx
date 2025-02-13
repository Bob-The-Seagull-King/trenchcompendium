import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Components
import PalleteSwap from './components/PalleteSwap';
import LanguageSwap from './components/LanguageSwap';

const MenuHeader = (prop: any) => {

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with MenuHeader.tsx</div>}>
            <div className="filterbox">
                <div className={"floatingButton backgrounddefault"}>
                    <PalleteSwap/>
                </div>
                <div className={"floatingButton backgrounddefault"}>
                    <LanguageSwap/>
                </div>
            </div>
            
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default MenuHeader