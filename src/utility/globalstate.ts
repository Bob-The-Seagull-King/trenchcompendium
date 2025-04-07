import { EventRunner } from '../classes/contextevent/contexteventhandler';
import React from 'react';
import { createGlobalState } from 'react-hooks-global-state';

const initialState = { theme: InitTheme(),
                        language: InitLanguage(),
                        loreshow: InnitLoreShow(),
                       eventrunner : InitEventHandler()
                    };
const { useGlobalState } = createGlobalState(initialState);

function InitEventHandler() {
    return new EventRunner();
}

function InitLanguage() {
    const theme = localStorage.getItem('language');
    if (theme != null) {
        return theme
    }
    return 'ln_english'
}

function InnitLoreShow() {
    const loreShow = localStorage.getItem('loreshow');
    if (loreShow != null) {
        if (loreShow === "true") {
            return 'true'
        } else {
            return 'false'
        }
    }
    return 'true'
}

function InitTheme() {
    const theme = localStorage.getItem('theme');
    if (theme != null) {
        return theme
    }
    return 'dark'
}

export {useGlobalState, InitTheme};