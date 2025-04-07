import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight, faEye, faLink} from '@fortawesome/free-solid-svg-icons';


interface RulesPageLinksProps {
    prev_page: any;
    next_page: any;
    prev_name: string;
    next_name: string;
}

const RulesPageLinks: React.FC<RulesPageLinksProps> = (prop) => {


    return (
        <div className="rules-page-links">
            <div onClick={() => prop.prev_page()} className={'rules-page-link rules-page-link-prev'}>
                <FontAwesomeIcon icon={faChevronLeft} className="" />

                <span className={'page-name'}>
                    {prop.prev_name}
                </span>
            </div>

            <div onClick={() => prop.next_page()} className={'rules-page-link rules-page-link-next'}>
                <span className={'page-name'}>
                    {prop.next_name}
                </span>

                <FontAwesomeIcon icon={faChevronRight} className=""/>
            </div>
        </div>
)
};

export default RulesPageLinks;
