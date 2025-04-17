import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface WbbFighterCollapseProps {
    title: string;
    children: React.ReactNode;
    initiallyOpen?: boolean;
}

const WbbFighterCollapse: React.FC<WbbFighterCollapseProps> = ({ title, children, initiallyOpen = false }) => {
    const [open, setOpen] = useState(initiallyOpen);

    return (
        <div className="WbbFighterCollapse fighter-card-collapse">
            <div
                className="fighter-card-collapse-title"
                onClick={() => setOpen(!open)}
            >
                <span>{title}</span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="fighter-card-collapse-content">
                    <div className={'fighter-card-collapse-content-inner'}>
                        {children}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default WbbFighterCollapse;