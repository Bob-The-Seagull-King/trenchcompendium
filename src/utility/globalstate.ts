import { EventRunner } from '../classes/contextevent/contexteventhandler';
import React from 'react';
import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
    theme: InitTheme(),
    language: InitLanguage(),
    loreshow: InitLoreShow(),
    applycurse: InitApplyCurse(),
    eventrunner : InitEventHandler(),

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

function InitLoreShow() {
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


function InitApplyCurse() {
    const applycurse = localStorage.getItem('applycurse');

    if (applycurse != null) {
        if (applycurse === "true") {
            return 'true'
        } else {
            return 'false'
        }
    }
    return 'true'
}

export {useGlobalState, InitTheme};
