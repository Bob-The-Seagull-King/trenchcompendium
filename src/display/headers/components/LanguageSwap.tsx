import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'
import { makestringpresentable } from '../../../utility/functions';

const LanguageSwap = (prop: any) => {

    // State
    const [language, setLanguage] = useGlobalState('language');
    
    /**
     * Updates the locally stored web theme
     * @param theme The selected theme
     */
    function SetLanguage(language: string) {
        localStorage.setItem('language', language);
        setLanguage(language)
    }

    
    function returnLanguages(themeval: string | null, curtheme : string, title : string) {
        return (
            <div onClick={() => SetLanguage(themeval? themeval : curtheme)} className={"hovermouse size-strongtext font-default totalmarginsml align-left-right color"+(themeval == curtheme ? 'default' : 'BasicText')}>
                <div className="horizontalspacermed">{makestringpresentable(title)}</div>
            </div>
        )
    }
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>
            <div className={"totalmarginsml"}>
                <div>
                    {returnLanguages('ln_english', language, 'english')}
                </div>
            </div>
        </ErrorBoundary>
        
      );
}

export default LanguageSwap

