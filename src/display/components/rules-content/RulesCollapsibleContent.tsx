// RulesCollapsibleContent.tsx
import React, { useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {Collapse} from "react-bootstrap";

interface RulesCollapsibleContentProps {
    headline: string | undefined;
    content: any;
}

const DefaultState = false;

const RulesCollapsibleContent: React.FC<RulesCollapsibleContentProps> = ({ headline, content }) => {
    const [open, setOpen]   = useState(DefaultState);

    return (
        <div className={'RulesCollapsibleContent'}>
            <div className={'RulesCollapsibleContent-title'}
                 onClick={() => {
                     setOpen(!open)
                 }}
            >
                <span className={'text'}>
                    {headline}
                </span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="RulesCollapsibleContent-content">
                    <div className="RulesCollapsibleContent-content-inner">
                        {content}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default RulesCollapsibleContent;