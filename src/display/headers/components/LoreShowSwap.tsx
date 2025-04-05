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

const LoreShowSwap = (prop: any) => {

    // State
    const [theme, setTheme] = useGlobalState('loreshow');

    /**
     * Updates the locally stored web theme
     * @param theme The selected theme
     */
    function SetPallete(theme: string) {
        localStorage.setItem('loreshow', theme);
        setTheme(Boolean(theme))
    }

      
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>
            <div className={""}>
                <div>
                    <div onClick={() => SetPallete("true")} className={"      color"+(theme == true ? 'default' : 'BasicText')}>
                        <div className="">{makestringpresentable("Always Show Lore")}</div>
                    </div>
                </div>
                <div className="separator colorgrey" />
                <div>
                    <div onClick={() => SetPallete("false")} className={"      color"+(theme == false ? 'default' : 'BasicText')}>
                        <div className="">{makestringpresentable("Collapse Lore By Default")}</div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
        
      );
}

export default LoreShowSwap

