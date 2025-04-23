import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface Option {
    Name: string;
    Description: string;
    CostDucats: number;
    CostGlory: number;
    Id: string;
}

interface WbbOptionItemProps {
    option: Option;
}

const WbbOptionItem: React.FC<WbbOptionItemProps> = ({ option }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(false);

    const handleSelectOption = () => {
        setSelected(!selected);
    };

    return (
        <div className="WbbOptionItem">
            <div className="option-title" onClick={() => setOpen(!open)}>

                <span
                    className="input-wrap"
                    onClick={(e) => {
                        e.stopPropagation();         // prevent toggle from triggering
                        handleSelectOption();        // toggle selection
                    }}
                >
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={option.Id}
                        checked={selected}
                        onClick={(e) => e.stopPropagation()} // prevent collapse toggle
                        onChange={handleSelectOption}        // still needed to toggle when checkbox is clicked
                    />
                </span>

                <span className="option-name">{option.Name}</span>

                <span className="option-cost">
                    {option.CostDucats > 0 && ` - ${option.CostDucats} Ducats`}
                    {option.CostGlory > 0 && ` - ${option.CostGlory} Glory`}
                </span>

                <span className="collapse-chevron-wrap">
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
                </span>
            </div>

            <Collapse in={open}>
                <div className="option-details">
                    <div className="option-details-inner">
                        {option.Description}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default WbbOptionItem;
