import { Button, Collapse } from "react-bootstrap";
import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

interface RulesModelDisplayCollapseProps {
    name: string | undefined;
    method: any;
    state: boolean;
    has_children?: boolean;
}

const RulesModelDisplayCollapse: React.FC<RulesModelDisplayCollapseProps> = ({ name = "", method, state, has_children = false }) => {


    const [open, setOpen]   = useState((state != undefined)? state : true);

    return (
        <div className={`fighter-card-collapse ${has_children ? 'has-children' : ''}`}>
            <div onClick={() => {
                setOpen(!open)
            }} className={'fighter-card-collapse-title'}>
                <span className={'text'}>
                    {name || ""}
                </span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="fighter-card-collapse-content">
                    <div className={'fighter-card-collapse-content-inner'}>
                        {method()}
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default RulesModelDisplayCollapse;