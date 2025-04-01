import 'bootstrap/dist/css/bootstrap.css'
import { Button, Collapse } from "react-bootstrap";
import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'


const RulesModelDisplayCollapse = (props: any) => {
    const DisplayName : string = props.d_name;
    const displayMethod = props.d_method
    const DefaultState = props.d_state


    const [open, setOpen]   = useState((DefaultState != undefined)? DefaultState : true);

    return (
        <div className="fighter-card-collapse">
            <div onClick={() => {setOpen(!open)}} className={'fighter-card-collapse-title'}>
                <span className={'text'}>
                    {DisplayName || ""}
                </span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="fighter-card-collapse-content">
                    {displayMethod()}
                </div>
            </Collapse>
        </div>
    )
}

export default RulesModelDisplayCollapse;