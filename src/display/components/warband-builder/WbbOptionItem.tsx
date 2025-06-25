import React, {useEffect, useState} from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import {usePlayMode} from "../../../context/PlayModeContext";
import {usePrintMode} from "../../../context/PrintModeContext";
import { ModelUpgradeRelationship } from '../../../classes/relationship/model/ModelUpgradeRelationship';
import { getCostType } from '../../../utility/functions';
import { returnDescription } from '../../../utility/util';
import { MemberUpgradePresentation } from '../../../classes/saveitems/Warband/Purchases/WarbandMember';


interface WbbOptionItemProps {
    option: MemberUpgradePresentation;
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
                         if( !option.upgrade.IsLimitReached() ) {
                             handleSelectOption();
                         }
                    }}
                >
                    <span
                        className="input-wrap"
                    >
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={option.upgrade.ID}
                            checked={selected}
                            disabled={option.upgrade.IsLimitReached()}
                            onClick={(e) => e.stopPropagation()} // prevent collapse toggle
                            onChange={handleSelectOption}
                        />
                    </span>

                    <span className="option-name">{option.upgrade.UpgradeObject.Name}</span>

                    {/* Displays the cost of the upgrade */}
                    {option.upgrade.Cost > 0 &&
                        <span className="option-cost">
                            {' - '}
                            {option.upgrade.Cost + " " + getCostType(option.upgrade.CostType)}
                        </span>
                    }

                    {/* Displays the limit of the upgrade if any */}
                    { option.GetLimitNumber() > 0 &&
                        <span className='option-limit'>
                            {' - '}
                            {option.GetLimitNumber()}
                            {'/'}
                            {option.GetLimitNumberTotal()}
                        </span>
                    }

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
                    <span className="option-name">{option.upgrade.UpgradeObject.Name}</span>

                    <span className="collapse-chevron-wrap">
                        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown}/>
                    </span>
                </div>
            }

            <Collapse in={open}>
                <div className="option-details">
                    <div className="option-details-inner">
                        {returnDescription(option.upgrade, option.upgrade.UpgradeObject.Description)}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default WbbOptionItem;
