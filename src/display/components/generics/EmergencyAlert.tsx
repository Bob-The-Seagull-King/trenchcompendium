import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import {ROUTES} from "../../../resources/routes-constants";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

export const EmergencyAlert: React.FC = () => {
    // show the popup
    const [showPopup, setShowPopup] = useState(true);

    // handle click accept some
    const handleClose = () => {
        setShowPopup(false);
    };


    // return the privacy modal maybe
    if (!showPopup) return null;

    return (
        <Modal className={'privacy-popup'} show={showPopup} onHide={ () => setShowPopup(false)}>
            <div className="privacy-popup-inner">
                <h3>{'We are experiencing Technical Difficulties'}</h3>
                <p>
                    {'Due to a high volume of warbands being created, we are currently migrating databases. This should be resolved soon, but in the mean time expect difficulties with creating new warbands. Stand by!'}

                </p>


                <div className="privacy-popup-actions">
                    <button className="btn btn-primary btn-block" onClick={handleClose}>Close</button>
                </div>
            </div>
        </Modal>
    );
};
