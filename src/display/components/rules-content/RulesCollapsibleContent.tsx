// RulesCollapsibleContent.tsx
import React, { useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faFilter} from "@fortawesome/free-solid-svg-icons";
import {Collapse} from "react-bootstrap";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface RulesCollapsibleContentProps {
    headline: string | undefined;
    headlineIcon?: IconProp;
    content: any;
}

const DefaultState = false;

const RulesCollapsibleContent: React.FC<RulesCollapsibleContentProps> = ({ headline, headlineIcon, content }) => {
    const [open, setOpen]   = useState(DefaultState);

    return (
        <div className={'RulesCollapsibleContent'}>
            <div className={'RulesCollapsibleContent-title'}
                 onClick={() => {
                     setOpen(!open)
                 }}
            >
                <span className={'text'}>
                    {headlineIcon &&
                        <FontAwesomeIcon icon={headlineIcon} className="icon-inline-left-l"/>
                    }

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