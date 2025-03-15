import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import { Button, Collapse } from "react-bootstrap";
import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

// Classes
import { getColour } from '../../../utility/functions';

const GenericCollapsableBlockDisplay = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const displayMethod = props.d_method
    const DefaultState = props.d_state

    const [open, setOpen]   = useState((DefaultState != undefined)? DefaultState : true);

    return (
        <div >
            <div onClick={() => {setOpen(!open)}} className={'align-left-right size-strongtext font-default hovermouse colorBasicText centered-div backgroundBgBase borderthin border'+getColour(DisplayColour)}>
                <div className='totalmarginmed'>
                    {DisplayName || ""}
                </div>
                <div className='totalmarginmed'>
                    <FontAwesomeIcon icon={open? faChevronDown : faChevronUp} className="colorBasicText"/>
                </div>
            </div>
            <Collapse in={open}>
                <div className={'container borderthin border'+getColour(DisplayColour)}>
                    <div className={"bar backgroundgrey"} />
                    <div className="content">                    
                        {displayMethod()}
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default GenericCollapsableBlockDisplay;