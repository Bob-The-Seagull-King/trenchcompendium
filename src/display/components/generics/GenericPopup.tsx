import '../../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'

// Imports
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

// Classes
import { getColour } from '../../../utility/functions';
import { useGlobalState } from '../../../utility/globalstate'

const GenericPopup = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const DisplayType : string = props.d_type;
    const displayMethod = props.d_method

    const ruleName = props.titlename

    // States
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>

        <span className='popup-trigger-text' onClick={() => handleShow()}>{ruleName}</span>


        <Modal show={show} size="lg" contentClassName="overcomeBackground" dialogClassName=""  onHide={handleClose} keyboard={true}  centered>
            <Modal.Body >

            <div className={'backgroundBgCard basestructure   borderthin bordergrey'}>
                <div className={'borderthin bordergrey  size-subtitle font-seriftext background'+getColour(DisplayColour)}>
                    <div className="">
                        <Button className="no-padding" variant="" onClick={() => handleClose()}>
                            <FontAwesomeIcon icon={faCircleXmark} className="size-subtitle" />
                        </Button>
                    </div>
                    <div className="size-subtitle">
                        {DisplayName || ""}
                    </div>
                </div>

                <div className={""}>
                    {displayMethod()}
                </div>
            </div>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default GenericPopup;