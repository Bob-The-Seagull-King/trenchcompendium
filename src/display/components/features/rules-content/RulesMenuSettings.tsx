import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGlobalState } from '../../../../utility/globalstate'
import { ControllerController } from '../../../../classes/_high_level_controllers/ControllerController';
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {makestringpresentable} from "../../../../utility/functions";



const RulesMenuSettings: React.FC = () => {

    const [theme, setTheme] = useGlobalState('theme');
    const [loreshow, setLoreShow] = useGlobalState('loreshow');


    const isDark = theme === 'dark';

    const handleThemeToggle = () => {
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);

        setTheme(newTheme);
    };

    const showLore = loreshow === 'true';
    const handleLoreToggle = () => {
        const newLore = showLore ? 'false' : 'true';
        localStorage.setItem('loreshow', newLore);

        setLoreShow(newLore);
    };

    return (
        <ErrorBoundary fallback={<div>Something went wrong with RulesMenuSettings.tsx</div>}>

            <div className="form-check form-switch">
                <input className="form-check-input"
                   type="checkbox"
                   role="switch"
                   id="themeSwitch"
                   checked={isDark}
                   onChange={handleThemeToggle}
               />
                <label className="form-check-label" htmlFor="switchCheckChecked">{'Dark Mode'}</label>
            </div>

            <div className="form-check form-switch">
                <input className="form-check-input"
                       type="checkbox"
                       role="switch"
                       id="themeSwitch"
                       checked={showLore}
                       onChange={handleLoreToggle}
                />
                <label className="form-check-label" htmlFor="switchCheckChecked">{'Show Lore'}</label>
            </div>

            {/*<div className="form-check form-switch">*/}
            {/*    <input className="form-check-input"*/}
            {/*           type="checkbox"*/}
            {/*           role="switch"*/}
            {/*           id="themeSwitch"*/}
            {/*           checked={showLore}*/}
            {/*           onChange={handleLoreToggle}*/}
            {/*    />*/}
            {/*    <label className="form-check-label" htmlFor="switchCheckChecked">{'Show Base Sizes'}</label>*/}
            {/*</div>*/}
        </ErrorBoundary>

    );
}

export default RulesMenuSettings

