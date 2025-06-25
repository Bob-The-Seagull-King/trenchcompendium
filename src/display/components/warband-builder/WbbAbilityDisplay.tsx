import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Ability } from '../../../classes/feature/ability/Ability';
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { returnDescription } from '../../../utility/util';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';

interface WbbAbilityCollapseProps {
    ability: WarbandProperty;
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
                        {returnDescription(ability, (ability.SelfDynamicProperty.OptionChoice as Ability).Description)}
                       
                        {ability.SelfDynamicProperty.Selections.length > 0 &&
                            <span className={'title-choice'}>
                                {ability.SelfDynamicProperty.Selections.map((item) => 
                                    <WbbOptionSelect 
                                        property={ability}
                                        key={ability.SelfDynamicProperty.Selections.indexOf(item)}
                                        choice={item}
                                    />
                                )}                        
                            </span>
                        }
                    </div>
                    
                    
                </div>
            </Collapse>
        </div>
    );
};

export default WbbAbilityDisplay;