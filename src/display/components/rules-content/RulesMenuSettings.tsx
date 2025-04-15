import '../../../resources/styles/vendor/bootstrap.css'
import React, {useState} from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGlobalState } from '../../../utility/globalstate'
import {faChevronDown, faChevronUp, faCog, faIndent} from "@fortawesome/free-solid-svg-icons";
import {Collapse} from "react-bootstrap";


const DefaultState = false;

const RulesMenuSettings: React.FC = () => {

    const [theme, setTheme] = useGlobalState('theme');
    const [loreshow, setLoreShow] = useGlobalState('loreshow');
    const [open, setOpen]   = useState(DefaultState);


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

            <div className={'rules-settings'}>
                <div className={'rules-settings-title'} onClick={() => {
                    setOpen(!open)
                }}>
                    {'Settings'}

                    <span className={'collapse-icon-wrap'}>
                        <FontAwesomeIcon icon={faCog} className={open ? 'fa-spin' : ''}/>
                    </span>
                </div>

                <Collapse in={open}>
                    <div className={'rules-settings-content'}>
                        <div className={'spacer-20'}></div>
                        <div className="form-check form-switch">
                            <input className="form-check-input"
                                   type="checkbox"
                                   role="switch"
                                   id="theme-switch"
                                   checked={isDark}
                                   onChange={handleThemeToggle}
                            />
                            <label className="form-check-label" htmlFor="theme-switch">{'Dark Mode'}</label>
                        </div>

                        <div className="form-check form-switch">
                            <input className="form-check-input"
                                   type="checkbox"
                                   role="switch"
                                   id="lore-switch"
                                   checked={showLore}
                                   onChange={handleLoreToggle}
                            />
                            <label className="form-check-label" htmlFor="lore-switch">{'Show Lore'}</label>
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

                        <div className={'spacer-20'}></div>
                    </div>
                </Collapse>
            </div>


        </ErrorBoundary>

    );
}

export default RulesMenuSettings

