import React from 'react'
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

type RulesBannerTextProps = {
    link: string
    title: string
    children?: React.ReactNode
}

const RulesBannerText: React.FC<RulesBannerTextProps> = ({ link, title,  children }) => {
    return (
        <div className={'RulesBannerText'}>
            <Link to={link} className="RulesBannerText-link">
                {title}
                <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right"/>
            </Link>

            {children}
        </div>
    )
}

export default RulesBannerText