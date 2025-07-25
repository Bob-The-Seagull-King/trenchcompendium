import '../../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'

// Classes
import {Collapse, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBook, faChevronDown, faChevronUp, faLink} from '@fortawesome/free-solid-svg-icons';
import { useGlobalState } from '../../../utility/globalstate';
import {Faction} from "../../../classes/feature/faction/Faction";



interface RulesLoreSectionProps {
    faction: any;
}

const RulesLoreSection: React.FC<RulesLoreSectionProps> = ({ faction }) => {
    const factionObject: Faction = faction;


    const [open, setOpen] = useState( false);

    // Render nothing if loreshow !== 'true'
    const [loreshow] = useGlobalState('loreshow');
    if (loreshow === 'false') return null;

    return (
        <div className={'RulesLoreSection rules-lore-section'} id={'Lore'}>
            <div className={'rules-lore-title'} onClick={() => setOpen(!open)}>
                <span className={'text'}>
                    <FontAwesomeIcon icon={faBook} className="icon-inline-left-l"/>
                    {"Faction lore"}
                </span>
                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div className="rules-lore-content">
                    {factionObject.GetLoreHTML()}
                </div>
            </Collapse>
        </div>
    )
};

export default RulesLoreSection;
