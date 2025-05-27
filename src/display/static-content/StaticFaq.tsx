/**
 * A static component that displays a collapsible faq element
 */

import React, {useState} from 'react'
import {Collapse} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

interface StaticFaqProps {
    title: string
    content: React.ReactNode
}

const DefaultState = false;

const StaticFaq: React.FC<StaticFaqProps> = ({ title, content }) => {

    const [open, setOpen]   = useState(DefaultState);

    return (
        <div className="StaticFaq">
            <div className={'StaticFaq-title'}
                 onClick={() => {
                     setOpen(!open)
                 }}
            >
                <span className={'text'}>
                    {title}
                </span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="StaticFaq-content">
                    <div className="StaticFaq-content-inner">
                        {content}
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default StaticFaq