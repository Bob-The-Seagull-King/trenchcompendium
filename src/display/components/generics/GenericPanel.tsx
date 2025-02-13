import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'
import { PanelDataDex, PanelType } from '../subcomponents/informationpanel/InfoPanelStatic';

const GenericPanel = (prop: any) => {
    const panelid : Lowercase<string> = prop.panelname;
    const panelType : PanelType = PanelDataDex[panelid]

    // State
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [theme] = useGlobalState('theme');

    
    // Return result -----------------------------
    return (
        <>
            <div className="filterbox">
                {panelType.returnButton(handleShow)}
            </div>
            <Modal data-theme={theme}  show={show}  contentClassName="basestructure abilityStructure borderstyler colordefault" dialogClassName="" onHide={handleClose} keyboard={true}  centered>
                
                <h1 className={'titleShape titlebody backgrounddefault'}>
                    {panelType.id}
                    <div className="row float-end">
                        <div className='col-12 float-end'>
                            <Button className="no-padding" variant="" onClick={() => handleClose()}>
                                <FontAwesomeIcon icon={faCircleXmark} className="colorWhite contentpacklabel no-margin" />
                            </Button>
                        </div>
                    </div>
                </h1>
                <Modal.Body >
                    {panelType.returnModal()}
                </Modal.Body>
            </Modal>
        </>
    )
    // -------------------------------------------
}

export default GenericPanel