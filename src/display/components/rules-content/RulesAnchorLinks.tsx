import '../../../resources/styles/vendor/bootstrap.css'
import React, {useState} from 'react'
import {faBook, faChevronDown, faChevronRight, faChevronUp, faIndent} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Collapse} from "react-bootstrap";
import {useGlobalState} from "../../../utility/globalstate";

export interface ContentsLink {
    name: string,
    route: string
}

export interface ContentsCollection {
    listofcontents: ContentsLink[];
    title : string;
}

const DefaultState = false;

const RulesAnchorLinks: React.FC<ContentsCollection> = (props: any) => {

    const [open, setOpen]   = useState(DefaultState);

    const [loreshow] = useGlobalState('loreshow');

    function ReturnItemLink(_obj : ContentsLink) {

        const id = encodeURIComponent(_obj.name);
        const link = window.location.origin + window.location.pathname + "#" + id;

        // hide lore link, if lore is disabled
        if( loreshow === 'false' && _obj.name === 'Lore') {
            return '';
        }

        return (
            <a className="rules-page-anchor" href={link}>
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