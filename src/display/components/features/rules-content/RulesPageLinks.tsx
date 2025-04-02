import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useState } from 'react'

// Classes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight, faEye, faLink} from '@fortawesome/free-solid-svg-icons';


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
