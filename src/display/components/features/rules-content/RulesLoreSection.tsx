import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'

// Classes
import {Collapse, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBook, faChevronDown, faChevronUp, faLink} from '@fortawesome/free-solid-svg-icons';

const DefaultState = false;


interface RulesLoreSectionProps {
    headline: any;
    content: any;
}

const RulesLoreSection: React.FC<RulesLoreSectionProps> = ({ headline, content }) => {
    const [open, setOpen]   = useState(DefaultState);

    return (
        <div className={'rules-lore-section'} id={'Lore'}>

            <div className={'rules-lore-title'} onClick={() => {
                setOpen(!open)
            }}>
                <span className={'text'}>
                    <FontAwesomeIcon icon={faBook} className="icon-inline-left-l"/>
                    {headline}
                </span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>
            <Collapse in={open}>
                <div className="rules-lore-content">
                    {content}
                </div>
            </Collapse>


        </div>

    )
};

export default RulesLoreSection;
