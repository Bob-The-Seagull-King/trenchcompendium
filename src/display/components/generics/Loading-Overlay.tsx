// // // // //
//
// A global Loading overlay
//

import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

interface LoadingOverlayProps {
    message?: string
    override? : boolean
    variant?: string | 'small-icon'
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading', override = false, variant = '' }) => {

    console.log(variant);

    return (
        <div className={`LoadingOverlay ${variant}`}>
            <div className="LoadingOverlay-inner">
                {(override == undefined || override == false) &&
                    <FontAwesomeIcon icon={faCircleNotch} className="fa-spin"/>
                }
                <div className={'text'}>
                    {message}
                </div>
            </div>
        </div>
    )
}

export default LoadingOverlay