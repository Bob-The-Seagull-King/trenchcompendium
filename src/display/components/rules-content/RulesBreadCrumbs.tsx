import React from 'react'
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import SynodImage from "../../../utility/SynodImage";

const RulesBreadCrumbs: React.FC = () => {

    const navigate = useNavigate();

    // @TODO: use actual navigation items
    const breadcrumbs = [
        {
            title: 'Court of the seven headed serpent',
            url: '/compendium/faction/fc_courtofthesevenheadedserpent'
        },
        {
            title: 'Factions',
            url: '/compendium/faction'
        },
        {
            title: 'Compendium',
            url: '/compendium'
        },
    ]

    return (
        <div className="RulesBreadCrumbs">
            <div className={'container'}>
                <nav className={'RulesBreadCrumbs-inner'}>

                    {breadcrumbs
                        .slice() // clone array
                        .reverse() // show root first
                        .map((crumb, index, arr) => (
                            <>
                                <CustomNavLink
                                    key={crumb.url}
                                    link={crumb.url}
                                    runfunc={() => {
                                        navigate(`${crumb.url}`)
                                    }}
                                   classes={'breadcrumb-item'}
                                >
                                    {crumb.title}
                                </CustomNavLink>

                                {index < arr.length - 1 && <span className="breadcrumb-separator"> / </span>}
                            </>
                    ))}
                </nav>
            </div>
        </div>
    )
}

export default RulesBreadCrumbs