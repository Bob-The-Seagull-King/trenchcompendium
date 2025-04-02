import 'bootstrap/dist/css/bootstrap.css'
import React, { useState } from 'react'

// Imports
import Modal from 'react-bootstrap/Modal';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleXmark, faClose} from '@fortawesome/free-solid-svg-icons'

const RulesOverlay = (props: any) => {
    const displayMethod = props.d_method
    const ruleName = props.titlename

    // States
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <span className='popup-trigger-text' onClick={() => handleShow()}>{ruleName}</span>

            <Modal show={show} size="lg" contentClassName="rules-overlay" dialogClassName=""  onHide={handleClose} keyboard={true}  centered>
                <Modal.Body >
                    <div className={'rules-overlay-head'}>
                        <div className={'rule-name'}>
                            {ruleName}
                        </div>
                        <div className="rules-overlay-close" onClick={() => handleClose()}>
                            <FontAwesomeIcon icon={faClose} className="" />
                        </div>
                    </div>

                    <div className={'rules-overlay-content'}>
                        {displayMethod()}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RulesOverlay;