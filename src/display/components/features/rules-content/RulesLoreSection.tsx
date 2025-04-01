import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ToastContainer, toast } from 'react-toastify';
import { returnDescription } from '../../../../utility/util'
import { Model } from '../../../../classes/feature/model/Model';
import GenericDisplay from '../../generics/GenericDisplay';
import AbilityDisplay from '../ability/AbilityDisplay';
import GenericHover from '../../generics/GenericHover';
import KeywordDisplay from '../glossary/KeywordDisplay';
import ItemStat from '../../subcomponents/description/ItemStat';
import { ModelStatistics } from '../../../../classes/feature/model/ModelStats';
import { containsTag, getBaseSize, getColour, getMoveType, getPotential } from '../../../../utility/functions';
import ModelUpgradeDisplay from '../ability/ModelUpgradeDisplay';
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { IChoice } from '../../../../classes/options/StaticOption';
import ModelEquipmentDisplay from '../equipment/ModelEquipmentDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import {Collapse, Form} from 'react-bootstrap';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import FactionModelDisplay from '../model/FactionModelDisplay';
import FactionEquipmentDisplay from '../equipment/FactionEquipmentDisplay';
import FactionEquipmentWideDisplay from '../equipment/FactionEquipmentWideDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBook, faChevronDown, faChevronUp, faLink} from '@fortawesome/free-solid-svg-icons';
import ContentsComponentAnchor, { ContentsLink } from '../../../components/subcomponents/informationpanel/ContentsComponentAnchor';
import ModelDisplay from '../model/ModelDisplay';
import {Faction} from "../../../../classes/feature/faction/Faction";

const DefaultState = false;


interface RulesHeadlineProps {
    headline: any;
    content: any;
}

const RulesLoreSection: React.FC<RulesHeadlineProps> = ({ headline, content }) => {
    const [open, setOpen]   = useState(DefaultState);

    return (
        <div className={'rules-lore-section'}>

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
