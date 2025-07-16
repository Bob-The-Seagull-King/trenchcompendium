import React, { useEffect, useState } from 'react'
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import {useLocation, useNavigate} from "react-router-dom";
import SynodImage from "../../../utility/SynodImage";
import { BreadcrumbItem } from 'react-bootstrap';
import { BreadcrumbPresentable, convertstringIDtoName, isstringdataID, makestringpresentable } from '../../../utility/functions';

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
        async function GetBreadCrumbs() {
            const splits = urlSplits;
            const breaditems : breadcrumbitem[] = []
            let sumurl = ""
            for (let i = 1; i < splits.length; i++) {
                if (splits[i].length === 0) {
                    continue;
                }
                sumurl += "/"
                sumurl += splits[i]
                let titlenm = BreadcrumbPresentable(splits[i]);
                if (isstringdataID(splits[i])) {
                    titlenm = await convertstringIDtoName(splits[i])
                }
                breaditems.unshift(
                    {
                        title: titlenm,
                        url: sumurl
                    }
                )
            }

            setbreadcrumbs(breaditems);
        }
        GetBreadCrumbs()
    }, [state]);

    return (
        <div className="RulesBreadCrumbs">
            <div className={'container'}>
                <nav className={'RulesBreadCrumbs-inner'}>

                    {breadcrumbs
                        .slice() // clone array
                        .reverse() // show root first
                        .map((crumb, index, arr) => (
                            <React.Fragment key={crumb.url + "_" + index.toString() + "_" + crumb.title}>
                                <CustomNavLink
                                    link={crumb.url}
                                    runfunc={() => {
                                        navigate(`${crumb.url}`)
                                    }}
                                   classes={'breadcrumb-item'}
                                >
                                    {crumb.title}
                                </CustomNavLink>

                                {index < arr.length - 1 && <span className="breadcrumb-separator"> / </span>}
                            </React.Fragment>
                    ))}
                </nav>
            </div>
        </div>
    )
}

export default RulesBreadCrumbs