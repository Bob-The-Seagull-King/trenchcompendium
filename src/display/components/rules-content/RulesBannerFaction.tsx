import React from 'react'
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import SynodFactionImage from "../../../utility/SynodFactionImage";

type RulesBannerFactionProps = {
    slug: string
    title: string
    children?: React.ReactNode
    parentSlug?: string
}

const RulesBannerFaction: React.FC<RulesBannerFactionProps> = ({ slug, title, parentSlug = false, children }) => {
    const fullSlug = parentSlug ? `${parentSlug}/${slug}` : slug
    const link = `/compendium/faction/${fullSlug}`


    return (
        <div className="RulesBannerFaction">
            <Link to={link}
                className={'faction-item'}
            >
                <div className={'faction-name'}>
                    {title}
                </div>

                <div className={'faction-image-wrap'}>
                    <SynodFactionImage
                        factionSlug={slug}
                        className={'faction-image'}
                        size={'full'}
                    />
                </div>
            </Link>


            {children}
        </div>
    )
}

export default RulesBannerFaction