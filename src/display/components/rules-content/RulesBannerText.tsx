import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import CustomNavLink from '../subcomponents/interactables/CustomNavLink';

type RulesBannerTextProps = {
    link: string
    title: string
    children?: React.ReactNode
    type?: string
}

const RulesBannerText: React.FC<RulesBannerTextProps> = ({ link, title,  children, type }) => {
    const navigate = useNavigate();
    
    function SpecificNavigtateOut(item : any) {
        navigate(item, {state: Date.now().toString()});
    }

    let typeClass = '';
    if( type == 'inline') {
        typeClass = 'inline'
    }

    return (
        <div className={'RulesBannerText ' + typeClass}>
            <CustomNavLink link={link}
                        runfunc={() => {
                            SpecificNavigtateOut(link)
                        }}
                        classes={'RulesBannerText-link'}  >
                {title}
                <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right"/>
            </CustomNavLink>
            {children}
        </div>
    )
}

export default RulesBannerText