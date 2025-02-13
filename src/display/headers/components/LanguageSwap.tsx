import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'

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

    /**
     * Returns the appropriate title based on the
     * currently selected website language
     * @param themeval Current language
     * @returns The language title to display
     */
    function returnCurrentLanguage(themeval: string | null) {

        switch (themeval) {
            case "ln_english": {
                return (
                    <>
                        <div style={{textAlign:"center", fontSize:"2rem", marginBottom:"-0.5rem", marginTop:"-0.5rem"}}>EN</div>
                    </>
                )
            }
            default : {
                return (
                    <>
                        <div style={{textAlign:"center", fontSize:"2rem", marginBottom:"-0.5rem", marginTop:"-0.5rem"}}>EN</div>
                    </>
                )
            }
        }
    }
      
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>
            <Dropdown style={{margin:"0em", height:"100%"}} onSelect={(e,obj) => SetLanguage(e? e : "")}>
                <Dropdown.Toggle bsPrefix="overcomeBackground no-margin no-padding" style={{width:"fit-content",fontWeight:"600"}} id="dropdown-custom-components">
                    {returnCurrentLanguage(language)}
                </Dropdown.Toggle>
            
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="ln_english" >English</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </ErrorBoundary>
        
      );
}

export default LanguageSwap

