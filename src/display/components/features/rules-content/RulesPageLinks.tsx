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
import { Form } from 'react-bootstrap';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import FactionModelDisplay from '../model/FactionModelDisplay';
import FactionEquipmentDisplay from '../equipment/FactionEquipmentDisplay';
import FactionEquipmentWideDisplay from '../equipment/FactionEquipmentWideDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight, faEye, faLink} from '@fortawesome/free-solid-svg-icons';
import ContentsComponentAnchor, { ContentsLink } from '../../../components/subcomponents/informationpanel/ContentsComponentAnchor';
import ModelDisplay from '../model/ModelDisplay';



interface RulesPageLinksProps {
    prev_page: any;
    next_page: any;
    curr_page: any;
}

const RulesPageLinks: React.FC<RulesPageLinksProps> = ({ prev_page, next_page, curr_page }) => {


    return (
        <div className="rules-page-links">
            <a href={''} className={'rules-page-link rules-page-link-prev'}>
                <FontAwesomeIcon icon={faChevronLeft} className="" />

                <span className={'page-name'}>
                    {'Previous'}
                </span>
            </a>

            <a href={''} className={'rules-page-link rules-page-link-next'}>
                <span className={'page-name'}>
                    {'Next'}
                </span>

                <FontAwesomeIcon icon={faChevronRight} className=""/>
            </a>
        </div>
)
};

export default RulesPageLinks;
