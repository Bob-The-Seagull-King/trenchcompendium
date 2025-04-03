import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'

// Classes
import {Collapse, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBook, faChevronDown, faChevronUp, faLink} from '@fortawesome/free-solid-svg-icons';

const DefaultState = false;


interface RulesFactionRuleProps {
    headline: any;
    content: any;
}

const RulesFactionRule: React.FC<RulesFactionRuleProps> = ({ headline, content }) => {
    const [open, setOpen]   = useState(DefaultState);

    return (
        <div className={'rules-faction-rule'}>

            <div className={'rules-faction-rule-title'} onClick={() => {
                setOpen(!open)
            }}>
                <span className={'text'}>
                    {headline}
                </span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>
            <Collapse in={open}>
                <div className="rules-faction-rule-content">
                    {content}
                </div>
            </Collapse>


        </div>

    )
};

export default RulesFactionRule;
