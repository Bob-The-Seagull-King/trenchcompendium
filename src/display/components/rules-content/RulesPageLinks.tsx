import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight, faEye, faLink} from '@fortawesome/free-solid-svg-icons';
import CustomNavLink from '../../components/subcomponents/interactables/CustomNavLink';


interface RulesPageLinksProps {
    prev_page: any; // The item we want to go to when hitting the prev button
    next_page: any; // The item we want to go to when hitting the next button
    display_path: string; // The base path we are navigating in
    func: any; // The function to call when we want to switch to a given item, cannot be in this component due to update-loops
}

const RulesPageLinks: React.FC<RulesPageLinksProps> = (prop) => {

    function RunPrev() {
        prop.func(prop.prev_page)
    }

    function RunNext() {
        prop.func(prop.next_page)
    }

    return (
        <div className="rules-page-links">
            {prop.prev_page != undefined &&
                <CustomNavLink
                    link={prop.display_path + ((prop.prev_page != undefined)? prop.prev_page.HeldItem.ID : "")}
                    runfunc={RunPrev}
                    classes={'rules-page-link rules-page-link-prev'}
                >
                <span className={'page-link-label'}>
                    <FontAwesomeIcon icon={faChevronLeft} className="icon-inline-left-l" />
                    {'Previous'}
                </span>

                    <span className={'page-name'}>
                    {(prop.prev_page != undefined)? prop.prev_page.HeldItem.Name : ""}
                </span>
                </CustomNavLink>
            }

            {prop.next_page != undefined &&
                <CustomNavLink
                    link={prop.display_path + ((prop.next_page != undefined) ? prop.next_page.HeldItem.ID : "")}
                    runfunc={RunNext}
                    classes={'rules-page-link rules-page-link-next'}
                >
                    <span className={'page-link-label'}>
                        {'Next'}
                        <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right-l"/>
                    </span>

                    <span className={'page-name'}>
                        {(prop.next_page != undefined) ? prop.next_page.HeldItem.Name : ""}
                    </span>

                </CustomNavLink>
            }
        </div>
    )
};

export default RulesPageLinks;
