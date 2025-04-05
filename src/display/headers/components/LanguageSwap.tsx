import '../../../resources/styles/vendor/bootstrap.css'
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
     * Updates the locally stored web language
     * @param language
     */
    function SetLanguage(language: string) {
        localStorage.setItem('language', language);
        setLanguage(language)
    }

    
    function returnLanguages(langval: string | null, curlang : string, title : string) {
        return (
            <div onClick={() => SetLanguage(langval? langval : curlang)} className={"      color"+(langval == curlang ? 'default' : 'BasicText')}>
                <div className="">{makestringpresentable(title)}</div>
            </div>
        )
    }
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>
            <div className={""}>
                <div>
                    {returnLanguages('ln_english', language, 'english')}
                </div>
            </div>
        </ErrorBoundary>
        
      );
}

export default LanguageSwap

