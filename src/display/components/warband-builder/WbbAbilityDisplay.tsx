import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface Ability {
    Name: string;
    Description: string;
}

interface WbbAbilityCollapseProps {
    ability: Ability;
}

const WbbAbilityDisplay: React.FC<WbbAbilityCollapseProps> = ({ ability }) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="WbbAbilityDisplay">
            <div
                className="ability-title"
                onClick={() => setOpen(!open)}
                role="button"
            >
                <span className="ability-name">{ability.Name}</span>
                <span className="collapse-chevron-wrap" onClick={(e) => {
                    e.stopPropagation(); // prevent option from being selected
                    setOpen(!open);
                }}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown}/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="ability-description">
                    <div className="ability-description-inner">
                        {ability.Description}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default WbbAbilityDisplay;