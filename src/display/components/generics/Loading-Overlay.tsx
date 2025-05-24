// // // // //
//
// A global Loading overlay
//

import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

interface LoadingOverlayProps {
    message?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading' }) => {

    return (
        <div className="LoadingOverlay">
            <div className="LoadingOverlay-inner">
                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin"/>
                <div className={'text'}>
                    {message}
                </div>
            </div>
        </div>
    )
}

export default LoadingOverlay