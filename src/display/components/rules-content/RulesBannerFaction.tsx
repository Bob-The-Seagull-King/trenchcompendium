import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import SynodFactionImage from "../../../utility/SynodFactionImage";
import CustomNavLink from '../subcomponents/interactables/CustomNavLink';

type RulesBannerFactionProps = {
    slug: string
    title: string
    children?: React.ReactNode
    parentSlug?: string
}

const RulesBannerFaction: React.FC<RulesBannerFactionProps> = ({ slug, title, parentSlug = false, children }) => {
    const fullSlug = parentSlug ? `${parentSlug}/${slug}` : slug
    const link = `/compendium/faction/${fullSlug}`


    const navigate = useNavigate();
    
    function SpecificNavigtateOut(item : any) {
        navigate(item, {state: Date.now().toString()});
    }
    return (
        <div className="RulesBannerFaction">
            <CustomNavLink link={link}
                        runfunc={() => {
                            SpecificNavigtateOut(link)
                        }}
                        classes={'faction-item'}  >
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
            </CustomNavLink>


            {children}
        </div>
    )
}

export default RulesBannerFaction