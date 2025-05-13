import '../../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'

// Classes
import {Collapse, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBook, faChevronDown, faChevronUp, faLink} from '@fortawesome/free-solid-svg-icons';
import RulesCollapsibleContent from "./RulesCollapsibleContent";

const DefaultState = false;


interface RulesFactionRuleProps {
    headline: any;
    content: any;
}

const RulesFactionRule: React.FC<RulesFactionRuleProps> = ({ headline, content }) => {
    const [open, setOpen]   = useState(DefaultState);

    return (
        <div className={'rules-faction-rule RulesFactionRule'}>
            <RulesCollapsibleContent
                headline={headline}
                content={content}
            />
        </div>
    )
};

export default RulesFactionRule;
