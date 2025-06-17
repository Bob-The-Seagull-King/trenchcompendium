import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface WbbDetailViewCollapseProps {
    title: string;
    children: React.ReactNode;
    initiallyOpen?: boolean;
}

const WbbDetailViewCollapse: React.FC<WbbDetailViewCollapseProps> = ({ title, children, initiallyOpen = false }) => {
    const [open, setOpen] = useState(initiallyOpen);

    return (
        <div className="WbbDetailViewCollapse">
            <div
                className="WbbDetailViewCollapse-title"
                onClick={() => setOpen(!open)}
            >
                <span>{title}</span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="WbbDetailViewCollapse-content">
                    <div className={'WbbDetailViewCollapse-inner'}>
                        {children}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default WbbDetailViewCollapse;