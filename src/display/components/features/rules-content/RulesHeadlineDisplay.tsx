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
import { faLink } from '@fortawesome/free-solid-svg-icons';
import ContentsComponentAnchor, { ContentsLink } from '../../../components/subcomponents/informationpanel/ContentsComponentAnchor';
import ModelDisplay from '../model/ModelDisplay';

function runToast( anchor = "" )
{
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + "#"+anchor)

    toast.error("Link Copied!", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light", // @TODO use theme selection
        type: "success"
    });
}

interface RulesHeadlineProps {
    content: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    idName?: string;
}

const RulesHeadlineDisplay: React.FC<RulesHeadlineProps> = ({ content, level = 1, className = "", idName = '' }) => {
    const Tag: `h${1 | 2 | 3 | 4 | 5 | 6}` = `h${level}`;

    // Set anchor id fallback
    idName = idName || encodeURIComponent(content);

    return (

        <Tag id={idName} className={className + " headline-rules"}>
            {content}
            {idName && (
                <span className='icon-inline-right-s headline-link-btn' onClick={() => (
                        runToast( idName )
                    )}>
                    <FontAwesomeIcon icon={faLink} />
                </span>
            )}
        </Tag>
    )
};

export default RulesHeadlineDisplay;
