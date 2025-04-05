import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import {capitalizeString, makestringpresentable} from '../../../../utility/functions'
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BasicButton = (props: any) => {
    const title : string = props.btn_title;
    const active : boolean = props.btn_state;
    const onpress = props.btn_press;
    const DirectionArr = props.d_dir != undefined? props.d_dir : "";


    function RunPressFunc() {
        if (active) {
            onpress();
        }
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with TagDisplay.tsx</div>}>
            <div key={active.toString()} onClick={() => RunPressFunc()} className={" borderstyler " + (active? "bordergrey backgroundBgCard " : "borderBgCard backgroundBgBase")}>
                <div className={"  " + (active? "" : "colorBgCard")}>
                    {DirectionArr == "l" &&
                        <FontAwesomeIcon className={" " + (active? "" : "colorBgCard")} icon={faChevronLeft} />
                    }
                    {title}
                    {DirectionArr == "r" &&
                        <FontAwesomeIcon className={" " + (active? "" : "colorBgCard")} icon={ faChevronRight } />
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default BasicButton;