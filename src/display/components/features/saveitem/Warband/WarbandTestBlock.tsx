import 'bootstrap/dist/css/bootstrap.css'
import '../../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Components
import ContentPackDisplay from '../../../../components/features/contentpack/ContentPackDisplay'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faDownload, faEye, faSquareCaretUp, faSquareCaretDown, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';
import { WarbandManager } from '../../../../../classes/saveitems/Warband/WarbandManager';
import { UserWarband } from '../../../../../classes/saveitems/Warband/UserWarband';

const WarbandTestBlock = (prop: any) => {

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with SaveWarbandDisplay.tsx</div>}>
            <div className='fillspace' >
                <div className="row">
                    <div className="col-4">
                        A1
                    </div>
                    <div className="col-4">
                        B1
                    </div>
                    <div className="col-4">
                        C1
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        A2
                    </div>
                    <div className="col-4">
                        B2
                    </div>
                    <div className="col-4">
                        C2
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default WarbandTestBlock