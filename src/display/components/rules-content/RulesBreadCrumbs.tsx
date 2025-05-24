import React, { useEffect, useState } from 'react'
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useLocation, useNavigate} from "react-router-dom";
import SynodImage from "../../../utility/SynodImage";
import { BreadcrumbItem } from 'react-bootstrap';
import { makestringpresentable } from '../../../utility/functions';

interface breadcrumbitem  {
    title : string,
    url : string
}

const RulesBreadCrumbs: React.FC = () => {

    const navigate = useNavigate();
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');

    const { state } = useLocation();
    const [breadcrumbs, setbreadcrumbs] = useState<breadcrumbitem[]>([])
        
    useEffect(() => {
        const splits = urlSplits;
        const breaditems : breadcrumbitem[] = []
        let sumurl = ""
        for (let i = 1; i < splits.length; i++) {
            sumurl += "/"
            sumurl += splits[i]
            breaditems.unshift(
                {
                    title: makestringpresentable(splits[i]),
                    url: sumurl
                }
            )
        }

        setbreadcrumbs(breaditems);
    }, [state]);

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