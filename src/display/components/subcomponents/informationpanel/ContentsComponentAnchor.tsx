import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';

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
            <a className="hovermouse cleanunderline colorBasicText" href={"#"+_obj.route}>
                {"- " + _obj.name}
            </a>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <div>
            <div className="font-default bordergrey borderstyler backgroundBgCard">
                    <div className="totalmarginsml">
                        {props.listofcontents.map((item : ContentsLink) => 
                            <div key={item.route}>
                                {ReturnItemLink(item)}
                            </div>)}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ContentsComponentAnchor;