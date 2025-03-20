import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import {capitalizeString, makestringpresentable} from '../../../../utility/functions'

const BasicButton = (props: any) => {
    const title : string = props.btn_title;
    const active : boolean = props.btn_state;
    const onpress = props.btn_press;

    function RunPressFunc() {
        if (active) {
            onpress();
        }
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with TagDisplay.tsx</div>}>
            <div key={active.toString()} onClick={() => RunPressFunc()} className={"borderstyler " + (active? "bordergrey backgroundBgCard hovermouse" : "borderBgCard backgroundBgBase")}>
                <div className={"totalmarginsml " + (active? "colorBasicText" : "colorBgCard")}>
                    {title}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default BasicButton;