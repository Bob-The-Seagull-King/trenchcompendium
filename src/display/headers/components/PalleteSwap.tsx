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

const PalleteSwap = (prop: any) => {

    // State
    const [theme, setTheme] = useGlobalState('theme');
    
    /**
     * Updates the locally stored web theme
     * @param theme The selected theme
     */
    function SetPallete(theme: string) {
        localStorage.setItem('theme', theme);
        setTheme(theme)
    }

    /**
     * Returns the appropriate icon based on the
     * currently selected website theme
     * @param themeval Current theme
     * @returns The theme icon to display
     */
    function returnCurrentPallete(themeval: string | null) {

        switch (themeval) {
            case "light": {
                return (
                    <>
                        <FontAwesomeIcon icon={faSun} className="contentpacklabel colourWhite no-margin"/>
                    </>
                )
            }
            case "dark": {
                return (
                    <>
                        <FontAwesomeIcon icon={faMoon} className="contentpacklabel colourWhite no-margin"/>
                    </>
                )
            }
            default : {
                return (
                    <>
                        <FontAwesomeIcon icon={faSun}  className="contentpacklabel colourWhite no-margin"/>
                    </>
                )
            }
        }
    }
      
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>
            <Dropdown className="no-margin" onSelect={(e,obj) => SetPallete(e? e : "")}>
                <Dropdown.Toggle bsPrefix="overcomeBackground no-margin no-padding" style={{width:"3em"}} id="dropdown-custom-components">
                    {returnCurrentPallete(theme)}
                </Dropdown.Toggle>
            
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="light" >Light</Dropdown.Item>
                    <Dropdown.Item eventKey="dark" >Dark</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </ErrorBoundary>
        
      );
}

export default PalleteSwap

