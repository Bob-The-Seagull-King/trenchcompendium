import React, {useEffect, useState} from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import {usePlayMode} from "../../../context/PlayModeContext";
import {usePrintMode} from "../../../context/PrintModeContext";

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

    const { playMode } = usePlayMode();
    const { printMode } = usePrintMode();

    // Update `open` when playMode changes
    useEffect(() => {
        if (playMode || printMode) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [playMode, printMode]);

    return (
        <div className="WbbOptionItem">

            {/* Edit View with options */}
            {(!playMode && !printMode) &&
                <div className="option-title"
                     onClick={(e) => {
                         handleSelectOption();
                }}>
                    <span
                        className="input-wrap"
                    >
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={option.Id}
                            checked={selected}
                            onClick={(e) => e.stopPropagation()} // prevent collapse toggle
                            onChange={handleSelectOption}
                        />
                    </span>

                    <span className="option-name">{option.Name}</span>

                    <span className="option-cost">
                        {option.CostDucats > 0 && ` - ${option.CostDucats} Ducats`}
                            {option.CostGlory > 0 && ` - ${option.CostGlory} Glory`}
                    </span>


                    <span className="collapse-chevron-wrap" onClick={(e) => {
                        e.stopPropagation(); // prevent option from being selected
                        setOpen(!open);
                    }}>
                        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
                    </span>
                </div>
            }

            {/* Play mode view without options*/}
            {(playMode || printMode) &&
                <div className="option-title"
                     onClick={() => {
                         setOpen(!open);
                     }}>
                    <span className="option-name">{option.Name}</span>

                    <span className="collapse-chevron-wrap">
                        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown}/>
                    </span>
                </div>
            }

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
