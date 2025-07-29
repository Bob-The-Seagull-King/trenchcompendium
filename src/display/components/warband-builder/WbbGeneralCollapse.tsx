import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface WbbGeneralCollapseProps {
    title: string;
    children: React.ReactNode;
    initiallyOpen?: boolean;
    nopad?: boolean;
}

const WbbGeneralCollapse: React.FC<WbbGeneralCollapseProps> = ({ title, children, initiallyOpen = false, nopad=false }) => {
    const [open, setOpen] = useState(initiallyOpen);

    return (
        <div className="WbbGeneralCollapse">
            <div
                className="WbbGeneralCollapse-title"
                onClick={() => setOpen(!open)}
            >
                <span>{title}</span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="WbbGeneralCollapse-content">
                    <div className={nopad? '' : 'WbbGeneralCollapse-content-inner'}>
                        {children}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default WbbGeneralCollapse;