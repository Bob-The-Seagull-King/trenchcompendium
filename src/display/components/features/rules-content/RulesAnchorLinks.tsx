import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, {useState} from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import {faBook, faChevronDown, faChevronRight, faChevronUp, faIndent} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Collapse} from "react-bootstrap";

export interface ContentsLink {
    name: string,
    route: string
}

export interface ContentsCollection {
    listofcontents: ContentsLink[];
    showheader : boolean;
    title : string;
}

const DefaultState = false;

const RulesAnchorLinks: React.FC<ContentsCollection> = (props: any) => {

    const [open, setOpen]   = useState(DefaultState);

    function ReturnItemLink(_obj : ContentsLink) {
        return (
            <a className="rules-page-anchor" href={"#"+_obj.route}>
                {_obj.name}
                <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right" />
            </a>
        )
    }

    return (
        <div className="rules-page-anchors">
            <div className="rules-page-anchors-title" onClick={() => {
                setOpen(!open)
            }}>
                <span className={'text'}>
                    <FontAwesomeIcon icon={faIndent} className="icon-inline-left-l"/>
                    {'On this page'}
                </span>

                <span className={'collapse-chevron-wrap'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>
            <Collapse in={open}>
                <div className={'rules-page-anchors-content'}>
                    {props.listofcontents.map((item: ContentsLink) =>
                        ReturnItemLink(item)
                    )}
                </div>
            </Collapse>
        </div>
    )
}

export default RulesAnchorLinks;