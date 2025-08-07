import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faInfo, faQuestion, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";

interface AlertInfoProps {
    type?: 'warning' | 'info' | 'danger' | 'tip' | '';
    children?: React.ReactNode;
    className?: string;
}

/**
 * This is a styled alert, that can be used page wide to show information in an info box
 * - The type determines the style of the alert
 */
const AlertCustom: React.FC<AlertInfoProps> = ({ type = '', children, className = '' }) => {
    return (
        <div className={`AlertCustom AlertCustom-${type || 'info'} ${className}`}>
            { type == 'info' &&
                <FontAwesomeIcon icon={faCircleInfo} className={'AlertCustom-icon'}/>
            }
            { type == 'danger' &&
                <FontAwesomeIcon icon={faTriangleExclamation}  className={'AlertCustom-icon'}/>
            }
            { type == 'warning' &&
                <FontAwesomeIcon icon={faTriangleExclamation}  className={'AlertCustom-icon'}/>
            }
            { type == 'tip' &&
                <FontAwesomeIcon icon={faQuestion}  className={'AlertCustom-icon'}/>
            }

            <div className={'AlertCustom-inner'}>
                {children}
            </div>
        </div>
    );
};



export default AlertCustom;
