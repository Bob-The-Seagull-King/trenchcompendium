import '../../../resources/styles/vendor/bootstrap.css'
import React, {useEffect} from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'
import { Icon, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { makestringpresentable } from '../../../utility/functions';

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
    function returnPalletes(themeval: string | null, _icon : IconDefinition, curtheme : string) {
        return (
            <div onClick={() => SetPallete(themeval? themeval : curtheme)} className={"hovermouse size-strongtext   totalmarginsml align-left-right color"+(themeval == curtheme ? 'default' : 'BasicText')}>
                <div className="horizontalspacermed">{makestringpresentable(themeval? themeval : "")}</div>
                <FontAwesomeIcon icon={_icon} className=""/>
            </div>
        )
    }
      
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>
            <div className={"totalmarginsml"}>
                <div>
                    {returnPalletes('light', faSun, theme)}
                </div>
                <div className="separator colorgrey" />
                <div>
                    {returnPalletes('dark', faMoon, theme)}
                </div>
            </div>
        </ErrorBoundary>
        
      );
}

export default PalleteSwap

