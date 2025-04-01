import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface ContentsLink {
    name: string,
    route: string
}

export interface ContentsCollection {
    listofcontents: ContentsLink[];
    showheader : boolean;
    title : string;
}

const ContentsComponentAnchor: React.FC<ContentsCollection> = (props: any) => {

    function ReturnItemLink(_obj : ContentsLink) {
        return (
            <a className="rules-page-anchor" href={"#"+_obj.route}>
                {_obj.name}
                <FontAwesomeIcon icon={faChevronRight} className="right" />
            </a>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <div className="rules-page-anchors">
                <div className="rules-page-anchors-title">
                    On this page
                </div>
                {props.listofcontents.map((item : ContentsLink) =>
                    ReturnItemLink(item)
                )}
            </div>
        </ErrorBoundary>
    )
}

export default ContentsComponentAnchor;